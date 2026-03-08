package com.farmtopalm.terminal.nfc

import android.app.Activity
import android.content.Intent
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.tech.NfcA
import com.farmtopalm.terminal.util.Logger

class NfcManager(private val activity: Activity) {

    private val nfcAdapter: NfcAdapter? by lazy { NfcAdapter.getDefaultAdapter(activity) }

    fun isNfcAvailable(): Boolean = nfcAdapter != null
    fun isNfcEnabled(): Boolean = nfcAdapter?.isEnabled == true

    fun enableForegroundDispatch() {
        // Call from Activity.onResume with PendingIntent; handled in Activity.onNewIntent
        Logger.d("NFC foreground dispatch should be enabled by Activity")
    }

    fun disableForegroundDispatch() {
        Logger.d("NFC foreground dispatch disabled")
    }

    fun fromIntent(intent: Intent): Tag? {
        return when (intent.action) {
            NfcAdapter.ACTION_NDEF_DISCOVERED, NfcAdapter.ACTION_TECH_DISCOVERED, NfcAdapter.ACTION_TAG_DISCOVERED -> intent.getParcelableExtra(NfcAdapter.EXTRA_TAG)
            else -> null
        }
    }
}
