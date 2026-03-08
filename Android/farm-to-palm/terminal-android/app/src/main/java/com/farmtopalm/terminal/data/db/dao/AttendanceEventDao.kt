package com.farmtopalm.terminal.data.db.dao

import androidx.room.*
import com.farmtopalm.terminal.data.db.entities.AttendanceEventEntity

@Dao
interface AttendanceEventDao {
    @Query("SELECT * FROM attendance_events WHERE synced = 0 ORDER BY createdAt")
    suspend fun getUnsynced(): List<AttendanceEventEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entity: AttendanceEventEntity)

    @Query("UPDATE attendance_events SET synced = 1 WHERE id = :id")
    suspend fun markSynced(id: String)

    @Query("UPDATE attendance_events SET synced = 1 WHERE id IN (:ids)")
    suspend fun markSyncedBatch(ids: List<String>)
}
