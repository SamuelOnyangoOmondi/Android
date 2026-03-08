package com.farmtopalm.terminal.biometric

import android.content.Context
import com.farmtopalm.terminal.biometric.dto.CaptureResult
import com.farmtopalm.terminal.util.Logger
import com.farmtopalm.terminal.usb.ensureUsbPermission
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * Facade over the palm SDK. When the Veinshine JAR is on the classpath, uses [VeinshinePalmSdk]
 * (real hardware). When not, [isUsingRealSdk] is false and open/capture fail with [lastError] (no mock).
 *
 * Open and capture are async: use [openAsync] and [captureForEnrollAsync] / [captureForIdentifyAsync].
 * Sync [open] and [captureForEnroll] / [captureForIdentify] return false/null with [lastError] when
 * real SDK is used (call the async APIs from a coroutine instead).
 */
object PalmSdkBridge {

    private val veinshine = VeinshinePalmSdk()

    @Volatile
    var isUsingRealSdk: Boolean = false
        private set

    var lastError: String?
        get() = _lastError ?: veinshine.lastError
        private set(value) { _lastError = value }
    private var _lastError: String? = null

    init {
        isUsingRealSdk = veinshine.isAvailable
        if (isUsingRealSdk) Logger.d("PalmSdkBridge: using Veinshine SDK")
        else Logger.d("PalmSdkBridge: no vendor SDK, open/capture will fail")
    }

    private var appContext: Context? = null

    fun init(context: Context, modelsPath: String): Boolean {
        lastError = null
        appContext = context.applicationContext
        if (!isUsingRealSdk) return true
        val ok = veinshine.initialize(context, modelsPath)
        if (ok) Logger.d("Veinshine: SDK init OK")
        else lastError = veinshine.lastError
        return ok
    }

    /**
     * Synchronous open. When using real SDK this returns false; call [openAsync] from a coroutine instead.
     */
    fun open(): Boolean {
        lastError = null
        if (!isUsingRealSdk) return true
        lastError = "Use openAsync(scope, onResult) from a coroutine"
        Logger.d("PalmSdkBridge: open() called synchronously; use openAsync")
        return false
    }

    /**
     * Open the device asynchronously. Call from a coroutine or with a scope.
     */
    fun openAsync(scope: CoroutineScope, onResult: (Boolean) -> Unit) {
        lastError = null
        if (!isUsingRealSdk) {
            onResult(true)
            return
        }
        val ctx = appContext
        if (ctx == null) {
            lastError = "Context not set; call init() first"
            onResult(false)
            return
        }
        scope.launch(Dispatchers.IO) {
            val hasPermission = ensureUsbPermission(ctx)
            if (!hasPermission) {
                _lastError = "USB permission denied or Eyecool device (735f:6204) not found"
                withContext(Dispatchers.Main) { onResult(false) }
                return@launch
            }
            val ok = veinshine.open(ctx)
            withContext(Dispatchers.Main) {
                if (ok) Logger.d("Palm device open (vendor)")
                else _lastError = veinshine.lastError
                onResult(ok)
            }
        }
    }

    /**
     * Synchronous capture. When using real SDK this returns null; use [captureForEnrollAsync] instead.
     */
    fun captureForEnroll(hand: String): CaptureResult? {
        lastError = null
        if (!isUsingRealSdk) {
            lastError = "Vendor SDK not installed"
            return null
        }
        if (!veinshine.isOpen) {
            lastError = "Device not open; call openAsync first"
            return null
        }
        lastError = "Use captureForEnrollAsync(scope, hand, onResult)"
        return null
    }

    /**
     * Capture for enrollment asynchronously.
     */
    fun captureForEnrollAsync(scope: CoroutineScope, hand: String, onResult: (CaptureResult?) -> Unit) {
        lastError = null
        if (!isUsingRealSdk) {
            lastError = "Vendor SDK not installed"
            onResult(null)
            return
        }
        if (!veinshine.isOpen) {
            lastError = "Device not open"
            onResult(null)
            return
        }
        scope.launch(Dispatchers.IO) {
            val result = veinshine.captureOnceForEnroll(hand)
            withContext(Dispatchers.Main) {
                if (result != null) Logger.d("Capture success (vendor): rgbBytes=${result.rgbFeature?.size ?: 0}, irBytes=${result.irFeature?.size ?: 0}, quality=${result.quality}")
                else lastError = veinshine.lastError
                onResult(result)
            }
        }
    }

    /**
     * Synchronous capture for identify. When using real SDK returns null; use [captureForIdentifyAsync].
     */
    fun captureForIdentify(): CaptureResult? {
        lastError = null
        if (!isUsingRealSdk) {
            lastError = "Vendor SDK not installed"
            return null
        }
        if (!veinshine.isOpen) {
            lastError = "Device not open; call openAsync first"
            return null
        }
        lastError = "Use captureForIdentifyAsync(scope, onResult)"
        return null
    }

    /**
     * Capture for identification asynchronously.
     */
    fun captureForIdentifyAsync(scope: CoroutineScope, onResult: (CaptureResult?) -> Unit) {
        lastError = null
        if (!isUsingRealSdk) {
            lastError = "Vendor SDK not installed"
            onResult(null)
            return
        }
        if (!veinshine.isOpen) {
            lastError = "Device not open"
            onResult(null)
            return
        }
        scope.launch(Dispatchers.IO) {
            val result = veinshine.captureOnceForIdentify()
            withContext(Dispatchers.Main) {
                if (result != null) Logger.d("Capture success (vendor): rgbBytes=${result.rgbFeature?.size ?: 0}, irBytes=${result.irFeature?.size ?: 0}, quality=${result.quality}")
                else lastError = veinshine.lastError
                onResult(result)
            }
        }
    }

    fun compare(probeRgb: ByteArray, probeIr: ByteArray, templateRgb: ByteArray, templateIr: ByteArray): Float {
        if (isUsingRealSdk && veinshine.isOpen) {
            val score = veinshine.compareFeatureScore(probeRgb, probeIr, templateRgb, templateIr)
            if (score != null) return score
            // SDK returned null (e.g. result=4: raw bytes not supported). Use software cosine similarity as fallback.
            val fallback = cosineSimilarityFeature(probeRgb, probeIr, templateRgb, templateIr)
            if (fallback >= 0f) {
                Logger.d("PalmSdkBridge: using cosine-similarity fallback (SDK compare not supported on this build): score=$fallback")
                return fallback
            }
        }
        lastError = if (isUsingRealSdk) (veinshine.lastError ?: "Compare failed") else "Vendor SDK not installed"
        return 0f
    }

    /**
     * Fallback when SDK compareFeatureScore returns result=4 (unsupported format).
     * Tries int8 interpretation first (2064 bytes = 2064 signed bytes, common for embeddings), then float LE (516 floats).
     * Returns similarity in [0,1]; higher = more likely same person.
     */
    private fun cosineSimilarityFeature(probeRgb: ByteArray, probeIr: ByteArray, templateRgb: ByteArray, templateIr: ByteArray): Float {
        fun cosSimInt8(a: ByteArray, b: ByteArray): Float {
            if (a.size != b.size) return -1f
            var sum = 0.0
            var normA = 0.0
            var normB = 0.0
            for (i in a.indices) {
                val va = a[i].toInt().toDouble()
                val vb = b[i].toInt().toDouble()
                sum += va * vb
                normA += va * va
                normB += vb * vb
            }
            if (normA <= 0 || normB <= 0) return -1f
            return (sum / (kotlin.math.sqrt(normA) * kotlin.math.sqrt(normB))).toFloat().coerceIn(-1f, 1f)
        }
        fun readFloatLe(arr: ByteArray, offset: Int): Float {
            val bits = (arr[offset].toInt() and 0xff) or
                ((arr[offset + 1].toInt() and 0xff) shl 8) or
                ((arr[offset + 2].toInt() and 0xff) shl 16) or
                ((arr[offset + 3].toInt() and 0xff) shl 24)
            return java.lang.Float.intBitsToFloat(bits)
        }
        fun cosSimFloat(a: ByteArray, b: ByteArray): Float {
            if (a.size != b.size || a.size < 4) return -1f
            val len = a.size / 4
            var sum = 0.0
            var normA = 0.0
            var normB = 0.0
            for (i in 0 until len) {
                val va = readFloatLe(a, i * 4)
                val vb = readFloatLe(b, i * 4)
                if (!va.isNaN() && !vb.isNaN()) {
                    sum += va * vb
                    normA += va * va
                    normB += vb * vb
                }
            }
            if (normA <= 0 || normB <= 0) return -1f
            return (sum / (kotlin.math.sqrt(normA) * kotlin.math.sqrt(normB))).toFloat().coerceIn(-1f, 1f)
        }
        fun toScore01(simRgb: Float, simIr: Float): Float {
            if (simRgb < -1.5f && simIr < -1.5f) return -1f
            val rgb = if (simRgb in -1f..1f) simRgb else 0f
            val ir = if (simIr in -1f..1f) simIr else 0f
            val avg = if (rgb >= 0f && ir >= 0f) (rgb + ir) / 2f else if (rgb >= 0f) rgb else if (ir >= 0f) ir else 0f
            return ((avg + 1f) / 2f).coerceIn(0f, 1f)
        }
        val int8Rgb = cosSimInt8(probeRgb, templateRgb)
        val int8Ir = cosSimInt8(probeIr, templateIr)
        val scoreInt8 = toScore01(int8Rgb, int8Ir)
        val floatRgb = cosSimFloat(probeRgb, templateRgb)
        val floatIr = cosSimFloat(probeIr, templateIr)
        val scoreFloat = toScore01(floatRgb, floatIr)
        return maxOf(scoreInt8, scoreFloat).coerceIn(0f, 1f)
    }

    /** Runtime metadata (stream type + model hashes) for template compatibility checks. */
    fun getRuntimeMetadata(): VeinshinePalmSdk.RuntimeMetadata {
        return veinshine.getRuntimeMetadata()
    }

    fun release() {
        if (isUsingRealSdk) veinshine.release()
        appContext = null
    }

    /** For Hardware Self Test: run init → open → capture once and report result. */
    fun runHardwareSelfTest(scope: CoroutineScope, onResult: (success: Boolean, rgbBytes: Int, irBytes: Int, quality: Int, error: String?) -> Unit) {
        lastError = null
        scope.launch(Dispatchers.IO) {
            if (!isUsingRealSdk) {
                withContext(Dispatchers.Main) { onResult(false, 0, 0, 0, "Vendor SDK not installed") }
                return@launch
            }
            val ctx = appContext
            if (ctx == null) {
                withContext(Dispatchers.Main) { onResult(false, 0, 0, 0, "Call init() first") }
                return@launch
            }
            if (!veinshine.isInitialized) {
                veinshine.initialize(ctx, null)
            }
            if (!veinshine.isOpen) {
                veinshine.open(ctx)
            }
            if (!veinshine.isOpen) {
                withContext(Dispatchers.Main) { onResult(false, 0, 0, 0, veinshine.lastError ?: "Open failed") }
                return@launch
            }
            val capture = veinshine.captureOnceForIdentify()
            withContext(Dispatchers.Main) {
                if (capture != null) {
                    onResult(true, capture.rgbFeature?.size ?: 0, capture.irFeature?.size ?: 0, capture.quality, null)
                } else {
                    onResult(false, 0, 0, 0, veinshine.lastError ?: "Capture failed")
                }
            }
        }
    }
}
