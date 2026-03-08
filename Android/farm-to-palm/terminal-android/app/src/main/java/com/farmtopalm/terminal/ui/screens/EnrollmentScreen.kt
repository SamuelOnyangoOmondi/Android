package com.farmtopalm.terminal.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.farmtopalm.terminal.biometric.PalmBiometricManager
import com.farmtopalm.terminal.biometric.PalmSdkBridge
import com.farmtopalm.terminal.util.Result

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EnrollmentScreen(
    palmManager: PalmBiometricManager,
    adminPinVerified: Boolean,
    onRequestPin: (onVerified: () -> Unit) -> Unit,
    onSaveTemplate: (externalId: String, name: String, hand: String, rgb: ByteArray, ir: ByteArray, quality: Int, streamType: String?, rgbModelHash: String?, irModelHash: String?, sdkTemplateId: String?, onSaved: () -> Unit) -> Unit,
    onBack: () -> Unit
) {
    var externalId by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    var hand by remember { mutableStateOf("left") }
    var status by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var openReady by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    if (!adminPinVerified) {
        LaunchedEffect(Unit) { onRequestPin { } }
        return
    }

    // Open once when screen is entered; reuse same device when re-entering (do not release on leave).
    LaunchedEffect(Unit) {
        status = "Opening scanner…"
        palmManager.open(scope) { openResult ->
            openReady = true
            when (openResult) {
                is Result.Error -> status = "Error: ${(openResult as Result.Error).message}"
                is Result.Success -> status = ""
            }
        }
    }

    Column(Modifier.fillMaxSize().padding(24.dp)) {
        Text("Enrollment", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(16.dp))
        OutlinedTextField(value = externalId, onValueChange = { externalId = it }, label = { Text("External ID") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Name") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp))
        HandDropdown(value = hand, onChange = { hand = it }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp))
        Text(status, color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(top = 8.dp))
        if (status.contains("already in use") || status.contains("device index")) {
            Button(
                onClick = {
                    openReady = false
                    status = "Opening scanner…"
                    palmManager.release()
                    palmManager.open(scope) { openResult ->
                        openReady = true
                        when (openResult) {
                            is Result.Error -> status = "Error: ${(openResult as Result.Error).message}"
                            is Result.Success -> status = ""
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth().padding(top = 8.dp).heightIn(min = 88.dp)
            ) { Text("Retry scanner") }
        }
        Spacer(Modifier.height(16.dp))
        Button(
            onClick = {
                if (externalId.isBlank() || name.isBlank() || !openReady || loading) return@Button
                loading = true
                status = "Capturing…"
                palmManager.captureForEnroll(scope, hand) { capResult ->
                    when (capResult) {
                        is Result.Success -> {
                            val rgb = capResult.value.rgbFeature ?: ByteArray(0)
                            val ir = capResult.value.irFeature ?: ByteArray(0)
                            val v = capResult.value
                            onSaveTemplate(
                                externalId.trim(), name.trim(), hand, rgb, ir, v.quality,
                                v.streamType, v.rgbModelHash, v.irModelHash, v.matchTemplateId
                            ) {
                                status = if (PalmSdkBridge.isUsingRealSdk) "Saved (vendor template)" else "Saved"
                                loading = false
                            }
                        }
                        is Result.Error -> {
                            val msg = (capResult as Result.Error).message
                            status = "Capture failed: $msg"
                            if (msg.contains("TIMEOUT", ignoreCase = true) || msg.contains("no palm", ignoreCase = true)) {
                                status += "\nTip: Hold palm 2–4 cm above sensor, avoid shadows."
                            }
                            loading = false
                        }
                    }
                }
            },
            enabled = !loading && openReady && !status.startsWith("Error:"),
            modifier = Modifier.heightIn(min = 88.dp)
        ) { Text("Capture & Save") }
        Spacer(Modifier.height(8.dp))
        TextButton(onClick = onBack, modifier = Modifier.heightIn(min = 68.dp)) { Text("Back") }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HandDropdown(
    value: String,
    onChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val options = listOf("Left", "Right")
    var expanded by remember { mutableStateOf(false) }
    val displayValue = value.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = !expanded },
        modifier = modifier
    ) {
        OutlinedTextField(
            value = displayValue,
            onValueChange = {},
            readOnly = true,
            label = { Text("Hand (Left/Right)") },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            modifier = Modifier
                .menuAnchor()
                .fillMaxWidth()
        )
        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            options.forEach { opt ->
                DropdownMenuItem(
                    text = { Text(opt) },
                    onClick = {
                        onChange(opt.lowercase())
                        expanded = false
                    }
                )
            }
        }
    }
}
