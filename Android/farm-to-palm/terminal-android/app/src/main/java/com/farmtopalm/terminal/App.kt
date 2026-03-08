package com.farmtopalm.terminal

import android.app.Application
import com.farmtopalm.terminal.data.db.AppDatabase
import com.farmtopalm.terminal.sync.SyncScheduler
import com.farmtopalm.terminal.util.Logger

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        db = AppDatabase.getInstance(this)
        SyncScheduler.schedule(this)
        // Vendor PalmSDK-L: initialize early (matches vendor demo App.java).
        try {
            val palmSdk = Class.forName("com.api.stream.PalmSdk")
            val init = palmSdk.declaredMethods.firstOrNull { it.name == "initialize" }
                ?: palmSdk.methods.firstOrNull { it.name == "initialize" }
            when (init?.parameterCount) {
                0 -> init.invoke(null)
                1 -> init.invoke(null, this)
                else -> { }
            }
            Logger.d("PalmSdk.initialize() OK (Application)")
        } catch (e: ClassNotFoundException) {
            // No vendor JAR on classpath
        } catch (e: Exception) {
            Logger.e("PalmSdk.initialize() failed", e)
        }
    }

    companion object {
        lateinit var db: AppDatabase
            private set
    }
}
