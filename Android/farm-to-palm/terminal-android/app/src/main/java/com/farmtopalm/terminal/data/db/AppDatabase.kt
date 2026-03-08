package com.farmtopalm.terminal.data.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.farmtopalm.terminal.data.db.dao.*
import com.farmtopalm.terminal.data.db.entities.*

private val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL("ALTER TABLE palm_templates ADD COLUMN streamType TEXT")
        db.execSQL("ALTER TABLE palm_templates ADD COLUMN rgbModelHash TEXT")
        db.execSQL("ALTER TABLE palm_templates ADD COLUMN irModelHash TEXT")
    }
}

private val MIGRATION_2_3 = object : Migration(2, 3) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL("ALTER TABLE palm_templates ADD COLUMN sdkTemplateId TEXT")
        db.execSQL("CREATE INDEX IF NOT EXISTS index_palm_templates_sdkTemplateId ON palm_templates(sdkTemplateId)")
    }
}

/** For devices that already ran 2_3 without the index: create the index so schema validation passes. */
private val MIGRATION_3_4 = object : Migration(3, 4) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL("CREATE INDEX IF NOT EXISTS index_palm_templates_sdkTemplateId ON palm_templates(sdkTemplateId)")
    }
}

@Database(
    entities = [
        StudentEntity::class,
        PalmTemplateEntity::class,
        NfcCardEntity::class,
        AttendanceEventEntity::class,
        MealEventEntity::class,
        TerminalConfigEntity::class
    ],
    version = 4,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun studentDao(): StudentDao
    abstract fun palmTemplateDao(): PalmTemplateDao
    abstract fun nfcCardDao(): NfcCardDao
    abstract fun attendanceEventDao(): AttendanceEventDao
    abstract fun mealEventDao(): MealEventDao
    abstract fun terminalConfigDao(): TerminalConfigDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null
        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: Room.databaseBuilder(context.applicationContext, AppDatabase::class.java, "farmtopalm.db")
                    .addMigrations(MIGRATION_1_2, MIGRATION_2_3, MIGRATION_3_4)
                    .build()
                    .also { INSTANCE = it }
            }
        }
    }
}
