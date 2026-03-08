package com.farmtopalm.terminal.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.farmtopalm.terminal.biometric.PalmSdkBridge
import com.farmtopalm.terminal.biometric.dto.PalmDeviceStatus

@Composable
fun DeviceStatusScreen(
    palmStatus: PalmDeviceStatus?,
    onBack: () -> Unit
) {
    val status = palmStatus ?: PalmDeviceStatus(initialized = false, deviceConnected = false, open = false, lastError = "SDK not wired")
    var selfTestRunning by remember { mutableStateOf(false) }
    var selfTestResult by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    Column(Modifier.fillMaxSize().padding(24.dp).verticalScroll(rememberScrollState())) {
        Text("Device Status", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(16.dp))
        Text("Initialized: ${status.initialized}")
        Text("Device connected: ${status.deviceConnected}")
        Text("Open: ${status.open}")
        Text("Last error: ${status.lastError ?: "—"}")
        Spacer(Modifier.height(16.dp))

        Text("Hardware Self Test", style = MaterialTheme.typography.titleSmall)
        Text("Run init → open → capture once and show rgb/ir bytes and quality (or error).", style = MaterialTheme.typography.bodySmall)
        Spacer(Modifier.height(8.dp))
        Button(
            onClick = {
                selfTestRunning = true
                selfTestResult = null
                PalmSdkBridge.runHardwareSelfTest(scope) { success, rgbBytes, irBytes, quality, error ->
                    selfTestRunning = false
                    selfTestResult = if (success) {
                        "OK — rgbBytes=$rgbBytes, irBytes=$irBytes, quality=$quality"
                    } else {
                        "Failed — ${error ?: "unknown"}"
                    }
                }
            },
            enabled = !selfTestRunning,
            modifier = Modifier.heightIn(min = 88.dp)
        ) {
            Text(if (selfTestRunning) "Running…" else "Run Hardware Self Test")
        }
        selfTestResult?.let { Text(it, style = MaterialTheme.typography.bodySmall, modifier = Modifier.padding(top = 8.dp)) }

        Spacer(Modifier.height(16.dp))
        TextButton(onClick = onBack, modifier = Modifier.heightIn(min = 68.dp)) { Text("Back") }
    }
}
