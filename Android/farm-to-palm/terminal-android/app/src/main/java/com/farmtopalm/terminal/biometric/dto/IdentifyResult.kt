package com.farmtopalm.terminal.biometric.dto

data class IdentifyResult(
    val studentId: String,
    val confidence: Float
)
