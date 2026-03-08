package com.farmtopalm.terminal.data.db.dao

import androidx.room.*
import com.farmtopalm.terminal.data.db.entities.TerminalConfigEntity

@Dao
interface TerminalConfigDao {
    @Query("SELECT * FROM terminal_config WHERE id = 1 LIMIT 1")
    suspend fun get(): TerminalConfigEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entity: TerminalConfigEntity)

    @Query("UPDATE terminal_config SET lastHeartbeatAt = :at WHERE id = 1")
    suspend fun updateHeartbeat(at: Long)
}
