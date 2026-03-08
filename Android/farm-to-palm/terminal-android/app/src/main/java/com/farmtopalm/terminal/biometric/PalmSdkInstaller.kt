package com.farmtopalm.terminal.biometric

import android.content.Context
import com.farmtopalm.terminal.palm.PalmModelsInstaller

/**
 * Returns the models path used by the vendor SDK (PalmSdk.initialize, enableDimPalm).
 * Uses [PalmModelsInstaller] so models live under getExternalFilesDir(null)/models_palm/models/
 * (no storage permission needed) and match the path passed to enableDimPalm.
 */
object PalmSdkInstaller {

    fun getModelsPath(context: Context): String {
        return PalmModelsInstaller.ensureInstalled(context).absolutePath
    }
}
