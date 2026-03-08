package com.farmtopalm.terminal.data.db.dao

import androidx.room.*
import com.farmtopalm.terminal.data.db.entities.MealEventEntity

@Dao
interface MealEventDao {
    @Query("SELECT * FROM meal_events WHERE synced = 0 ORDER BY createdAt")
    suspend fun getUnsynced(): List<MealEventEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entity: MealEventEntity)

    @Query("UPDATE meal_events SET synced = 1 WHERE id IN (:ids)")
    suspend fun markSyncedBatch(ids: List<String>)
}
