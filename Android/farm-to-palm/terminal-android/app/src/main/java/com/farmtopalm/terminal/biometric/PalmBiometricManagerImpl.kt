package com.farmtopalm.terminal.biometric

import android.content.Context
import com.farmtopalm.terminal.biometric.dto.CaptureResult
import com.farmtopalm.terminal.biometric.dto.IdentifyResult
import com.farmtopalm.terminal.biometric.dto.MatchStatus
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
    private val palmTemplateDao: PalmTemplateDao,
    private val matchConfig: PalmMatchConfig = PalmMatchConfig()
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
            // Quality gate: reject low-quality scans before matching
            if (matchConfig.minQualityScore > 0 && capture.quality < matchConfig.minQualityScore) {
                Logger.d("PalmIdentify: quality gate rejected (quality=${capture.quality} < min=${matchConfig.minQualityScore})")
                return Result.Success(IdentifyResult("", 0f, MatchStatus.NO_MATCH))
            }

            val scannedHand = capture.hand?.trim()?.lowercase()?.takeIf { it in listOf("left", "right") }

            // Prefer SDK internal match: capture was done in identify mode (recogMode=2), SDK returns matchTemplateId + matchScore
            val sdkMatchId = capture.matchTemplateId
            val sdkMatchScore = capture.matchScore
            if (sdkMatchId != null && sdkMatchScore != null) {
                val template = runBlocking { palmTemplateDao.getBySdkTemplateId(sdkMatchId) }
                if (template != null) {
                    // Hand-side enforcement: reject if scanned hand known and doesn't match template
                    if (matchConfig.useHandEnforcement && scannedHand != null) {
                        val templateHand = template.hand.trim().lowercase()
                        if (templateHand != "unknown" && templateHand != scannedHand) {
                            Logger.d("PalmIdentify: hand mismatch rejected (scanned=$scannedHand, template=$templateHand)")
                            return Result.Success(IdentifyResult("", 0f, MatchStatus.NO_MATCH))
                        }
                    }
                    Logger.d("PalmIdentify: SDK match sdkTemplateId=$sdkMatchId -> studentId=${template.studentId} score=$sdkMatchScore")
                    val status = when {
                        sdkMatchScore >= matchConfig.minAcceptScore -> MatchStatus.VERIFIED
                        sdkMatchScore >= 0.5f -> MatchStatus.LOW_CONFIDENCE
                        else -> MatchStatus.NO_MATCH
                    }
                    return Result.Success(IdentifyResult(studentId = template.studentId, confidence = sdkMatchScore, matchStatus = status))
                } else {
                    Logger.d("PalmIdentify: SDK returned matchTemplateId=$sdkMatchId but no row with sdkTemplateId (re-enroll with mode=1?)")
                }
            }

            // Fallback: manual compare (legacy DB or when SDK doesn't return match fields yet)
            val allTemplates = runBlocking { palmTemplateDao.getAllSync() }
            var templates = allTemplates
                .groupBy { "${it.studentId}_${it.hand}" }
                .values.map { group -> group.maxByOrNull { it.createdAt }!! }

            // Hand-side enforcement: filter to matching hand when known
            if (matchConfig.useHandEnforcement && scannedHand != null) {
                templates = templates.filter { t ->
                    val h = t.hand.trim().lowercase()
                    h == "unknown" || h == scannedHand
                }
                if (templates.isEmpty() && allTemplates.isNotEmpty()) {
                    Logger.d("PalmIdentify: no templates for hand=$scannedHand (hand-side enforcement)")
                    return Result.Success(IdentifyResult("", 0f, MatchStatus.NO_MATCH))
                }
            } else if (matchConfig.useHandEnforcement && !matchConfig.allowUnknownHandMatch) {
                Logger.d("PalmIdentify: hand unknown and allowUnknownHandMatch=false")
                return Result.Success(IdentifyResult("", 0f, MatchStatus.NO_MATCH))
            }

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

            // Top-2 margin: reject ambiguous matches (top-1 too close to top-2)
            val margin = bestScore - secondBestScore
            if (bestId != null && margin < matchConfig.minMarginScore && secondBestScore > 0f) {
                Logger.d("PalmIdentify: top-2 margin rejected (best=$bestScore, second=$secondBestScore, margin=$margin < min=${matchConfig.minMarginScore})")
                return Result.Success(IdentifyResult("", bestScore, MatchStatus.NO_MATCH))
            }

            val status = when {
                bestId != null && bestScore >= matchConfig.minAcceptScore -> MatchStatus.VERIFIED
                bestId != null && bestScore >= 0.5f -> MatchStatus.LOW_CONFIDENCE
                else -> MatchStatus.NO_MATCH
            }

            if (status == MatchStatus.VERIFIED) {
                return Result.Success(IdentifyResult(studentId = bestId!!, confidence = bestScore, matchStatus = status))
            }
            if (status == MatchStatus.LOW_CONFIDENCE) {
                Logger.d("PalmIdentify: low confidence (bestScore=$bestScore, secondBest=$secondBestScore, minAccept=${matchConfig.minAcceptScore})")
                return Result.Success(IdentifyResult(studentId = bestId!!, confidence = bestScore, matchStatus = status))
            }
            val comparedCount = templates.size - decryptFailCount
            if (comparedCount > 0) {
                Logger.d("PalmIdentify: no match (bestScore=$bestScore, secondBest=$secondBestScore, minAccept=${matchConfig.minAcceptScore}, compared=$comparedCount templates)")
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
