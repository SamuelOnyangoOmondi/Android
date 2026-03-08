package com.farmtopalm.terminal.data.db.entities

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "nfc_cards",
    foreignKeys = [ForeignKey(entity = StudentEntity::class, parentColumns = ["id"], childColumns = ["studentId"], onDelete = ForeignKey.CASCADE)],
    indices = [Index("uid"), Index("studentId")]
)
data class NfcCardEntity(
    @PrimaryKey val id: String,
    val studentId: String,
    val uid: String,
    val createdAt: Long
)
