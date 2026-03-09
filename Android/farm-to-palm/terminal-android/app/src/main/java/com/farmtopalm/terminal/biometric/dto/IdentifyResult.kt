package com.farmtopalm.terminal.biometric.dto

data class IdentifyResult(
    val studentId: String,
    val confidence: Float,
    /** VERIFIED = safe to record attendance/meal; LOW_CONFIDENCE = match found but below threshold; NO_MATCH = no match. */
    val matchStatus: MatchStatus
)
