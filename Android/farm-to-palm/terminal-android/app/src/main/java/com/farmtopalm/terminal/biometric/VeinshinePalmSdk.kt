package com.farmtopalm.terminal.biometric

import android.content.Context
import android.os.Handler
import android.os.Looper
import com.farmtopalm.terminal.biometric.dto.CaptureResult
import com.farmtopalm.terminal.palm.PalmModelsInstaller
import com.farmtopalm.terminal.util.Logger
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import java.util.concurrent.CountDownLatch
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.locks.ReentrantLock
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicLong
import java.util.concurrent.atomic.AtomicReference
import kotlin.coroutines.resume

/**
 * Kotlin wrapper around the Veinshine palm SDK (com.api.stream.*).
 * Uses reflection so the app compiles without the vendor JAR; at runtime
 * requires the JAR in app/libs/ and .so in jniLibs/.
 *
 * All blocking SDK calls run on Dispatchers.IO. Capture/open use suspendCancellableCoroutine
 * to convert vendor callbacks into suspend functions.
 */
class VeinshinePalmSdk {

    private var palmSdkClass: Class<*>? = null
    private var deviceClass: Class<*>? = null
    private var deviceInstance: Any? = null
    private var veinshineInstance: Any? = null

    var isAvailable: Boolean = false
        private set

    var lastError: String? = null
        private set

    var isInitialized: Boolean = false
        private set

    var isOpen: Boolean = false
        private set

    private val captureInProgress = AtomicBoolean(false)

    private val opening = AtomicBoolean(false)
    private val openMutex = Mutex()

    /** Instance strong refs (some builds behave oddly with companion-only refs). */
    private var deviceOpenHolder: Any? = null
    private var openCallbackHolder: Any? = null
    private var deviceStrong: Any? = null
    private var openCallbackStrong: Any? = null

    /** Static strong refs until release() — required for buggy SDKs that keep only weak refs to callback. */
    companion object {
        /** Second param to capturePalmOnce(callback, int): on many builds this is timeout in MS, not recog mode. Passing 2 → 2ms timeout → instant kTimeout. */
        private const val CAPTURE_TIMEOUT_MS = 30_000
        private const val RECOG_MODE_REGISTER = 1
        private const val RECOG_MODE_IDENTIFY = 2

        @JvmField
        @Volatile
        var strongDevice: Any? = null

        @JvmField
        @Volatile
        var strongOpenCallback: Any? = null
    }

    /** Wait for Device.create() listener (USB permission can take 10–20s on some devices). */
    private val deviceCreateWaitSec = 25L
    private val openTimeoutSec = 15L
    private val captureTimeoutSec = 30L
    /** Min ms to wait after release() before open() so native g_instanceDic can clear. */
    private val delayAfterReleaseMs = 500L
    private val lastReleaseTimeMs = AtomicLong(0L)

    /** Single-thread executor so capture never overlaps; callbacks can run on SDK thread. */
    private val captureExecutor = Executors.newSingleThreadExecutor()
    /** Lock around any device stop/start/capture so no two threads invoke SDK concurrently. */
    private val deviceCallLock = ReentrantLock()
    /** Last hint from capture callback (e.g. UNEXPECTED_CENTER_BOX_POS) for user-facing no-result message. */
    private val lastCaptureHintRef = AtomicReference<String?>(null)
    /** Strong ref to capture callback so it is not GC'd before SDK invokes it. */
    @Volatile
    private var captureCallbackHolder: Any? = null
    /** True only after StartPalmCapture until we get frame/error/timeout. Only call StopPalmCapture when this is true to avoid SDK "mICapturePalmCallback is null". */
    private val captureSessionActive = AtomicBoolean(false)

    /** Stream must be started before capturePalmOnce (0x42023 = "Unopened flow" otherwise). */
    @Volatile private var streamHolder: Any? = null
    @Volatile private var streamRunning = false
    private val gotFirstFrame = AtomicBoolean(false)
    private val streamThreadRef = AtomicReference<Thread?>(null)
    /** Stream type chosen at startStream (e.g. "RGB_IR", "IR"); stored for template metadata. */
    @Volatile private var currentStreamType: String? = null

    init {
        try {
            palmSdkClass = Class.forName("com.api.stream.PalmSdk")
            deviceClass = Class.forName("com.api.stream.Device")
            isAvailable = true
            Logger.d("Veinshine: SDK classes loaded")
        } catch (e: ClassNotFoundException) {
            Logger.d("Veinshine: SDK not on classpath")
            isAvailable = false
        }
    }

    fun initialize(context: Context, modelsPath: String? = null): Boolean {
        lastError = null
        if (!isAvailable || palmSdkClass == null) {
            lastError = "SDK not available"
            return false
        }
        return try {
            val cls = palmSdkClass!!
            val initM = cls.methods.firstOrNull { it.name == "initialize" }
            when (initM?.parameterCount) {
                0 -> initM.invoke(null)
                1 -> initM.invoke(null, context)
                2 -> if (modelsPath != null) initM.invoke(null, context, modelsPath) else initM.invoke(null, context)
                else -> null
            }
            try {
                val verM = cls.getMethod("getSdkVersion")
                Logger.d("Veinshine: initialize OK, version=${verM.invoke(null)}")
            } catch (_: Throwable) { Logger.d("Veinshine: initialize OK") }
            isInitialized = true
            true
        } catch (e: Exception) {
            lastError = e.message ?: "initialize failed"
            Logger.e("Veinshine: initialize failed", e)
            false
        }
    }

    /**
     * Open device once; reuse same instance if already open. Single-flight: concurrent callers get
     * "Already opening"; if already open returns true without calling create/open again (avoids g_instanceDic "device index exist").
     * Only call [release] when you need a full teardown (e.g. Retry after error); do not release on every screen leave.
     */
    suspend fun open(context: Context): Boolean {
        openMutex.withLock {
            if (isOpen && deviceInstance != null) {
                Logger.d("Veinshine: already open, reusing same device")
                return true
            }
            if (opening.get()) {
                lastError = "Already opening"
                Logger.d("Veinshine: open blocked (already in progress)")
                return false
            }
            opening.set(true)
        }
        // After a recent release(), wait so native stack can clear g_instanceDic before we open again.
        val releasedAt = lastReleaseTimeMs.get()
        if (releasedAt > 0L) {
            val elapsed = System.currentTimeMillis() - releasedAt
            if (elapsed < delayAfterReleaseMs && elapsed >= 0) {
                val waitMs = delayAfterReleaseMs - elapsed
                Logger.d("Veinshine: waiting ${waitMs}ms after release before open")
                delay(waitMs)
            }
        }
        return try {
            suspendCancellableCoroutine { cont ->
                if (!isAvailable || !isInitialized) {
                    lastError = "SDK not initialized"
                    cont.resume(false)
                    return@suspendCancellableCoroutine
                }
                // SDK native code (nativeOpen) uses weak refs that must be used on the main thread.
                CoroutineScope(Dispatchers.Main).launch {
                    try {
                        Logger.d("Veinshine: open requested")
                        val device = createAndOpenDevice(context.applicationContext)
                        if (device == null) {
                            cont.resume(false)
                            return@launch
                        }
                        deviceInstance = device
                        veinshineInstance = device
                        isOpen = true
                        Logger.d("Veinshine: open success")
                        cont.resume(true)
                    } catch (e: Exception) {
                        lastError = e.message ?: "open failed"
                        Logger.e("Veinshine: open failed", e)
                        cont.resume(false)
                    } finally {
                        opening.set(false)
                    }
                }
            }
        } catch (e: Exception) {
            opening.set(false)
            throw e
        }
    }

    private suspend fun createAndOpenDevice(context: Context): Any? {
        val deviceCls = deviceClass ?: return null
        val createMethod = deviceCls.methods.firstOrNull { it.name == "create" && it.parameterCount >= 1 }
            ?: run { lastError = "Device.create not found"; return null }
        val paramTypes = createMethod.parameterTypes
        if (paramTypes[0] != Context::class.java) {
            lastError = "Device.create first param is not Context"
            return null
        }

        val deviceRef = AtomicReference<Any?>()
        val deviceLatch = CountDownLatch(1)
        val openLatch = CountDownLatch(1)
        val openSuccessSignalled = AtomicBoolean(false)

        val listenerIface = paramTypes.getOrNull(1)
            ?: run {
                lastError = "Device.create(Context, listener) interface missing"
                return null
            }

        val deviceListener = java.lang.reflect.Proxy.newProxyInstance(
            deviceCls.classLoader,
            arrayOf(listenerIface)
        ) { _, _, args ->
            if (args != null && args.isNotEmpty()) {
                for (a in args) {
                    if (a != null && a.javaClass.methods.any { it.name == "open" }) {
                        deviceRef.set(a)
                        deviceLatch.countDown()
                        break
                    }
                }
            }
            null
        }

        val stateListener = if (paramTypes.size > 2) {
            java.lang.reflect.Proxy.newProxyInstance(deviceCls.classLoader, arrayOf(paramTypes[2])) { _, _, _ -> null }
        } else null

        val createArgs = when (createMethod.parameterCount) {
            1 -> arrayOf(context)
            2 -> arrayOf(context, deviceListener)
            else -> arrayOf(context, deviceListener, stateListener ?: deviceListener)
        }
        val createResult = createMethod.invoke(null, *createArgs)

        Logger.d("Veinshine: waiting up to ${deviceCreateWaitSec}s for device (USB permission may be required)")
        val device = withContext(Dispatchers.IO) {
            when {
                createResult != null && createResult.javaClass.methods.any { it.name == "open" } -> createResult
                deviceLatch.await(deviceCreateWaitSec, TimeUnit.SECONDS) -> deviceRef.get()
                else -> null
            }
        }
        if (device == null) {
            lastError = "Device not created (wait ${deviceCreateWaitSec}s for USB permission?)"
            return null
        }
        Logger.d("Veinshine: Device.create returned device")

        val openCallback = VeinshineOpenCallback(openLatch, openSuccessSignalled) { msg -> Logger.d("Veinshine: $msg") }
        openCallbackStrong = openCallback
        strongOpenCallback = openCallback
        deviceStrong = device
        strongDevice = device
        deviceOpenHolder = device
        openCallbackHolder = openCallback

        val openMethod = device.javaClass.getMethod("open", com.api.stream.IOpenCallback::class.java)
        openMethod.invoke(device, openCallback)
        var opened = withContext(Dispatchers.IO) {
            openLatch.await(openTimeoutSec, TimeUnit.SECONDS)
        }
        // Callback may run just after await timed out; treat its success flag as authoritative.
        if (!opened) {
            delay(150)
            if (openSuccessSignalled.get()) {
                opened = true
                Logger.d("Veinshine: open success (signalled after await — avoiding false timeout)")
            }
        }
        if (!opened) {
            lastError = "Scanner already in use (device index exists). Close other scanner apps or tap Retry to restart."
            Logger.d("Veinshine: open timeout — likely g_instanceDic device index exist; closing device")
            // Close device so native g_instanceDic is cleared and next open can succeed.
            try {
                tryDestroyStreams(device)
                device.javaClass.methods.firstOrNull { it.name == "close" || it.name == "release" }?.invoke(device)
            } catch (_: Throwable) { }
            strongOpenCallback = null
            strongDevice = null
            deviceOpenHolder = null
            openCallbackHolder = null
            deviceStrong = null
            openCallbackStrong = null
            return null
        }
        // Vendor PalmSDK-L: capture returns no frames unless enableDimPalm(modelPath) is called.
        val modelsDir = PalmModelsInstaller.ensureInstalled(context)
        val modelPath = modelsDir.absolutePath.trimEnd('/') + "/"
        val enableMethod = device.javaClass.methods.firstOrNull { m ->
            m.name == "enableDimPalm" && m.parameterCount == 1 && m.parameterTypes.getOrNull(0) == String::class.java
        }
        if (enableMethod != null) {
            try {
                val ret = enableMethod.invoke(device, modelPath)
                val code = (ret as? Number)?.toInt() ?: -1
                if (code != 0) {
                    lastError = "enableDimPalm failed ret=$code path=$modelPath"
                    Logger.d("Veinshine: $lastError")
                    try {
                        tryDestroyStreams(device)
                        device.javaClass.methods.firstOrNull { it.name == "close" || it.name == "release" }?.invoke(device)
                    } catch (_: Throwable) { }
                    strongOpenCallback = null
                    strongDevice = null
                    deviceOpenHolder = null
                    openCallbackHolder = null
                    deviceStrong = null
                    openCallbackStrong = null
                    return null
                }
                Logger.d("Veinshine: enableDimPalm OK path=$modelPath")
            } catch (e: Throwable) {
                lastError = "enableDimPalm exception: ${e.message}"
                Logger.e("Veinshine: enableDimPalm failed", e)
                try {
                    tryDestroyStreams(device)
                    device.javaClass.methods.firstOrNull { it.name == "close" || it.name == "release" }?.invoke(device)
                } catch (_: Throwable) { }
                strongOpenCallback = null
                strongDevice = null
                deviceOpenHolder = null
                openCallbackHolder = null
                deviceStrong = null
                openCallbackStrong = null
                return null
            }
        } else {
            Logger.d("Veinshine: enableDimPalm not found on device (capture may return no frames)")
        }
        startStream(device)
        return device
    }

    /**
     * Start stream so frames flow; required before capturePalmOnce (else 0x42023 "Unopened flow").
     * Uses reflection: deviceSupportStreamType -> createStream(type) -> allocateFrames -> start -> getFrames loop.
     * @param forceStreamType if non-null (e.g. "IR"), use this type for IR-only device fallback; must be in supported list.
     */
    private fun startStream(device: Any, forceStreamType: String? = null) {
        if (streamRunning) return
        val deviceCls = device.javaClass
        val supportedTypes = try {
            deviceCls.methods.firstOrNull { m ->
                (m.name == "getDeviceSupportStreamType" || m.name == "deviceSupportStreamType") && m.parameterCount == 0
            }?.invoke(device)
                ?: run {
                    val f = deviceCls.declaredFields.firstOrNull { it.name == "deviceSupportStreamType" }
                        ?: deviceCls.declaredFields.firstOrNull { it.name.lowercase().contains("stream") && it.name.lowercase().contains("type") }
                    f?.let {
                        it.isAccessible = true
                        it.get(device)
                    }
                }
        } catch (t: Throwable) {
            Logger.e("Veinshine: get supported stream types failed", t)
            null
        }
        if (supportedTypes == null) {
            Logger.d("Veinshine: no deviceSupportStreamType found, skipping stream start")
            return
        }
        val typeArray = when (supportedTypes) {
            is Array<*> -> supportedTypes
            is Collection<*> -> supportedTypes.toTypedArray()
            else -> arrayOf(supportedTypes)
        }
        val chosenType = if (forceStreamType != null) {
            typeArray.firstOrNull { it?.toString()?.equals(forceStreamType, ignoreCase = true) == true }.also {
                if (it == null) Logger.e("Veinshine: forceStreamType '$forceStreamType' not in supported list")
            } ?: return
        } else {
            // Prefer RGB_IR so enrollment works; on IR-only devices (rgb_pid:0) identify may be flaky — re-arm tries IR after timeout.
            typeArray.firstOrNull { it?.toString()?.equals("RGB_IR", ignoreCase = true) == true }
                ?: typeArray.firstOrNull { it?.toString()?.equals("RGB", ignoreCase = true) == true }
                ?: typeArray.firstOrNull { it?.toString()?.equals("IR", ignoreCase = true) == true }
                ?: typeArray.firstOrNull()
        }
        if (chosenType == null) {
            Logger.e("Veinshine: no stream type supported")
            return
        }
        currentStreamType = chosenType.toString()
        Logger.d("Veinshine: supported stream types: ${typeArray.joinToString { it?.toString() ?: "null" }}")
        Logger.d("Veinshine: CHOSEN stream type: ${chosenType.toString()}")
        val createStreamM = deviceCls.methods.firstOrNull { m ->
            m.name == "createStream" && m.parameterCount == 1
        }
        if (createStreamM == null) {
            Logger.d("Veinshine: createStream not found, skipping stream start")
            return
        }
        val stream = try {
            createStreamM.invoke(device, chosenType)
        } catch (t: Throwable) {
            Logger.e("Veinshine: createStream failed", t)
            return
        }
        if (stream == null) {
            Logger.e("Veinshine: createStream returned null")
            return
        }
        streamHolder = stream
        val streamCls = stream.javaClass
        val allocateFramesM = streamCls.methods.firstOrNull { m -> m.name == "allocateFrames" && m.parameterCount == 0 }
        val startM = streamCls.methods.firstOrNull { m -> m.name == "start" && m.parameterCount == 0 }
        val getFramesM = streamCls.methods.firstOrNull { m ->
            m.name == "getFrames" && m.parameterCount == 2
        }
        if (allocateFramesM == null || startM == null || getFramesM == null) {
            Logger.d("Veinshine: stream allocateFrames/start/getFrames not all found")
            streamHolder = null
            return
        }
        val frames = try {
            allocateFramesM.invoke(stream)
        } catch (t: Throwable) {
            Logger.e("Veinshine: allocateFrames failed", t)
            streamHolder = null
            return
        }
        if (frames == null) {
            streamHolder = null
            return
        }
        val retStart = try {
            (startM.invoke(stream) as? Number)?.toInt() ?: -1
        } catch (t: Throwable) {
            Logger.e("Veinshine: stream.start failed", t)
            streamHolder = null
            return
        }
        Logger.d("Veinshine: stream.start ret=0x${Integer.toHexString(retStart)} ($retStart)")
        if (retStart != 0) {
            streamHolder = null
            return
        }
        gotFirstFrame.set(false)
        streamRunning = true
        val destroyStreamM = deviceCls.methods.firstOrNull { m ->
            m.name == "destroyStream" && m.parameterCount == 1
        }
        val stopM = streamCls.methods.firstOrNull { m -> m.name == "stop" && m.parameterCount == 0 }
        val thread = Thread {
            try {
                while (streamRunning && streamHolder != null) {
                    val res = try {
                        (getFramesM.invoke(stream, frames, 2000) as? Number)?.toInt() ?: -1
                    } catch (_: Throwable) { -1 }
                    // Non-zero (e.g. 0x22010) is normal until hardware is ready; native SDK may log GetFrames ret as error.
                    if (res != 0) {
                        if (streamRunning) Logger.d("Veinshine: getFrames ret=0x${Integer.toHexString(res)} (waiting for first frame)")
                        continue
                    }
                    if (!gotFirstFrame.getAndSet(true)) {
                        Logger.d("Veinshine: getFrames OK — first frame received, capturePalmOnce now allowed")
                    }
                }
            } finally {
                try { stopM?.invoke(stream) } catch (_: Throwable) { }
                try { destroyStreamM?.invoke(device, stream) } catch (_: Throwable) { }
                streamHolder = null
                streamRunning = false
                streamThreadRef.set(null)
            }
        }
        thread.name = "Veinshine-stream"
        streamThreadRef.set(thread)
        thread.start()
    }

    private fun stopStream() {
        streamRunning = false
        streamThreadRef.get()?.join(3000)
        streamHolder = null
        streamThreadRef.set(null)
        gotFirstFrame.set(false)
    }

    suspend fun captureOnceForEnroll(hand: String): CaptureResult? = withContext(Dispatchers.IO) {
        captureOnce(RECOG_MODE_REGISTER, "enroll")
    }

    suspend fun captureOnceForIdentify(): CaptureResult? = withContext(Dispatchers.IO) {
        captureOnce(RECOG_MODE_IDENTIFY, "identify")
    }

    private suspend fun captureOnce(recogMode: Int, logLabel: String): CaptureResult? {
        if (!captureInProgress.compareAndSet(false, true)) {
            lastError = "Capture already in progress"
            Logger.d("PalmCapture: Already capturing; ignoring")
            return null
        }
        lastCaptureHintRef.set(null)
        val veinshine = veinshineInstance ?: run {
            captureInProgress.set(false)
            lastError = "Device not open"
            return null
        }
            if (!streamRunning || !gotFirstFrame.get()) {
                Logger.d("PalmCapture: waiting for stream/first frame (avoids 0x42023 Unopened flow)...")
                var waited = 0
                val waitMs = 10_000L
                while (waited < waitMs && streamRunning && !gotFirstFrame.get()) {
                    delay(200)
                    waited += 200
                }
            if (!streamRunning || !gotFirstFrame.get()) {
                captureInProgress.set(false)
                lastError = "Stream not ready (no frames yet). Check stream.start() and getFrames()."
                Logger.e("PalmCapture: Cannot capture: streamRunning=$streamRunning gotFirstFrame=${gotFirstFrame.get()}")
                return null
            }
            }
            // Wait after first frame so exposure/LED stabilize (2–3s total after first frame)
            if (gotFirstFrame.get()) delay(800)
            // Warm-up: Veinshine needs LED + exposure stabilization before capture (enrollment)
            delay(1500)
        captureCallbackHolder = null
        val captureStarted = AtomicBoolean(false)
        try {
            Logger.d("Veinshine: capture started ($logLabel)")
            val raw = suspendCancellableCoroutine { cont ->
                val resultRef = AtomicReference<Any?>()
                val latch = CountDownLatch(1)
                // Prefer capturePalmOnce so native cleans up after one frame; capturePalm can leave session "running" → 0x24004 on next start
                val captureMethod = veinshine.javaClass.methods.firstOrNull { m -> m.name == "capturePalmOnce" && m.parameterCount >= 1 }
                    ?: veinshine.javaClass.methods.firstOrNull { m -> m.name == "capturePalm" && m.parameterCount >= 1 }
                if (captureMethod == null) {
                    lastError = "capturePalmOnce not found"
                    captureInProgress.set(false)
                    cont.resume(null)
                    return@suspendCancellableCoroutine
                }
                // Log capture methods only (exclude stop so log doesn't imply we call stop before capture)
                veinshine.javaClass.methods
                    .filter { it.name.lowercase().contains("capture") && it.name != "stopPalmCapture" }
                    .sortedBy { it.name }
                    .forEach { m ->
                        Logger.d("Veinshine: method ${m.name}(${m.parameterTypes.joinToString { it.simpleName }})")
                    }
                Logger.d("PalmCapture: using method ${captureMethod.name} params=${captureMethod.parameterTypes.joinToString { it.simpleName }}")
                val callbackInterface = captureMethod.parameterTypes[0]
                val lastHintLogged = AtomicReference<String?>(null)
                val lastHintTimeMs = AtomicLong(0L)
                val callbackInvokeCount = AtomicLong(0L)
                val timeoutHintCount = AtomicLong(0L)
                val triedIrFallback = AtomicBoolean(false)
                fun looksLikeCaptureResult(o: Any): Boolean = try {
                    val names = o.javaClass.declaredFields.map { it.name }.toSet()
                    "rgbFeature" in names || "irFeature" in names || "rgbImage" in names || "irImage" in names || "rgb" in names || "ir" in names
                } catch (_: Throwable) { false }
                val callback = java.lang.reflect.Proxy.newProxyInstance(
                    (callbackInterface as Class<*>).classLoader,
                    arrayOf(callbackInterface)
                ) { _, method, args ->
                    val mName = method.name
                    val threadName = Thread.currentThread().name
                    val ts = System.currentTimeMillis()
                    val n = callbackInvokeCount.incrementAndGet()
                    val aList = args?.toList().orEmpty()
                    if (n <= 25) {
                        Logger.d("PalmCapture: cb=$mName thread=$threadName ts=$ts args=${aList.map { it?.javaClass?.simpleName ?: "null" }}")
                    }
                    // Minimal work on callback thread so SDK isn't starved; never block or do I/O here
                    val resultObj = aList.firstOrNull { it != null && runCatching { looksLikeCaptureResult(it) }.getOrElse { false } }
                    if (resultObj != null) {
                        Logger.d("PalmCapture: RESULT via $mName thread=$threadName")
                        captureSessionActive.set(false)
                        resultRef.set(resultObj)
                        latch.countDown()
                        return@newProxyInstance null
                    }
                    if (mName.lowercase().contains("hint")) {
                        Logger.d("PalmCapture: HINT raw=${args?.getOrNull(0)}")
                        val hintStr = args?.getOrNull(0)?.toString() ?: "null"
                        val now = System.currentTimeMillis()
                        if (hintStr.contains("TIMEOUT", ignoreCase = true)) {
                            val c = timeoutHintCount.incrementAndGet()
                            if (c >= 2) {
                                lastError = "No palm detected (TIMEOUT). Hold palm 2–4 cm above sensor, good lighting."
                                captureSessionActive.set(false)
                                latch.countDown()
                            }
                        }
                        if (hintStr != lastHintLogged.get() || now - lastHintTimeMs.get() > 2000L) {
                            Logger.d("PalmCapture: HINT=$hintStr thread=$threadName timeoutCount=${timeoutHintCount.get()}")
                            lastHintLogged.set(hintStr)
                            lastHintTimeMs.set(now)
                        }
                        lastCaptureHintRef.set(hintStr)
                    }
                    if (mName.lowercase().contains("error")) {
                        Logger.e("PalmCapture: ERROR code=${args?.getOrNull(0)} msg=${args?.getOrNull(1)} thread=$threadName")
                        captureSessionActive.set(false)
                        latch.countDown()
                    }
                    null
                }
                Logger.d("PalmCapture: callback created identity=${System.identityHashCode(callback)} (keep strong ref)")
                captureCallbackHolder = callback
                // Second param: many Veinshine builds treat it as timeout (ms). Use 30s so SDK has time to detect palm; passing 2 caused instant kTimeout.
                val args = if (captureMethod.parameterCount == 2) {
                    arrayOf(callback, CAPTURE_TIMEOUT_MS)
                } else {
                    arrayOf(callback)
                }
                Logger.d("PalmCapture: invoking ${captureMethod.name}(callback, timeoutMs=$CAPTURE_TIMEOUT_MS) on MAIN thread")
                val stopM = veinshine.javaClass.methods.firstOrNull { it.name == "stopPalmCapture" }
                val mainHandler = Handler(Looper.getMainLooper())
                CoroutineScope(Dispatchers.Main.immediate).launch {
                    deviceCallLock.lock()
                    try {
                        var ret = captureMethod.invoke(veinshine, *args)
                        var retCode = (ret as? Number)?.toInt() ?: -1
                        Logger.d("PalmCapture: capturePalmOnce ret=$retCode thread=${Thread.currentThread().name}")
                        if (retCode == 147460) {
                            Logger.d("PalmCapture: 0x24004 (busy), stopping and retrying on main after 200ms")
                            try { stopM?.invoke(veinshine) } catch (_: Throwable) { }
                            delay(200)
                            deviceCallLock.lock()
                            try {
                                ret = captureMethod.invoke(veinshine, *args)
                                retCode = (ret as? Number)?.toInt() ?: -1
                                Logger.d("PalmCapture: capturePalmOnce ret=$retCode thread=${Thread.currentThread().name}")
                                if (retCode != 0) {
                                    captureSessionActive.set(false)
                                    lastError = "capturePalmOnce failed ret=$retCode"
                                    latch.countDown()
                                } else {
                                    captureStarted.set(true)
                                    captureSessionActive.set(true)
                                }
                            } finally {
                                deviceCallLock.unlock()
                            }
                            return@launch
                        }
                        if (retCode != 0) {
                            captureSessionActive.set(false)
                            lastError = "capturePalmOnce failed ret=$retCode"
                            Logger.e("PalmCapture: capturePalmOnce failed immediately ret=$retCode")
                            latch.countDown()
                        } else {
                            captureStarted.set(true)
                            captureSessionActive.set(true)
                        }
                    } catch (t: Throwable) {
                        captureSessionActive.set(false)
                        Logger.e("PalmCapture: startIdentify exception: ${t.message}", t)
                        lastError = t.message ?: "Capture exception"
                        latch.countDown()
                    } finally {
                        deviceCallLock.unlock()
                    }
                }
                val firstPhaseSec = 12L
                val totalTimeoutSec = captureTimeoutSec
                CoroutineScope(Dispatchers.IO).launch {
                    var got = latch.await(firstPhaseSec, TimeUnit.SECONDS)
                    if (resultRef.get() == null && !got) {
                        val notAlreadyIr = !currentStreamType.equals("IR", ignoreCase = true)
                        if (notAlreadyIr && triedIrFallback.compareAndSet(false, true)) {
                            // IR-only device fallback: restart stream with IR then retry capture
                            Logger.d("PalmCapture: IR-only fallback — restarting stream with IR")
                            captureSessionActive.set(false)
                            mainHandler.post {
                                try { veinshine.javaClass.methods.firstOrNull { it.name == "stopPalmCapture" }?.invoke(veinshine) } catch (_: Throwable) { }
                            }
                            delay(500)
                            stopStream()
                            delay(300)
                            val dev = deviceInstance
                            if (dev != null) {
                                startStream(dev, "IR")
                                var waitMs = 0
                                while (waitMs < 10_000 && !gotFirstFrame.get() && streamRunning) {
                                    delay(200)
                                    waitMs += 200
                                }
                                if (streamRunning && gotFirstFrame.get()) {
                                    Logger.d("PalmCapture: IR stream ready, retrying capture on main")
                                    mainHandler.post {
                                        deviceCallLock.lock()
                                        try {
                                            captureSessionActive.set(true)
                                            val ret = captureMethod.invoke(veinshine, *args)
                                            val retCode = (ret as? Number)?.toInt() ?: -1
                                            Logger.d("PalmCapture: IR-fallback capturePalmOnce ret=$retCode thread=${Thread.currentThread().name}")
                                            if (retCode != 0) {
                                                captureSessionActive.set(false)
                                                lastError = "capturePalmOnce failed ret=$retCode"
                                                latch.countDown()
                                            } else {
                                                captureStarted.set(true)
                                            }
                                        } catch (t: Throwable) {
                                            captureSessionActive.set(false)
                                            latch.countDown()
                                        } finally {
                                            deviceCallLock.unlock()
                                        }
                                    }
                                }
                            }
                        } else {
                            Logger.d("PalmCapture: no result after ${firstPhaseSec}s, re-arm once (stop + 1200ms + capture on main)")
                            captureSessionActive.set(false)
                            mainHandler.post {
                                try {
                                    veinshine.javaClass.methods.firstOrNull { it.name == "stopPalmCapture" }?.invoke(veinshine)
                                } catch (_: Throwable) { }
                                mainHandler.postDelayed({
                                    deviceCallLock.lock()
                                    try {
                                        captureSessionActive.set(true)
                                        val ret = captureMethod.invoke(veinshine, *args)
                                        val retCode = (ret as? Number)?.toInt() ?: -1
                                        Logger.d("PalmCapture: re-arm capturePalmOnce ret=$retCode thread=${Thread.currentThread().name}")
                                        if (retCode != 0) {
                                            captureSessionActive.set(false)
                                            lastError = "capturePalmOnce failed ret=$retCode"
                                            latch.countDown()
                                        } else {
                                            captureStarted.set(true)
                                        }
                                    } catch (t: Throwable) {
                                        captureSessionActive.set(false)
                                        latch.countDown()
                                    } finally {
                                        deviceCallLock.unlock()
                                    }
                                }, 1200)
                            }
                        }
                        latch.await((totalTimeoutSec - firstPhaseSec).coerceAtLeast(0), TimeUnit.SECONDS)
                    }
                    // Resume on IO so mapCaptureResult / introspect run off main (avoids jank + callback starvation)
                    withContext(Dispatchers.IO) { cont.resume(resultRef.get()) }
                }
            }
            if (raw == null) {
                val hint = lastCaptureHintRef.get()
                lastError = lastError ?: when {
                    hint != null && hint.isNotBlank() -> "No palm detected. $hint. Hold palm 2–4 cm above sensor, center in frame, good lighting."
                    else -> "No palm detected. Hold palm 2–4 cm above sensor, center in frame, ensure good lighting."
                }
                Logger.d("PalmCapture: no result (timeout or error)")
                return null
            }
            Logger.d("Veinshine: capture frame received")
            // Introspect raw result once to confirm we use the right fields (feature vs template, etc.)
            Logger.d("Veinshine: raw result class=${raw.javaClass.name}")
            raw.javaClass.declaredFields.forEach {
                it.isAccessible = true
                val v = runCatching { it.get(raw) }.getOrNull()
                val info = when (v) {
                    is ByteArray -> "ByteArray len=${v.size}"
                    else -> v?.javaClass?.simpleName ?: "null"
                }
                Logger.d("Veinshine: field ${it.name} -> $info")
            }
            val result = mapCaptureResult(raw) ?: extractFromImages(raw, veinshine)
            if (result != null) {
                Logger.d("Veinshine: features extracted rgb=${result.rgbFeature?.size ?: 0} ir=${result.irFeature?.size ?: 0} q=${result.quality}")
            }
            return result
        } finally {
            // Only stop when we never got a frame (timeout/cancel); after success SDK already cleaned up — post-stop causes "mICapturePalmCallback is null"
            if (captureStarted.get() && captureSessionActive.get()) {
                val v = veinshineInstance
                if (v != null) {
                    Handler(Looper.getMainLooper()).post {
                        deviceCallLock.lock()
                        try { v.javaClass.methods.firstOrNull { it.name == "stopPalmCapture" }?.invoke(v) } catch (_: Throwable) { }
                        finally { deviceCallLock.unlock() }
                    }
                }
            }
            captureInProgress.set(false)
            captureSessionActive.set(false)
            CoroutineScope(Dispatchers.IO).launch {
                delay(500)
                captureCallbackHolder = null
            }
        }
    }

    private fun fieldNumber(raw: Any, name: String): Number? = try {
        val f = raw.javaClass.getDeclaredField(name)
        f.isAccessible = true
        f.get(raw) as? Number
    } catch (_: Throwable) { null }

    private fun readQuality(raw: Any): Int {
        val n = fieldNumber(raw, "score")
            ?: fieldNumber(raw, "quality")
            ?: fieldNumber(raw, "qualityScore")
            ?: return 80
        val v = n.toFloat()
        return if (v in 0f..1.2f) (v * 100f).toInt().coerceIn(0, 100)
        else v.toInt().coerceIn(0, 100)
    }

    private fun mapCaptureResult(raw: Any): CaptureResult? {
        fun fieldBytes(name: String): ByteArray? = try {
            val f = raw.javaClass.getDeclaredField(name)
            f.isAccessible = true
            f.get(raw) as? ByteArray
        } catch (_: Throwable) { null }

        // For matching we must use feature bytes only; never fall back to rgbImage/irImage (would give score=0)
        val rgb = fieldBytes("rgbFeature")
        val ir = fieldBytes("irFeature")
        val q = readQuality(raw)
        val meta = getRuntimeMetadata()

        // SDK identify/register result: try common field names for match template ID and score
        val matchId = readMatchTemplateId(raw)
        val matchScoreVal = readMatchScore(raw)
        if (matchId != null || matchScoreVal != null) {
            Logger.d("Veinshine: CaptureFrame recognition result: matchTemplateId=$matchId matchScore=$matchScoreVal")
        }

        return if (rgb != null && ir != null) CaptureResult(
            rgbFeature = rgb, irFeature = ir, quality = q,
            streamType = meta.streamType, rgbModelHash = meta.rgbModelHash, irModelHash = meta.irModelHash,
            matchTemplateId = matchId, matchScore = matchScoreVal
        ) else null
    }

    private fun readMatchTemplateId(raw: Any): String? {
        val names = listOf("matchId", "templateId", "matchIndex", "templateIndex", "userId", "registerId", "id", "matchTemplateId")
        for (name in names) {
            val v = try {
                val f = raw.javaClass.getDeclaredField(name)
                f.isAccessible = true
                f.get(raw)
            } catch (_: Throwable) { continue }
            when (v) {
                is Number -> return v.toString()
                is String -> if (v.isNotBlank()) return v
                else -> if (v != null) return v.toString()
            }
        }
        return null
    }

    private fun readMatchScore(raw: Any): Float? {
        val names = listOf("matchScore", "score", "similarity", "confidence", "matchScore")
        for (name in names) {
            val v = try {
                val f = raw.javaClass.getDeclaredField(name)
                f.isAccessible = true
                (f.get(raw) as? Number)?.toFloat()
            } catch (_: Throwable) { null } ?: continue
            if (!v.isNaN()) return v
        }
        return null
    }

    /** Runtime metadata for template storage (stream type + model hashes). */
    data class RuntimeMetadata(val streamType: String?, val rgbModelHash: String?, val irModelHash: String?)

    /** Best-effort read of stream type and model hash keys for template metadata. */
    fun getRuntimeMetadata(): RuntimeMetadata {
        val stream = currentStreamType
        var rgbHash: String? = null
        var irHash: String? = null
        val dev = deviceInstance ?: veinshineInstance
        if (dev != null) {
            val cls = dev.javaClass
            // Discover real getters: log methods that might return model/hash/key
            cls.methods
                .filter { it.parameterCount == 0 && (it.name.contains("model", true) || it.name.contains("hash", true) || it.name.contains("key", true) || it.name.contains("version", true)) }
                .forEach { m ->
                    val ret = runCatching { m.invoke(dev) }.getOrNull()
                    Logger.d("Veinshine: meta method ${m.name}() -> ${ret?.javaClass?.simpleName ?: "null"} = ${ret?.toString()?.take(64)}")
                    if (ret != null && m.name.contains("Rgb", true)) rgbHash = ret.toString()
                    if (ret != null && m.name.contains("Ir", true)) irHash = ret.toString()
                }
            for (f in cls.declaredFields) {
                f.isAccessible = true
                val name = f.name
                if (name.contains("Rgb", ignoreCase = true) && (name.contains("Hash") || name.contains("Key") || name.contains("Model"))) {
                    try { rgbHash = rgbHash ?: f.get(dev)?.toString() } catch (_: Throwable) { }
                }
                if (name.contains("Ir", ignoreCase = true) && (name.contains("Hash") || name.contains("Key") || name.contains("Model"))) {
                    try { irHash = irHash ?: f.get(dev)?.toString() } catch (_: Throwable) { }
                }
            }
        }
        return RuntimeMetadata(stream, rgbHash, irHash)
    }

    private fun extractFromImages(raw: Any, veinshine: Any): CaptureResult? {
        fun fieldBytes(name: String): ByteArray? = try {
            val f = raw.javaClass.getDeclaredField(name)
            f.isAccessible = true
            f.get(raw) as? ByteArray
        } catch (_: Throwable) { null }
        val rgbImg = fieldBytes("rgb") ?: fieldBytes("rgbImage")
        val irImg = fieldBytes("ir") ?: fieldBytes("irImage")
        if (rgbImg == null) return null
        val extractMethod = veinshine.javaClass.methods.firstOrNull { m ->
            m.name == "extractPalmFeaturesFromImg" && m.parameterCount >= 2
        } ?: return null
        val out = try {
            if (extractMethod.parameterCount == 2) extractMethod.invoke(veinshine, rgbImg, irImg ?: rgbImg)
            else extractMethod.invoke(veinshine, rgbImg, irImg ?: rgbImg, null)
        } catch (e: Throwable) {
            Logger.e("Veinshine: extractPalmFeaturesFromImg failed", e)
            return null
        } ?: return null
        return mapCaptureResult(out)
    }

    fun stopCapture() {
        if (!captureSessionActive.get()) return
        val v = veinshineInstance ?: return
        try {
            val stopM = v.javaClass.methods.firstOrNull { it.name == "stopPalmCapture" }
            stopM?.invoke(v)
            captureSessionActive.set(false)
        } catch (_: Throwable) { }
    }

    /** Best-effort: call destroyStream(stream) or destroyStream() on device so vendor can clear internal state. */
    private fun tryDestroyStreams(device: Any) {
        try {
            val cls = device.javaClass
            val destroyStream = cls.methods.firstOrNull { m ->
                m.name.lowercase().contains("destroy") && m.name.lowercase().contains("stream")
            }
            if (destroyStream != null) {
                when (destroyStream.parameterCount) {
                    0 -> destroyStream.invoke(device)
                    1 -> {
                        val getStream = cls.methods.firstOrNull { it.name.lowercase().contains("stream") && it.parameterCount == 0 }
                        val stream = getStream?.invoke(device)
                        destroyStream.invoke(device, stream ?: null)
                    }
                    else -> { }
                }
            }
        } catch (_: Throwable) { }
    }

    fun compareFeatureScore(probeRgb: ByteArray, probeIr: ByteArray, templateRgb: ByteArray, templateIr: ByteArray): Float? {
        val v = veinshineInstance ?: return null
        val device = deviceInstance
        val m = v.javaClass.methods.firstOrNull { it.name == "compareFeatureScore" && it.parameterCount == 4 }
            ?: device?.javaClass?.methods?.firstOrNull { it.name == "compareFeatureScore" && it.parameterCount == 4 }
            ?: return null
        val target = if (m.declaringClass.isInstance(v)) v else device ?: return null

        Logger.d("Veinshine: probe rgbLen=${probeRgb.size} irLen=${probeIr.size} tpl rgbLen=${templateRgb.size} irLen=${templateIr.size}")
        Logger.d("Veinshine: probe rgbHead=${probeRgb.take(16).joinToString("") { "%02x".format(it) }} irHead=${probeIr.take(16).joinToString("") { "%02x".format(it) }}")
        Logger.d("Veinshine: tpl rgbHead=${templateRgb.take(16).joinToString("") { "%02x".format(it) }} irHead=${templateIr.take(16).joinToString("") { "%02x".format(it) }}")

        fun readOut(out: Any): Triple<Int?, Float?, Float?> {
            val result = getIntField(out, "result")
            val rgbScore = getFloatField(out, "rgbScore") ?: getFloatField(out, "score")
            val irScore = getFloatField(out, "irScore")
            return Triple(result, rgbScore, irScore)
        }

        fun scoreFrom(rgb: Float?, ir: Float?): Float? = when {
            rgb != null && ir != null -> (rgb + ir) / 2f
            rgb != null -> rgb
            else -> null
        }

        fun attempt(label: String, a: ByteArray, b: ByteArray, c: ByteArray, d: ByteArray): Pair<Float?, Int?> {
            return try {
                val out = m.invoke(target, a, b, c, d) ?: return null to null
                val (result, rgb, ir) = readOut(out)
                val score = scoreFrom(rgb, ir)
                Logger.d("Veinshine: compare($label) result=$result rgb=$rgb ir=$ir -> score=$score")
                score to result
            } catch (t: Throwable) {
                Logger.e("Veinshine: compare($label) failed", t)
                null to null
            }
        }

        /** Accept when SDK returned success (result=0) and we have a score; don't require score > 0 (vendor may use distance). */
        fun accept(score: Float?, result: Int?): Boolean = result == 0 && score != null

        // SELF compare: probe vs probe. If this returns result=4, blobs are not in the format compareFeatureScore expects.
        val (selfScore, selfRes) = attempt("SELF probe/probe", probeRgb, probeIr, probeRgb, probeIr)
        Logger.d("Veinshine: SELF compare result=$selfRes score=$selfScore")

        if (selfRes == 4) {
            lastError = "This device/SDK build does not support compareFeatureScore with raw feature bytes (result=4). Use SDK 1:N identify or re-enroll after SDK update."
            return null
        }

        // (rgb1, rgb2, ir1, ir2) — compare RGB-to-RGB, IR-to-IR
        val (s1, r1) = attempt("RGB-RGB/IR-IR", probeRgb, templateRgb, probeIr, templateIr)
        if (accept(s1, r1)) return s1

        // (probeRgb, probeIr, templateRgb, templateIr)
        val (s2, r2) = attempt("probeRgb/probeIr/tplRgb/tplIr", probeRgb, probeIr, templateRgb, templateIr)
        if (accept(s2, r2)) return s2

        val (s3, r3) = attempt("weird", probeRgb, probeIr, templateIr, templateRgb)
        if (accept(s3, r3)) return s3
        return s1 ?: s2 ?: s3
    }

    private fun getFloatField(obj: Any, name: String): Float? = try {
        val f = obj.javaClass.getDeclaredField(name)
        f.isAccessible = true
        (f.get(obj) as? Number)?.toFloat()
    } catch (_: Throwable) { null }

    private fun getIntField(obj: Any, name: String): Int? = try {
        val f = obj.javaClass.getDeclaredField(name)
        f.isAccessible = true
        (f.get(obj) as? Number)?.toInt()
    } catch (_: Throwable) { null }

    /**
     * Stop capture, destroy stream, close device, clear refs. Call only when you need a full teardown
     * (e.g. Retry after "already in use", or app exit). Prefer reusing the same device — do not call
     * release() on every screen leave, so the next open() can reuse and avoid g_instanceDic "device index exist".
     */
    fun release() {
        opening.set(false)
        captureSessionActive.set(false)
        captureCallbackHolder = null
        stopStream()
        val device = deviceInstance
        try {
            if (device != null) stopCapture()
            if (device != null) tryDestroyStreams(device)
            if (device != null) {
                device.javaClass.methods.firstOrNull { it.name == "close" || it.name == "release" }?.invoke(device)
            }
        } catch (_: Throwable) { }
        deviceInstance = null
        veinshineInstance = null
        currentStreamType = null
        isOpen = false
        // Keep isInitialized so Retry can call open() without re-initializing
        strongOpenCallback = null
        strongDevice = null
        deviceOpenHolder = null
        openCallbackHolder = null
        deviceStrong = null
        openCallbackStrong = null
        lastReleaseTimeMs.set(System.currentTimeMillis())
        Logger.d("Veinshine: release")
    }
}
