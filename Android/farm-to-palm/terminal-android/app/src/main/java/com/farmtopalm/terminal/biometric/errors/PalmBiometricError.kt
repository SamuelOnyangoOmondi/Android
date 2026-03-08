package com.farmtopalm.terminal.biometric.errors

sealed class PalmBiometricError {
    data class NotInitialized(val message: String = "SDK not initialized") : PalmBiometricError()
    data class NotOpen(val message: String = "Device not open") : PalmBiometricError()
    data class CaptureFailed(val message: String, val cause: Throwable? = null) : PalmBiometricError()
    data class IdentifyFailed(val message: String, val cause: Throwable? = null) : PalmBiometricError()
    data class SdkError(val message: String, val cause: Throwable? = null) : PalmBiometricError()
}
