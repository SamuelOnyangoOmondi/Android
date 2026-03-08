package com.farmtopalm.terminal.biometric

import android.content.Context
import com.farmtopalm.terminal.biometric.dto.CaptureResult
import com.farmtopalm.terminal.biometric.dto.IdentifyResult
import com.farmtopalm.terminal.biometric.dto.PalmDeviceStatus
import com.farmtopalm.terminal.data.crypto.Crypto
import com.farmtopalm.terminal.data.db.dao.PalmTemplateDao
import com.farmtopalm.terminal.util.Logger
import com.farmtopalm.terminal.util.Result
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.runBlocking

/**
 * Implementation that wraps the palm vendor SDK via [PalmSdkBridge] / [VeinshinePalmSdk].
 * Open and capture use async APIs so the real device is used without blocking the main thread.
 */
class PalmBiometricManagerImpl(
    private val context: Context,
    private val palmTemplateDao: PalmTemplateDao
) : PalmBiometricManager {

    private var initialized = false
    private var deviceOpen = false
    private var lastError: String? = null
    private var modelsPath: String? = null

    override fun initialize(): Result<Unit> {
        if (initialized) return Result.Success(Unit)
        lastError = null
        try {
            val path = PalmSdkInstaller.getModelsPath(context)
            modelsPath = path
            if (!PalmSdkBridge.init(context, path)) {
                lastError = PalmSdkBridge.lastError
                return Result.Error(lastError ?: "Vendor init failed", null)
            }
            initialized = true
            val mode = if (PalmSdkBridge.isUsingRealSdk) "vendor" else "no SDK"
            Logger.d("Palm SDK init ($mode, models path: $path)")
            return Result.Success(Unit)
        } catch (e: Exception) {
            lastError = e.message
            Logger.e("Palm SDK init failed", e)
            return Result.Error(e.message ?: "Init failed", e)
        }
    }

    override fun open(scope: CoroutineScope, callback: (Result<Unit>) -> Unit) {
        if (!initialized) {
            callback(Result.Error("Not initialized", null))
            return
        }
        if (deviceOpen) {
            callback(Result.Success(Unit))
            return
        }
        lastError = null
        PalmSdkBridge.openAsync(scope) { ok ->
            if (ok) {
                deviceOpen = true
                Logger.d("Palm device open (${if (PalmSdkBridge.isUsingRealSdk) "vendor" else "no SDK"})")
                callback(Result.Success(Unit))
            } else {
                lastError = PalmSdkBridge.lastError
                callback(Result.Error(lastError ?: "Open failed", null))
            }
        }
    }

    override fun status(): PalmDeviceStatus = PalmDeviceStatus(
        initialized = initialized,
        deviceConnected = deviceOpen,
        open = deviceOpen,
        lastError = lastError ?: PalmSdkBridge.lastError
    )

    override fun captureForEnroll(scope: CoroutineScope, hand: String, callback: (Result<CaptureResult>) -> Unit) {
        if (!initialized || !deviceOpen) {
            callback(Result.Error("Device not ready", null))
            return
        }
        lastError = null
        PalmSdkBridge.captureForEnrollAsync(scope, hand) { capture ->
            if (capture != null) {
                callback(Result.Success(capture))
            } else {
                lastError = PalmSdkBridge.lastError
                callback(Result.Error(lastError ?: "Capture failed", null))
            }
        }
    }

    override fun captureForIdentify(scope: CoroutineScope, callback: (Result<CaptureResult>) -> Unit) {
        if (!initialized || !deviceOpen) {
            callback(Result.Error("Device not ready", null))
            return
        }
        lastError = null
        PalmSdkBridge.captureForIdentifyAsync(scope) { capture ->
            if (capture != null) {
                callback(Result.Success(capture))
            } else {
                lastError = PalmSdkBridge.lastError
                callback(Result.Error(lastError ?: "Capture failed", null))
            }
        }
    }

    override fun identify(capture: CaptureResult): Result<IdentifyResult> {
        if (!initialized) return Result.Error("Not initialized", null)
        lastError = null
        try {
            // Prefer SDK internal match: capture was done in identify mode (recogMode=2), SDK returns matchTemplateId + matchScore
            val sdkMatchId = capture.matchTemplateId
            val sdkMatchScore = capture.matchScore
            if (sdkMatchId != null && sdkMatchScore != null) {
                val template = runBlocking { palmTemplateDao.getBySdkTemplateId(sdkMatchId) }
                if (template != null) {
                    Logger.d("PalmIdentify: SDK match sdkTemplateId=$sdkMatchId -> studentId=${template.studentId} score=$sdkMatchScore")
                    val threshold = 0.7f
                    if (sdkMatchScore >= threshold) {
                        return Result.Success(IdentifyResult(studentId = template.studentId, confidence = sdkMatchScore))
                    }
                } else {
                    Logger.d("PalmIdentify: SDK returned matchTemplateId=$sdkMatchId but no row with sdkTemplateId (re-enroll with mode=1?)")
                }
            }

            // Fallback: manual compare (legacy DB or when SDK doesn't return match fields yet)
            val allTemplates = runBlocking { palmTemplateDao.getAllSync() }
            val templates = allTemplates
                .groupBy { "${it.studentId}_${it.hand}" }
                .values.map { group -> group.maxByOrNull { it.createdAt }!! }
            Logger.d("PalmIdentify: Templates loaded count = ${templates.size} (from ${allTemplates.size} rows); using manual compare fallback")
            if (templates.isEmpty()) {
                return Result.Error("No templates enrolled", null)
            }
            val rgb = capture.rgbFeature ?: return Result.Error("No capture data", null)
            val ir = capture.irFeature ?: rgb
            var bestId: String? = null
            var bestScore = 0f
            var secondBestScore = 0f
            var decryptFailCount = 0
            for (t in templates) {
                val tRgb = try {
                    Crypto.decrypt(context, t.rgbFeatureEnc)
                } catch (e: Exception) {
                    decryptFailCount++
                    Logger.w("PalmIdentify: decrypt failed for template ${t.studentId}_${t.hand}: ${e.message}")
                    continue
                }
                val tIr = try { Crypto.decrypt(context, t.irFeatureEnc) } catch (_: Exception) { tRgb }
                val score = PalmSdkBridge.compare(rgb, ir, tRgb, tIr)
                Logger.d("PalmIdentify: template ${t.studentId}_${t.hand} score=$score")
                if (score > bestScore) {
                    secondBestScore = bestScore
                    bestScore = score
                    bestId = t.studentId
                } else if (score > secondBestScore) {
                    secondBestScore = score
                }
            }
            if (decryptFailCount > 0) {
                Logger.w("PalmIdentify: $decryptFailCount template(s) could not be decrypted (Keystore unavailable?). Re-enroll those palms.")
            }
            val threshold = 0.7f
            // When SDK compare is unavailable we use cosine fallback; scores cluster ~0.5. Accept highest-scoring template if >= 0.50.
            val fallbackThreshold = 0.50f
            if (bestId != null && bestScore >= threshold) {
                return Result.Success(IdentifyResult(studentId = bestId, confidence = bestScore))
            }
            if (bestId != null && bestScore >= fallbackThreshold) {
                Logger.d("PalmIdentify: match via fallback (bestScore=$bestScore, secondBest=$secondBestScore)")
                return Result.Success(IdentifyResult(studentId = bestId, confidence = bestScore))
            }
            val comparedCount = templates.size - decryptFailCount
            if (comparedCount > 0) {
                Logger.d("PalmIdentify: no match (bestScore=$bestScore, secondBest=$secondBestScore, threshold=$threshold, compared=$comparedCount templates)")
            }
            return Result.Error("No match", null)
        } catch (e: Exception) {
            lastError = e.message
            return Result.Error(e.message ?: "Identify failed", e)
        }
    }

    override fun release(): Result<Unit> {
        try {
            PalmSdkBridge.release()
            deviceOpen = false
            // Keep initialized so Retry can call open() without re-initializing
            return Result.Success(Unit)
        } catch (e: Exception) {
            return Result.Error(e.message ?: "Release failed", e)
        }
    }
}
