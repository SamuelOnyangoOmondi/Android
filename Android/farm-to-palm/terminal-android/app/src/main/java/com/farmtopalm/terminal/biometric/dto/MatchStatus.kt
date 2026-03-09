package com.farmtopalm.terminal.biometric.dto

/**
 * Match confidence level for palm identification.
 * Attendance and meals should only be recorded when status is [VERIFIED].
 */
enum class MatchStatus {
    /** High-confidence match; safe to record attendance/meal. */
    VERIFIED,
    /** Match found but below verification threshold; do not record. */
    LOW_CONFIDENCE,
    /** No match found. */
    NO_MATCH
}
