package com.farmtopalm.terminal.sync

import android.content.Context
import com.farmtopalm.terminal.data.crypto.Crypto
import com.farmtopalm.terminal.data.db.AppDatabase
import com.farmtopalm.terminal.data.repo.EventRepo
import com.farmtopalm.terminal.data.repo.TerminalRepo
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Runs sync in the app process so DB updates are immediately visible.
 * Use this for manual "Sync now" instead of WorkManager to avoid cross-process DB issues.
 */
object SyncRunner {

    data class Result(val success: Boolean, val error: String? = null)

    suspend fun runSync(
        context: Context,
        onProgress: suspend (progress: Int, stage: String) -> Unit
    ): Result = withContext(Dispatchers.IO) {
        val db = AppDatabase.getInstance(context)
        val terminalRepo = TerminalRepo(db.terminalConfigDao())
        val eventRepo = EventRepo(db.attendanceEventDao(), db.mealEventDao())

        val config = terminalRepo.getConfig() ?: return@withContext Result(false, "Not activated")
        val tokenBytes = try {
            Crypto.decrypt(context.applicationContext, config.tokenEnc)
        } catch (e: Exception) {
            return@withContext Result(false, "Token error")
        }
        val token = String(tokenBytes)
        val client = ApiClient(config.apiBaseUrl, config.apiBaseUrlFallback, token)

        val attendance = eventRepo.getUnsyncedAttendance()
        val meals = eventRepo.getUnsyncedMeals()
        val studentDao = db.studentDao()
        val studentIds = (attendance.map { it.studentId } + meals.map { it.studentId }).distinct()
        val idToExternal = mutableMapOf<String, String>()
        studentIds.forEach { id -> studentDao.getById(id)?.let { idToExternal[id] = it.externalId } }
        var ok = true
        var lastError: String? = null

        onProgress(0, "Starting…")
        if (attendance.isNotEmpty()) {
            onProgress(15, "Syncing attendance…")
            when (val r = client.postAttendanceBulk(attendance) { idToExternal[it] }) {
                is com.farmtopalm.terminal.util.Result.Success -> eventRepo.markAttendanceSynced(attendance.map { it.id })
                is com.farmtopalm.terminal.util.Result.Error -> { ok = false; lastError = r.message }
            }
        }
        onProgress(40, "Syncing meals…")
        if (meals.isNotEmpty()) {
            when (val r = client.postMealsBulk(meals) { idToExternal[it] }) {
                is com.farmtopalm.terminal.util.Result.Success -> eventRepo.markMealsSynced(meals.map { it.id })
                is com.farmtopalm.terminal.util.Result.Error -> { ok = false; lastError = r.message }
            }
        }
        onProgress(65, "Syncing palms…")
        val unsyncedPalms = db.palmTemplateDao().getUnsynced()
        for (palm in unsyncedPalms) {
            val extId = studentDao.getById(palm.studentId)?.externalId ?: palm.studentId
            val rgb = try { Crypto.decrypt(context.applicationContext, palm.rgbFeatureEnc) } catch (_: Exception) { null }
            val ir = try { Crypto.decrypt(context.applicationContext, palm.irFeatureEnc) } catch (_: Exception) { null }
            if (rgb != null && ir != null) {
                when (val r = client.postPalmSync(extId, palm.hand, rgb, ir, palm.quality)) {
                    is com.farmtopalm.terminal.util.Result.Success -> db.palmTemplateDao().markSynced(palm.id)
                    is com.farmtopalm.terminal.util.Result.Error -> { ok = false; lastError = r.message }
                }
            }
        }
        onProgress(100, if (ok) "Sync complete" else (lastError ?: "Sync had errors"))
        if (ok) terminalRepo.updateHeartbeat()
        Result(ok, lastError)
    }
}
