package com.farmtopalm.terminal.biometric.dto

data class CaptureResult(
    val rgbFeature: ByteArray?,
    val irFeature: ByteArray?,
    val quality: Int,
    /** Stream type at capture (e.g. "RGB_IR", "IR") for template metadata. */
    val streamType: String? = null,
    /** Model hash/key for RGB features (device/model version binding). */
    val rgbModelHash: String? = null,
    /** Model hash/key for IR features (device/model version binding). */
    val irModelHash: String? = null,
    /** When capture was in identify mode: SDK-reported matched template ID/index (use for DB lookup). */
    val matchTemplateId: String? = null,
    /** When capture was in identify mode: SDK-reported match score. */
    val matchScore: Float? = null
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is CaptureResult) return false
        if (quality != other.quality) return false
        if (streamType != other.streamType || rgbModelHash != other.rgbModelHash || irModelHash != other.irModelHash) return false
        if (matchTemplateId != other.matchTemplateId || matchScore != other.matchScore) return false
        if (rgbFeature == null && other.rgbFeature != null) return false
        if (rgbFeature != null && other.rgbFeature == null) return false
        if (rgbFeature != null && other.rgbFeature != null && !rgbFeature.contentEquals(other.rgbFeature)) return false
        if (irFeature == null && other.irFeature != null) return false
        if (irFeature != null && other.irFeature == null) return false
        if (irFeature != null && other.irFeature != null && !irFeature.contentEquals(other.irFeature)) return false
        return true
    }
    override fun hashCode(): Int = quality + (streamType?.hashCode() ?: 0) + (rgbModelHash?.hashCode() ?: 0) + (irModelHash?.hashCode() ?: 0) + (matchTemplateId?.hashCode() ?: 0) + (matchScore?.hashCode() ?: 0) + (rgbFeature?.contentHashCode() ?: 0) + (irFeature?.contentHashCode() ?: 0)
}
