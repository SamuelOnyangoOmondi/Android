package com.farmtopalm.terminal.biometric

/**
 * Maps raw SDK hints to user-friendly guidance messages for palm capture.
 */
object PalmGuidanceHelper {

    /**
     * Convert SDK hint string to a short, actionable instruction for the user.
     */
    fun hintToMessage(hint: String?): String? {
        if (hint.isNullOrBlank()) return null
        val h = hint.trim().lowercase()
        return when {
            h.contains("timeout") || h.contains("no palm") -> "Hold palm 2–4 cm above sensor"
            h.contains("center") || h.contains("position") || h.contains("box") -> "Center your palm in the frame"
            h.contains("move") && h.contains("up") -> "Move hand slightly up"
            h.contains("move") && h.contains("down") -> "Move hand slightly down"
            h.contains("move") && h.contains("left") -> "Move hand slightly left"
            h.contains("move") && h.contains("right") -> "Move hand slightly right"
            h.contains("closer") || h.contains("near") -> "Move palm closer to sensor"
            h.contains("far") || h.contains("distance") -> "Move palm slightly farther"
            h.contains("hold") || h.contains("still") || h.contains("steady") -> "Hold still"
            h.contains("tilt") || h.contains("rotate") -> "Adjust palm angle"
            h.contains("light") || h.contains("shadow") -> "Improve lighting, avoid shadows"
            h.contains("blur") -> "Hold palm steady"
            else -> null
        }
    }

    /** Default message when no palm detected yet. */
    const val DEFAULT_PLACE_PALM = "Place your palm above the sensor"

    /** Message when capture is in progress and palm is detected. */
    const val HOLD_STEADY = "Hold still..."

    /** Zone instructions for guided multi-position enrollment. */
    val ZONE_INSTRUCTIONS = listOf(
        "Place palm flat, centered",
        "Tilt palm slightly left",
        "Tilt palm slightly right",
        "Move palm slightly up",
        "Move palm slightly down"
    )
}
