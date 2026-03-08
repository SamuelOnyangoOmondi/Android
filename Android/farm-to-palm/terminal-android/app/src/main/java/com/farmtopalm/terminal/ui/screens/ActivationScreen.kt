package com.farmtopalm.terminal.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.farmtopalm.terminal.provisioning.ProvisioningManager
import com.farmtopalm.terminal.util.Result
import kotlinx.coroutines.launch

@Composable
fun ActivationScreen(
    defaultBaseUrl: String,
    onActivated: () -> Unit,
    onOpenWifiSettings: () -> Unit,
    onGoHome: () -> Unit,
    provisioningManager: ProvisioningManager
) {
    var code by remember { mutableStateOf("") }
    var baseUrl by remember { mutableStateOf(defaultBaseUrl) }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var testResult by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    Column(Modifier.fillMaxSize().padding(24.dp), verticalArrangement = Arrangement.Center, horizontalAlignment = Alignment.CenterHorizontally) {
        Text("FarmToPalm", style = MaterialTheme.typography.headlineLarge)
        Spacer(Modifier.height(8.dp))
        Text("Enter activation code", style = MaterialTheme.typography.bodyLarge)
        Spacer(Modifier.height(16.dp))
        OutlinedTextField(value = code, onValueChange = { code = it }, label = { Text("Activation code") }, singleLine = true, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(
            value = baseUrl,
            onValueChange = { baseUrl = it },
            label = { Text("API base URL") },
            placeholder = { Text("http://192.168.1.128:3000") },
            supportingText = { Text("Mac on cable (Ethernet)? Use same WiFi as this device, or connect both to phone hotspot. Then use Mac's WiFi IP.") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
        )
        error?.let { Text(it, color = MaterialTheme.colorScheme.error, modifier = Modifier.padding(top = 8.dp), maxLines = 6) }
        testResult?.let { Text(it, color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(top = 8.dp), maxLines = 4) }
        Spacer(Modifier.height(12.dp))
        OutlinedButton(
            onClick = {
                testResult = null
                scope.launch {
                    testResult = when (val r = provisioningManager.pingHealth(baseUrl.trim())) {
                        is Result.Success -> "Connection OK: ${r.value}"
                        is Result.Error -> "Test failed: ${r.message}"
                    }
                }
            },
            modifier = Modifier.fillMaxWidth().heightIn(min = 76.dp)
        ) { Text("Test connection") }
        Spacer(Modifier.height(8.dp))
        Button(
            onClick = {
            loading = true
            error = null
            testResult = null
            scope.launch {
                when (val r = provisioningManager.activate(code.trim(), baseUrl.trim())) {
                    is Result.Success -> onActivated()
                    is Result.Error -> { error = r.message; loading = false }
                }
                loading = false
            }
        }, enabled = !loading && code.isNotBlank(), modifier = Modifier.heightIn(min = 88.dp)) { Text(if (loading) "Activating…" else "Activate") }
        Spacer(Modifier.height(16.dp))
        Text("Need to set up WiFi?", style = MaterialTheme.typography.bodySmall)
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedButton(onClick = onOpenWifiSettings, modifier = Modifier.weight(1f).heightIn(min = 76.dp)) { Text("WiFi settings") }
            OutlinedButton(onClick = onGoHome, modifier = Modifier.weight(1f).heightIn(min = 76.dp)) { Text("Go home") }
        }
    }
}
