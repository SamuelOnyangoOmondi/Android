package com.farmtopalm.terminal.data.db.entities

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(tableName = "meal_events", indices = [Index("synced"), Index("terminalId"), Index("ts")])
data class MealEventEntity(
    @PrimaryKey val id: String,
    val studentId: String,
    val terminalId: String,
    val schoolId: String,
    val ts: Long,
    val method: String, // "nfc" | "palm" | "nfc_palm"
    val synced: Boolean,
    val createdAt: Long
)
