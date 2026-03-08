package com.farmtopalm.terminal.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.farmtopalm.terminal.biometric.PalmBiometricManager
import com.farmtopalm.terminal.util.Logger
import com.farmtopalm.terminal.util.Result
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/** UI state for attendance palm scan. "No match" only after a real scan attempt. */
private sealed class AttendanceScanState {
    data object Idle : AttendanceScanState()
    data object Scanning : AttendanceScanState()
    data class Matched(val studentId: String, val confidence: Float) : AttendanceScanState()
    data object NoMatch : AttendanceScanState()
    data class Error(val message: String) : AttendanceScanState()
}

@Composable
fun AttendanceScreen(
    palmManager: PalmBiometricManager,
    terminalId: String,
    schoolId: String,
    onRecordAttendance: (studentId: String, confidence: Float) -> Unit,
    onBack: () -> Unit
) {
    var scanState by remember { mutableStateOf<AttendanceScanState>(AttendanceScanState.Idle) }
    var openReady by remember { mutableStateOf(false) }
    var openError by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    // Open once when screen is entered; reuse same device when re-entering (do not release on leave).
    LaunchedEffect(Unit) {
        palmManager.open(scope) { openResult ->
            openReady = true
            when (openResult) {
                is Result.Error -> openError = (openResult as Result.Error).message
                is Result.Success -> openError = null
            }
        }
    }

    fun startScan() {
        if (scanState is AttendanceScanState.Scanning || !openReady || openError != null) return
        Logger.d("Attendance: scan started")
        scanState = AttendanceScanState.Scanning
        palmManager.captureForIdentify(scope) { capResult ->
            when (capResult) {
                is Result.Success -> {
                    // Run identify on IO thread to avoid blocking Main (was causing ANR / "app keeps stopping")
                    scope.launch(Dispatchers.IO) {
                        val id = palmManager.identify(capResult.value)
                        val result = when (id) {
                            is Result.Success -> AttendanceScanState.Matched(id.value.studentId, id.value.confidence)
                            is Result.Error -> AttendanceScanState.NoMatch
                        }
                        withContext(Dispatchers.Main) {
                            scanState = result
                            Logger.d("Attendance: scan result=$result")
                            if (result is AttendanceScanState.Matched) {
                                onRecordAttendance(result.studentId, result.confidence)
                            }
                        }
                    }
                }
                is Result.Error -> {
                    scanState = AttendanceScanState.Error((capResult as Result.Error).message)
                    Logger.d("Attendance: scan result=Error")
                }
            }
        }
    }

    Column(
        Modifier.fillMaxSize().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Attendance", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(24.dp))

        when (val state = scanState) {
            is AttendanceScanState.Idle -> {
                if (openError != null) {
                    Text("Scanner error", style = MaterialTheme.typography.bodyLarge)
                    Text(openError!!, style = MaterialTheme.typography.bodySmall)
                    if (openError!!.contains("already in use") || openError!!.contains("device index")) {
                        Text("Tap Retry to restart scanner", style = MaterialTheme.typography.bodyMedium)
                    }
                } else if (!openReady) {
                    Text("Opening scanner…", style = MaterialTheme.typography.bodyLarge)
                    Text("Please wait", style = MaterialTheme.typography.bodyMedium)
                } else {
                    Text("Ready to scan", style = MaterialTheme.typography.bodyLarge)
                    Text("Tap Scan Palm to identify", style = MaterialTheme.typography.bodyMedium)
                }
            }
            is AttendanceScanState.Scanning -> {
                CircularProgressIndicator(Modifier.size(56.dp))
                Spacer(Modifier.height(8.dp))
                Text("Scanning…", style = MaterialTheme.typography.bodyLarge)
                Text("Place your palm on the reader", style = MaterialTheme.typography.bodyMedium)
            }
            is AttendanceScanState.Matched -> {
                Text("Welcome, ${state.studentId}", style = MaterialTheme.typography.titleMedium)
                Text("Attendance recorded", style = MaterialTheme.typography.bodyMedium)
            }
            is AttendanceScanState.NoMatch -> {
                Text("No match", style = MaterialTheme.typography.bodyLarge)
                Text("Tap Scan Palm to try again", style = MaterialTheme.typography.bodyMedium)
            }
            is AttendanceScanState.Error -> {
                Text("Scan failed", style = MaterialTheme.typography.bodyLarge)
                Text(state.message, style = MaterialTheme.typography.bodySmall)
                if (state.message.contains("TIMEOUT", ignoreCase = true) || state.message.contains("no palm", ignoreCase = true)) {
                    Spacer(Modifier.height(8.dp))
                    Text("Tip: Hold palm 2–4 cm above sensor, avoid shadows.", style = MaterialTheme.typography.bodySmall)
                }
            }
        }

        Spacer(Modifier.height(24.dp))

        Button(
            onClick = { startScan() },
            enabled = scanState !is AttendanceScanState.Scanning && openReady && openError == null,
            modifier = Modifier.heightIn(min = 88.dp)
        ) {
            Text(
                when (scanState) {
                    is AttendanceScanState.Scanning -> "Scanning…"
                    else -> "Scan Palm"
                }
            )
        }

        Spacer(Modifier.height(16.dp))
        if (openError != null && (openError!!.contains("already in use") || openError!!.contains("device index"))) {
            Button(
                onClick = {
                    openReady = false
                    openError = null
                    palmManager.release()
                    palmManager.open(scope) { openResult ->
                        openReady = true
                        when (openResult) {
                            is Result.Error -> openError = (openResult as Result.Error).message
                            is Result.Success -> openError = null
                        }
                    }
                },
                modifier = Modifier.heightIn(min = 88.dp)
            ) { Text("Retry scanner") }
            Spacer(Modifier.height(8.dp))
        }
        TextButton(onClick = onBack, modifier = Modifier.heightIn(min = 68.dp)) { Text("Back") }
    }
}
