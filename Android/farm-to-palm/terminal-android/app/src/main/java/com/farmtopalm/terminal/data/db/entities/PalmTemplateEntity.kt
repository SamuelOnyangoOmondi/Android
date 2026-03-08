package com.farmtopalm.terminal.data.db.entities

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "palm_templates",
    foreignKeys = [ForeignKey(entity = StudentEntity::class, parentColumns = ["id"], childColumns = ["studentId"], onDelete = ForeignKey.CASCADE)],
    indices = [Index("studentId"), Index("sdkTemplateId")]
)
data class PalmTemplateEntity(
    @PrimaryKey val id: String,
    val studentId: String,
    val hand: String, // e.g. "left", "right"
    val rgbFeatureEnc: ByteArray,
    val irFeatureEnc: ByteArray,
    val quality: Int,
    val createdAt: Long,
    /** Stream type at enrollment (e.g. "RGB_IR", "IR"); null = legacy row. */
    val streamType: String? = null,
    /** Model hash at enrollment for RGB; null = legacy. */
    val rgbModelHash: String? = null,
    /** Model hash at enrollment for IR; null = legacy. */
    val irModelHash: String? = null,
    /** SDK internal template ID from register-mode capture; used for identify-mode match lookup. */
    val sdkTemplateId: String? = null
) {
    override fun equals(other: Any?): Boolean = this === other || (other is PalmTemplateEntity && id == other.id && studentId == other.studentId && hand == other.hand && rgbFeatureEnc.contentEquals(other.rgbFeatureEnc) && irFeatureEnc.contentEquals(other.irFeatureEnc) && quality == other.quality && createdAt == other.createdAt && streamType == other.streamType && rgbModelHash == other.rgbModelHash && irModelHash == other.irModelHash && sdkTemplateId == other.sdkTemplateId)
    override fun hashCode(): Int = id.hashCode()
}
