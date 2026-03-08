package com.farmtopalm.terminal.data.db.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "terminal_config")
data class TerminalConfigEntity(
    @PrimaryKey val id: Int = 1,
    val terminalId: String,
    val schoolId: String,
    val apiBaseUrl: String,
    val tokenEnc: ByteArray,
    val activatedAt: Long,
    val lastHeartbeatAt: Long?
) {
    override fun equals(other: Any?): Boolean = this === other || (other is TerminalConfigEntity && id == other.id && terminalId == other.terminalId && tokenEnc.contentEquals(other.tokenEnc))
    override fun hashCode(): Int = id
}
