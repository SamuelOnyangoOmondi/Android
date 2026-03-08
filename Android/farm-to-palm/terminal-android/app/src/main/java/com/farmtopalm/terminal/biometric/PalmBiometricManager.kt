package com.farmtopalm.terminal.biometric

import com.farmtopalm.terminal.biometric.dto.CaptureResult
import com.farmtopalm.terminal.biometric.dto.IdentifyResult
import com.farmtopalm.terminal.biometric.dto.PalmDeviceStatus
import com.farmtopalm.terminal.util.Result
import kotlinx.coroutines.CoroutineScope

interface PalmBiometricManager {
    fun initialize(): Result<Unit>
    /** Opens the device asynchronously. Use this when [PalmSdkBridge.isUsingRealSdk] is true. */
    fun open(scope: CoroutineScope, callback: (Result<Unit>) -> Unit)
    fun status(): PalmDeviceStatus
    /** Capture for enrollment; runs asynchronously and invokes [callback] on completion. */
    fun captureForEnroll(scope: CoroutineScope, hand: String, callback: (Result<CaptureResult>) -> Unit)
    /** Capture for identification; runs asynchronously and invokes [callback] on completion. */
    fun captureForIdentify(scope: CoroutineScope, callback: (Result<CaptureResult>) -> Unit)
    fun identify(capture: CaptureResult): Result<IdentifyResult>
    fun release(): Result<Unit>
}
