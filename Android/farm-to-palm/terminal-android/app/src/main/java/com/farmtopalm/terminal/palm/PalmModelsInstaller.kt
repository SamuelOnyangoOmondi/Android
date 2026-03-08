package com.farmtopalm.terminal.palm

import android.content.Context
import com.farmtopalm.terminal.util.Logger
import java.io.File
import java.io.FileOutputStream

/**
 * Provisions vendor palm model files into an app-accessible directory.
 * PalmSDK-L expects a path containing e.g. palm_models_1.2.9.pbz, .pb, .bin, etc.
 * Uses getExternalFilesDir(null)/models_palm/models/ (no storage permission needed on Android 11+).
 *
 * Place vendor SDK model files in app/src/main/assets/models/ (e.g. from
 * palm-android-sdk-v1.3.14-L/assets/models/). ensureInstalled() copies them to the external path.
 */
object PalmModelsInstaller {

    /** Directory that PalmSDK-L expects to contain the model files. */
    fun modelsDir(context: Context): File {
        return File(context.getExternalFilesDir(null), "models_palm/models")
    }

    /**
     * Ensure models are installed: copy assets/models/ (all files) into modelsDir.
     * Call before initializing the vendor SDK and before enableDimPalm.
     * Returns the models directory (trailing slash not included; caller may add "/" for vendor).
     */
    fun ensureInstalled(context: Context): File {
        val dstDir = modelsDir(context)
        if (!dstDir.exists()) dstDir.mkdirs()

        // If marker exists and has content, assume already installed.
        val marker = File(dstDir, "palm_models_1.2.9.pbz")
        if (marker.exists() && marker.length() > 0) {
            Logger.d("PalmModels: already installed at ${dstDir.absolutePath}")
            return dstDir
        }

        copyAssetDir(context, "models", dstDir)
        Logger.d("PalmModels: installed to ${dstDir.absolutePath}")
        return dstDir
    }

    private fun copyAssetDir(context: Context, assetDirName: String, dstDir: File) {
        val assetManager = context.assets
        val files = assetManager.list(assetDirName) ?: emptyArray()

        for (name in files) {
            val assetPath = "$assetDirName/$name"
            val children = assetManager.list(assetPath)

            if (children != null && children.isNotEmpty()) {
                val childDst = File(dstDir, name)
                if (!childDst.exists()) childDst.mkdirs()
                copyAssetDir(context, assetPath, childDst)
            } else {
                copyAssetFile(context, assetPath, File(dstDir, name))
            }
        }
    }

    private fun copyAssetFile(context: Context, assetPath: String, dstFile: File) {
        context.assets.open(assetPath).use { input ->
            FileOutputStream(dstFile).use { output ->
                val buf = ByteArray(8 * 1024)
                while (true) {
                    val read = input.read(buf)
                    if (read <= 0) break
                    output.write(buf, 0, read)
                }
                output.flush()
            }
        }
        Logger.d("PalmModels: copied $assetPath -> ${dstFile.name}")
    }
}
