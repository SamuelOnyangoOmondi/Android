package com.farmtopalm.terminal.data.db.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "students")
data class StudentEntity(
    @PrimaryKey val id: String,
    val externalId: String,
    val name: String,
    val schoolId: String,
    val createdAt: Long,
    val updatedAt: Long
)
