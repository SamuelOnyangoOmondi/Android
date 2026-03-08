package com.farmtopalm.terminal.data.db.dao

import androidx.room.*
import com.farmtopalm.terminal.data.db.entities.StudentEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface StudentDao {
    @Query("SELECT * FROM students WHERE id = :id")
    suspend fun getById(id: String): StudentEntity?

    @Query("SELECT * FROM students WHERE externalId = :externalId LIMIT 1")
    suspend fun getByExternalId(externalId: String): StudentEntity?

    @Query("SELECT * FROM students WHERE schoolId = :schoolId ORDER BY name")
    fun observeBySchool(schoolId: String): Flow<List<StudentEntity>>

    @Query("SELECT * FROM students WHERE schoolId = :schoolId AND (name LIKE '%' || :query || '%' OR externalId LIKE '%' || :query || '%') ORDER BY name")
    fun search(schoolId: String, query: String): Flow<List<StudentEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entity: StudentEntity)

    @Update
    suspend fun update(entity: StudentEntity)

    @Delete
    suspend fun delete(entity: StudentEntity)
}
