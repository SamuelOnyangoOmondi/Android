package com.farmtopalm.terminal.biometric.dto

data class PalmDeviceStatus(
    val initialized: Boolean,
    val deviceConnected: Boolean,
    val open: Boolean,
    val lastError: String?
)
