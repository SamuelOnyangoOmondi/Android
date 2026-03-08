package com.farmtopalm.terminal.biometric

import com.api.stream.IOpenCallback
import java.util.concurrent.CountDownLatch
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Real implementation of [IOpenCallback] (no Proxy). Use this instead of a reflective
 * Proxy so the vendor JNI layer gets a normal object and does not hit weak-global-ref bugs.
 *
 * Sets [openSuccessSignalled] in onOpenSuccess so the waiter can treat success as authoritative
 * even if the latch await timed out a moment before the callback ran (avoids false "scanner error").
 */
class VeinshineOpenCallback(
    private val openLatch: CountDownLatch,
    private val openSuccessSignalled: AtomicBoolean,
    private val onLog: (String) -> Unit
) : IOpenCallback {

    private val signalled = AtomicBoolean(false)

    private fun signalOnce(tag: String, isSuccess: Boolean = false) {
        onLog("$tag thread=${Thread.currentThread().name}")
        if (isSuccess) openSuccessSignalled.set(true)
        if (signalled.compareAndSet(false, true)) {
            openLatch.countDown()
        }
    }

    override fun onDownloadPrepare() {
        onLog("IOpenCallback.onDownloadPrepare")
    }

    override fun onDownloadProgress(progress: Int) {
        onLog("IOpenCallback.onDownloadProgress=$progress")
    }

    override fun onDownloadSuccess() {
        onLog("IOpenCallback.onDownloadSuccess")
    }

    override fun onOpenSuccess() {
        signalOnce("IOpenCallback.onOpenSuccess", isSuccess = true)
    }

    override fun onOpenFail(code: Int) {
        signalOnce("IOpenCallback.onOpenFail code=$code", isSuccess = false)
    }
}
