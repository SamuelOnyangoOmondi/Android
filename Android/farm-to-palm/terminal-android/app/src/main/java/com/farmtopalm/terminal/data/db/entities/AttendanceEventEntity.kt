package com.farmtopalm.terminal.data.db.entities

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(tableName = "attendance_events", indices = [Index("synced"), Index("terminalId"), Index("ts")])
data class AttendanceEventEntity(
    @PrimaryKey val id: String,
    val studentId: String,
    val terminalId: String,
    val schoolId: String,
    val ts: Long,
    val confidence: Float,
    val synced: Boolean,
    val createdAt: Long
)
