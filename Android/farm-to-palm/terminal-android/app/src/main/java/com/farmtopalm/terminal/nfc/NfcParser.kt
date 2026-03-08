package com.farmtopalm.terminal.nfc

import android.nfc.Tag

object NfcParser {
    /**
     * Returns UID as hex string (e.g. "04A1B2C3D4E5F6").
     */
    fun getUid(tag: Tag): String {
        val id = tag.id
        return id.joinToString("") { b -> "%02X".format(b) }
    }
}
