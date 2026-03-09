package com.farmtopalm.terminal.biometric

/**
 * Configurable thresholds for palm matching accuracy.
 * Stricter values reduce false positives at the cost of more false rejections.
 */
data class PalmMatchConfig(
    /** Minimum score to accept as VERIFIED match (0–1). Default 0.80. */
    val minAcceptScore: Float = 0.80f,
    /** Minimum quality score (0–100) to allow matching; reject low-quality scans. Default 0 (disabled). */
    val minQualityScore: Int = 0,
    /** Minimum margin between top-1 and top-2 scores; reject ambiguous matches. Default 0.05. */
    val minMarginScore: Float = 0.05f,
    /** Enforce hand-side: only match templates with same hand as scan. Default true. */
    val useHandEnforcement: Boolean = true,
    /** Legacy: when hand unknown, allow matching all templates. Default true for backward compat. */
    val allowUnknownHandMatch: Boolean = true
)
