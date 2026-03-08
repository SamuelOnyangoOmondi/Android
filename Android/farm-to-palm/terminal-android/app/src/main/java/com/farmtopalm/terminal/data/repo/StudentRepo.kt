package com.farmtopalm.terminal.data.repo

import com.farmtopalm.terminal.data.db.dao.StudentDao
import com.farmtopalm.terminal.data.db.entities.StudentEntity
import kotlinx.coroutines.flow.Flow
import java.util.UUID

class StudentRepo(private val dao: StudentDao) {

    fun observeBySchool(schoolId: String): Flow<List<StudentEntity>> = dao.observeBySchool(schoolId)
    fun search(schoolId: String, query: String): Flow<List<StudentEntity>> = dao.search(schoolId, query)

    suspend fun getById(id: String) = dao.getById(id)
    suspend fun getByExternalId(externalId: String) = dao.getByExternalId(externalId)

    suspend fun upsert(externalId: String, name: String, schoolId: String) {
        val existing = dao.getByExternalId(externalId)
        val now = System.currentTimeMillis()
        if (existing != null) {
            dao.update(existing.copy(name = name, updatedAt = now))
        } else {
            dao.insert(StudentEntity(id = UUID.randomUUID().toString(), externalId = externalId, name = name, schoolId = schoolId, createdAt = now, updatedAt = now))
        }
    }

    suspend fun insert(student: StudentEntity) = dao.insert(student)
    suspend fun delete(student: StudentEntity) = dao.delete(student)
}
