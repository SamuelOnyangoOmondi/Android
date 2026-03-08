package com.farmtopalm.terminal.data.repo

import com.farmtopalm.terminal.data.db.dao.AttendanceEventDao
import com.farmtopalm.terminal.data.db.dao.MealEventDao
import com.farmtopalm.terminal.data.db.entities.AttendanceEventEntity
import com.farmtopalm.terminal.data.db.entities.MealEventEntity
import java.util.UUID

class EventRepo(
    private val attendanceDao: AttendanceEventDao,
    private val mealDao: MealEventDao
) {

    suspend fun recordAttendance(studentId: String, terminalId: String, schoolId: String, confidence: Float) {
        val id = UUID.randomUUID().toString()
        val now = System.currentTimeMillis()
        attendanceDao.insert(AttendanceEventEntity(id = id, studentId = studentId, terminalId = terminalId, schoolId = schoolId, ts = now, confidence = confidence, synced = false, createdAt = now))
    }

    suspend fun recordMeal(studentId: String, terminalId: String, schoolId: String, method: String) {
        val id = UUID.randomUUID().toString()
        val now = System.currentTimeMillis()
        mealDao.insert(MealEventEntity(id = id, studentId = studentId, terminalId = terminalId, schoolId = schoolId, ts = now, method = method, synced = false, createdAt = now))
    }

    suspend fun getUnsyncedAttendance() = attendanceDao.getUnsynced()
    suspend fun getUnsyncedMeals() = mealDao.getUnsynced()
    suspend fun markAttendanceSynced(ids: List<String>) = attendanceDao.markSyncedBatch(ids)
    suspend fun markMealsSynced(ids: List<String>) = mealDao.markSyncedBatch(ids)
}
