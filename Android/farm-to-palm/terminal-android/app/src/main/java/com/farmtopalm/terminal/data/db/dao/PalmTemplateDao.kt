package com.farmtopalm.terminal.data.db.dao

import androidx.room.*
import com.farmtopalm.terminal.data.db.entities.PalmTemplateEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface PalmTemplateDao {
    @Query("SELECT * FROM palm_templates WHERE studentId = :studentId")
    fun getByStudent(studentId: String): Flow<List<PalmTemplateEntity>>

    @Query("SELECT * FROM palm_templates WHERE studentId = :studentId")
    suspend fun getByStudentSync(studentId: String): List<PalmTemplateEntity>

    @Query("SELECT * FROM palm_templates WHERE sdkTemplateId = :sdkTemplateId LIMIT 1")
    suspend fun getBySdkTemplateId(sdkTemplateId: String): PalmTemplateEntity?

    @Query("SELECT * FROM palm_templates")
    suspend fun getAllSync(): List<PalmTemplateEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entity: PalmTemplateEntity)

    @Delete
    suspend fun delete(entity: PalmTemplateEntity)

    @Query("DELETE FROM palm_templates WHERE studentId = :studentId")
    suspend fun deleteByStudent(studentId: String)
}
