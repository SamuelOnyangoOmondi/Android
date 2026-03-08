package com.farmtopalm.terminal.data.repo

import com.farmtopalm.terminal.data.db.dao.TerminalConfigDao
import com.farmtopalm.terminal.data.db.entities.TerminalConfigEntity

class TerminalRepo(private val dao: TerminalConfigDao) {

    suspend fun getConfig() = dao.get()
    suspend fun isActivated() = dao.get() != null

    suspend fun saveConfig(terminalId: String, schoolId: String, apiBaseUrl: String, tokenEnc: ByteArray) {
        val now = System.currentTimeMillis()
        dao.insert(TerminalConfigEntity(id = 1, terminalId = terminalId, schoolId = schoolId, apiBaseUrl = apiBaseUrl, tokenEnc = tokenEnc, activatedAt = now, lastHeartbeatAt = null))
    }

    suspend fun updateHeartbeat() = dao.updateHeartbeat(System.currentTimeMillis())
}
