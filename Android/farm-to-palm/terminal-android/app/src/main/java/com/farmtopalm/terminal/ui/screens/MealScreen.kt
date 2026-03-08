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

/** UI state for meal palm scan (same flow as attendance). */
private sealed class MealPalmScanState {
    data object Idle : MealPalmScanState()
    data object Scanning : MealPalmScanState()
    data class Matched(val studentId: String, val confidence: Float) : MealPalmScanState()
    data object NoMatch : MealPalmScanState()
    data class Error(val message: String) : MealPalmScanState()
}

@Composable
fun MealScreen(
    palmManager: PalmBiometricManager,
    nfcUid: String?,
    onNfcLookup: (uid: String) -> String?, // returns studentId or null
    mealRequiresPalm: Boolean,
    terminalId: String,
    schoolId: String,
    onRecordMeal: (studentId: String, method: String) -> Unit,
    onBack: () -> Unit
) {
    var status by remember { mutableStateOf("Tap NFC or scan palm") }
    var palmState by remember { mutableStateOf<MealPalmScanState>(MealPalmScanState.Idle) }
    var openReady by remember { mutableStateOf(false) }
    var openError by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    // NFC path: when card is tapped, lookup and record
    if (nfcUid != null) {
        LaunchedEffect(nfcUid) {
            val studentId = onNfcLookup(nfcUid)
            if (studentId != null) {
                onRecordMeal(studentId, if (mealRequiresPalm) "nfc_palm" else "nfc")
                status = "Meal recorded"
            } else status = "Card not linked"
        }
    }

    // Open palm device once when screen is entered (same as AttendanceScreen)
    LaunchedEffect(Unit) {
        palmManager.open(scope) { openResult ->
            openReady = true
            when (openResult) {
                is Result.Error -> openError = (openResult as Result.Error).message
                is Result.Success -> openError = null
            }
        }
    }

    fun startPalmScan() {
        if (palmState is MealPalmScanState.Scanning || !openReady || openError != null) return
        Logger.d("Meal: palm scan started")
        palmState = MealPalmScanState.Scanning
        palmManager.captureForIdentify(scope) { capResult ->
            when (capResult) {
                is Result.Success -> {
                    scope.launch(Dispatchers.IO) {
                        val id = palmManager.identify(capResult.value)
                        val result = when (id) {
                            is Result.Success -> MealPalmScanState.Matched(id.value.studentId, id.value.confidence)
                            is Result.Error -> MealPalmScanState.NoMatch
                        }
                        withContext(Dispatchers.Main) {
                            palmState = result
                            Logger.d("Meal: palm scan result=$result")
                            if (result is MealPalmScanState.Matched) {
                                onRecordMeal(result.studentId, "palm")
                            }
                        }
                    }
                }
                is Result.Error -> {
                    palmState = MealPalmScanState.Error((capResult as Result.Error).message)
                    Logger.d("Meal: palm scan result=Error")
                }
            }
        }
    }

    Column(
        Modifier.fillMaxSize().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Meal", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(24.dp))

        when (val state = palmState) {
            is MealPalmScanState.Idle -> {
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
                    Text(status, style = MaterialTheme.typography.bodyLarge)
                    Text("Tap Scan Palm or use NFC", style = MaterialTheme.typography.bodyMedium)
                }
            }
            is MealPalmScanState.Scanning -> {
                CircularProgressIndicator(Modifier.size(56.dp))
                Spacer(Modifier.height(8.dp))
                Text("Scanning…", style = MaterialTheme.typography.bodyLarge)
                Text("Place your palm on the reader", style = MaterialTheme.typography.bodyMedium)
            }
            is MealPalmScanState.Matched -> {
                Text("Welcome, ${state.studentId}", style = MaterialTheme.typography.titleMedium)
                Text("Meal recorded", style = MaterialTheme.typography.bodyMedium)
            }
            is MealPalmScanState.NoMatch -> {
                Text("No match", style = MaterialTheme.typography.bodyLarge)
                Text("Tap Scan Palm to try again", style = MaterialTheme.typography.bodyMedium)
            }
            is MealPalmScanState.Error -> {
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
            onClick = { startPalmScan() },
            enabled = palmState !is MealPalmScanState.Scanning && openReady && openError == null,
            modifier = Modifier.heightIn(min = 88.dp)
        ) {
            Text(
                when (palmState) {
                    is MealPalmScanState.Scanning -> "Scanning…"
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
