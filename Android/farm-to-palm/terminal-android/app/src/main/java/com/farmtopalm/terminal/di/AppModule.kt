package com.farmtopalm.terminal.di

import android.content.Context
import com.farmtopalm.terminal.biometric.PalmBiometricManager
import com.farmtopalm.terminal.biometric.PalmBiometricManagerImpl
import com.farmtopalm.terminal.data.db.AppDatabase
import com.farmtopalm.terminal.data.repo.EventRepo
import com.farmtopalm.terminal.data.repo.StudentRepo
import com.farmtopalm.terminal.data.repo.TerminalRepo

object AppModule {

    fun studentRepo(context: Context): StudentRepo {
        return StudentRepo(AppDatabase.getInstance(context).studentDao())
    }

    fun eventRepo(context: Context): EventRepo {
        val db = AppDatabase.getInstance(context)
        return EventRepo(db.attendanceEventDao(), db.mealEventDao())
    }

    fun terminalRepo(context: Context): TerminalRepo {
        return TerminalRepo(AppDatabase.getInstance(context).terminalConfigDao())
    }

    /**
     * Palm scanner: currently always the impl with mock capture/identify.
     * When you add a real vendor implementation (e.g. VendorPalmBiometricManager backed by the SDK jar):
     * 1. Set buildConfigField "USE_VENDOR_PALM_SDK" to true for device/release in build.gradle.
     * 2. Return that implementation here when BuildConfig.USE_VENDOR_PALM_SDK is true.
     * See BIOMETRIC_SDK_INTEGRATION.md for exact wiring (init, open, capture, identify).
     */
    fun palmBiometricManager(context: Context): PalmBiometricManager {
        return PalmBiometricManagerImpl(context, AppDatabase.getInstance(context).palmTemplateDao())
    }
}
