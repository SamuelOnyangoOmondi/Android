package com.farmtopalm.terminal.data.db.dao

import androidx.room.*
import com.farmtopalm.terminal.data.db.entities.NfcCardEntity

@Dao
interface NfcCardDao {
    @Query("SELECT * FROM nfc_cards WHERE uid = :uid LIMIT 1")
    suspend fun getByUid(uid: String): NfcCardEntity?

    @Query("SELECT * FROM nfc_cards WHERE studentId = :studentId")
    suspend fun getByStudent(studentId: String): List<NfcCardEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entity: NfcCardEntity)

    @Delete
    suspend fun delete(entity: NfcCardEntity)
}
