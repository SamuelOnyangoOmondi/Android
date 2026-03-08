package com.farmtopalm.terminal.provisioning

import android.content.Context
import com.farmtopalm.terminal.data.crypto.Crypto
import com.farmtopalm.terminal.data.db.AppDatabase
import com.farmtopalm.terminal.data.repo.TerminalRepo
import com.farmtopalm.terminal.sync.SyncScheduler
import com.farmtopalm.terminal.util.Logger
import com.farmtopalm.terminal.util.Result
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class ProvisioningManager(private val context: Context) {

    private val terminalRepo = TerminalRepo(AppDatabase.getInstance(context).terminalConfigDao())
    private val client = OkHttpClient.Builder().connectTimeout(15, TimeUnit.SECONDS).build()
    private val jsonType = "application/json; charset=utf-8".toMediaType()

    suspend fun activate(activationCode: String, baseUrl: String): Result<ActivationResult> = withContext(Dispatchers.IO) {
        val normalizedBase = baseUrl.trim().let { u ->
            when {
                u.isEmpty() -> "http://10.0.2.2:3000"
                u.startsWith("http://") || u.startsWith("https://") -> u.trimEnd('/')
                else -> "http://${u.trimEnd('/')}"
            }
        }
        val url = normalizedBase + "/v1/terminals/activate"
        Logger.d("Activate URL: $url")
        val body = JSONObject().apply {
            put("activationCode", activationCode)
            put("deviceMeta", JSONObject().apply {
                put("model", android.os.Build.MODEL)
                put("osVersion", android.os.Build.VERSION.RELEASE)
            })
        }
        val request = Request.Builder()
            .url(url)
            .post(body.toString().toRequestBody(jsonType))
            .addHeader("Content-Type", jsonType.toString())
            .build()
        try {
            val response = client.newCall(request).execute()
            Logger.d("Activate response: ${response.code} ${response.message}")
            if (!response.isSuccessful) {
                val err = response.body?.string() ?: "HTTP ${response.code}"
                return@withContext Result.Error(err)
            }
            val json = JSONObject(response.body?.string() ?: "{}")
            val terminalId = json.optString("terminalId")
            val schoolId = json.optString("schoolId")
            val apiBaseUrl = json.optString("apiBaseUrl", baseUrl)
            val token = json.optString("token")
            if (terminalId.isBlank() || token.isBlank()) {
                return@withContext Result.Error("Invalid activation response")
            }
            val tokenEnc = Crypto.encrypt(context, token.toByteArray(Charsets.UTF_8))
            terminalRepo.saveConfig(terminalId, schoolId, apiBaseUrl, tokenEnc)
            SyncScheduler.schedule(context)
            Result.Success(ActivationResult(terminalId, schoolId, apiBaseUrl))
        } catch (e: Exception) {
            Logger.e("Activation failed", e)
            val msg = "${e.javaClass.simpleName}: ${e.message ?: "Network error"}"
            val hint = if (msg.contains("Failed to connect", ignoreCase = true) || msg.contains("Connection refused", ignoreCase = true) || msg.contains("Unable to resolve host", ignoreCase = true) || msg.contains("ConnectException", ignoreCase = true)) {
                " Use \"Test connection\" first. Same WiFi? Backend: npm run dev."
            } else ""
            Result.Error(msg + hint, e)
        }
    }

    /** GET /health to test if the device can reach the backend. Use before activating. */
    suspend fun pingHealth(baseUrl: String): Result<String> = withContext(Dispatchers.IO) {
        val normalizedBase = baseUrl.trim().let { u ->
            when {
                u.isEmpty() -> "http://192.168.1.128:3000"
                u.startsWith("http://") || u.startsWith("https://") -> u.trimEnd('/')
                else -> "http://${u.trimEnd('/')}"
            }
        }
        val url = normalizedBase + "/health"
        Logger.d("Ping URL: $url")
        try {
            val request = Request.Builder().url(url).get().build()
            val response = client.newCall(request).execute()
            val body = response.body?.string() ?: ""
            if (response.isSuccessful) Result.Success(body) else Result.Error("HTTP ${response.code}: $body")
        } catch (e: Exception) {
            Logger.e("Ping failed", e)
            val msg = "${e.javaClass.simpleName}: ${e.message}"
            Result.Error(msg, e)
        }
    }

    fun isActivated(): Boolean = kotlinx.coroutines.runBlocking { terminalRepo.isActivated() }

    data class ActivationResult(val terminalId: String, val schoolId: String, val apiBaseUrl: String)
}
