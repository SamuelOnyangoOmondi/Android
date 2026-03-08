package com.farmtopalm.terminal.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.farmtopalm.terminal.data.crypto.Crypto
import java.security.MessageDigest

object AdminPinGate {
    private const val PIN_KEY = "admin_pin_sha256"
    private const val DEFAULT_PIN = "1234"

    fun setPinHash(prefs: android.content.SharedPreferences, pin: String) {
        prefs.edit().putString(PIN_KEY, sha256(pin)).apply()
    }

    fun verify(prefs: android.content.SharedPreferences, pin: String): Boolean {
        val stored = prefs.getString(PIN_KEY, null) ?: run {
            setPinHash(prefs, DEFAULT_PIN)
            return pin == DEFAULT_PIN
        }
        return stored == sha256(pin)
    }

    fun hasPinSet(prefs: android.content.SharedPreferences): Boolean = prefs.contains(PIN_KEY)

    private fun sha256(s: String): String {
        val bytes = MessageDigest.getInstance("SHA-256").digest(s.toByteArray(Charsets.UTF_8))
        return bytes.joinToString("") { "%02x".format(it) }
    }
}

@Composable
fun AdminPinDialog(
    onVerified: () -> Unit,
    onCancel: () -> Unit,
    prefs: android.content.SharedPreferences
) {
    var pin by remember { mutableStateOf("") }
    var error by remember { mutableStateOf(false) }
    AlertDialog(
        onDismissRequest = onCancel,
        title = { Text("Admin PIN") },
        text = {
            Column {
                OutlinedTextField(value = pin, onValueChange = { pin = it; error = false }, label = { Text("PIN") }, isError = error)
                if (error) Text("Wrong PIN", color = MaterialTheme.colorScheme.error)
            }
        },
        confirmButton = {
            Button(onClick = {
                if (AdminPinGate.verify(prefs, pin)) onVerified() else error = true
            }, modifier = Modifier.heightIn(min = 68.dp)) { Text("OK") }
        },
        dismissButton = { TextButton(onClick = onCancel, modifier = Modifier.heightIn(min = 68.dp)) { Text("Cancel") } }
    )
}
