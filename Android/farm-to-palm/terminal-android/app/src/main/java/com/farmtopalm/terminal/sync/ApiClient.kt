package com.farmtopalm.terminal.sync

import com.farmtopalm.terminal.data.db.entities.AttendanceEventEntity
import com.farmtopalm.terminal.data.db.entities.MealEventEntity
import com.farmtopalm.terminal.util.Logger
import com.farmtopalm.terminal.util.Result
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class ApiClient(
    private val baseUrl: String,
    private val token: String
) {
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()
    private val jsonType = "application/json; charset=utf-8".toMediaType()

    suspend fun postAttendanceBulk(events: List<AttendanceEventEntity>, externalIdByStudentId: (String) -> String?): Result<Unit> = withContext(Dispatchers.IO) {
        val arr = JSONArray()
        events.forEach { e ->
            arr.put(JSONObject().apply {
                put("eventId", e.id)
                put("externalId", externalIdByStudentId(e.studentId))
                put("terminalId", e.terminalId)
                put("schoolId", e.schoolId)
                put("ts", e.ts)
                put("confidence", e.confidence.toDouble())
            })
        }
        post("/v1/events/attendance/bulk", JSONObject().put("events", arr).toString())
    }

    suspend fun postMealsBulk(events: List<MealEventEntity>, externalIdByStudentId: (String) -> String?): Result<Unit> = withContext(Dispatchers.IO) {
        val arr = JSONArray()
        events.forEach { e ->
            arr.put(JSONObject().apply {
                put("eventId", e.id)
                put("externalId", externalIdByStudentId(e.studentId))
                put("terminalId", e.terminalId)
                put("schoolId", e.schoolId)
                put("ts", e.ts)
                put("method", e.method)
            })
        }
        post("/v1/events/meals/bulk", JSONObject().put("events", arr).toString())
    }

    private fun post(path: String, body: String): Result<Unit> {
        val url = baseUrl.trimEnd('/') + path
        val request = Request.Builder()
            .url(url)
            .addHeader("Authorization", "Bearer $token")
            .addHeader("Content-Type", jsonType.toString())
            .post(body.toRequestBody(jsonType))
            .build()
        return try {
            val response = client.newCall(request).execute()
            if (response.isSuccessful) Result.Success(Unit)
            else {
                Logger.e("API error: ${response.code} ${response.body?.string()}")
                Result.Error("HTTP ${response.code}")
            }
        } catch (e: Exception) {
            Logger.e("API request failed", e)
            Result.Error(e.message ?: "Network error", e)
        }
    }
}
