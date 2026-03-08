package com.farmtopalm.terminal.usb

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.hardware.usb.UsbDevice
import android.hardware.usb.UsbManager
import android.os.Build
import com.farmtopalm.terminal.util.Logger
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import java.util.concurrent.atomic.AtomicReference
import kotlin.coroutines.resume

/** Eyecool ECX166 V (735f:6204) — vendor-specific USB, no kernel driver. */
private const val EYECOOL_VENDOR_ID = 0x735f
private const val EYECOOL_PRODUCT_ID = 0x6204

const val ACTION_USB_PERMISSION = "com.farmtopalm.terminal.USB_PERMISSION"

/**
 * Find the Eyecool palm device (735f:6204) in the USB device list.
 * Returns null if not attached.
 */
fun findEyecoolDevice(context: Context): UsbDevice? {
    val usbManager = context.applicationContext.getSystemService(Context.USB_SERVICE) as UsbManager
    return usbManager.deviceList.values.firstOrNull { d ->
        d.vendorId == EYECOOL_VENDOR_ID && d.productId == EYECOOL_PRODUCT_ID
    }
}

/**
 * Ensure USB permission for the Eyecool device. Call before any vendor SDK open/identify.
 * - If device not found: returns false, [lastError] can be set by caller.
 * - If already has permission: returns true.
 * - Otherwise: requests permission, suspends until user allows/denies, then returns the result.
 */
suspend fun ensureUsbPermission(context: Context): Boolean = withContext(Dispatchers.Main.immediate) {
    val appContext = context.applicationContext
    val usbManager = appContext.getSystemService(Context.USB_SERVICE) as UsbManager
    val device = findEyecoolDevice(appContext)
    if (device == null) {
        Logger.d("UsbPermission: Eyecool device (735f:6204) not found")
        return@withContext false
    }
    if (usbManager.hasPermission(device)) {
        Logger.d("UsbPermission: already granted for 735f:6204")
        return@withContext true
    }
    Logger.d("UsbPermission: requesting permission for 735f:6204")
    suspendCancellableCoroutine { cont ->
        val resultRef = AtomicReference<Boolean?>(null)
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(ctx: Context, intent: Intent) {
                if (intent.action != ACTION_USB_PERMISSION) return
                val dev = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    intent.getParcelableExtra(UsbManager.EXTRA_DEVICE, UsbDevice::class.java)
                } else {
                    @Suppress("DEPRECATION")
                    intent.getParcelableExtra(UsbManager.EXTRA_DEVICE)
                }
                val granted = intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)
                if (dev != null && dev.vendorId == EYECOOL_VENDOR_ID && dev.productId == EYECOOL_PRODUCT_ID) {
                    if (resultRef.compareAndSet(null, granted)) {
                        try {
                            appContext.unregisterReceiver(this)
                        } catch (_: IllegalArgumentException) { }
                        Logger.d("UsbPermission: ${if (granted) "granted" else "denied"} for 735f:6204")
                        cont.resume(granted)
                    }
                }
            }
        }
        val filter = IntentFilter(ACTION_USB_PERMISSION)
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                appContext.registerReceiver(receiver, filter, Context.RECEIVER_NOT_EXPORTED)
            } else {
                @Suppress("DEPRECATION")
                appContext.registerReceiver(receiver, filter)
            }
        } catch (e: Exception) {
            Logger.e("UsbPermission: registerReceiver failed", e)
            cont.resume(false)
            return@suspendCancellableCoroutine
        }
        cont.invokeOnCancellation {
            try {
                appContext.unregisterReceiver(receiver)
            } catch (_: IllegalArgumentException) { }
        }
        val pendingIntent = android.app.PendingIntent.getBroadcast(
            appContext,
            0,
            Intent(ACTION_USB_PERMISSION),
            android.app.PendingIntent.FLAG_IMMUTABLE or android.app.PendingIntent.FLAG_UPDATE_CURRENT
        )
        usbManager.requestPermission(device, pendingIntent)
    }
}
