package com.farmtopalm.terminal.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun SyncStatusScreen(
    unsyncedAttendance: Int,
    unsyncedMeals: Int,
    lastSyncTime: Long?,
    onSyncNow: () -> Unit,
    onSyncStudentsFromSupaSchool: () -> Unit,
    syncStudentsMessage: String?,
    syncStudentsLoading: Boolean,
    syncInProgress: Boolean,
    syncProgress: Int,
    syncStage: String,
    syncCompleted: Boolean?,
    onRefreshCounts: () -> Unit,
    onBack: () -> Unit
) {
    val isSyncing = syncInProgress
    val syncSucceeded = syncCompleted == true
    val syncFailed = syncCompleted == false

    var showSyncStartedDialog by remember { mutableStateOf(false) }

    LaunchedEffect(syncSucceeded, syncFailed) {
        if (syncSucceeded || syncFailed) {
            onRefreshCounts()
            kotlinx.coroutines.delay(300)
            onRefreshCounts()
        }
    }
    LaunchedEffect(Unit) {
        while (true) {
            kotlinx.coroutines.delay(3000)
            onRefreshCounts()
        }
    }

    if (showSyncStartedDialog) {
        AlertDialog(
            onDismissRequest = { showSyncStartedDialog = false },
            title = { Text("Sync started") },
            text = { Text("Syncing attendance, meals, and palm data.") },
            confirmButton = {
                TextButton(onClick = { showSyncStartedDialog = false }) { Text("OK") }
            }
        )
    }

    Column(Modifier.fillMaxSize().padding(24.dp)) {
        Text("Sync Status", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(16.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Column {
                Text("Unsynced attendance: $unsyncedAttendance")
                Text("Unsynced meals: $unsyncedMeals")
                Text("Last sync: ${if (lastSyncTime != null) java.text.SimpleDateFormat.getDateTimeInstance().format(java.util.Date(lastSyncTime)) else "Never"}")
            }
            TextButton(onClick = onRefreshCounts) { Text("Refresh") }
        }
        Spacer(Modifier.height(16.dp))

        Button(
            onClick = {
                showSyncStartedDialog = true
                onSyncNow()
            },
            modifier = Modifier.heightIn(min = 48.dp),
            enabled = !isSyncing
        ) {
            Text(if (isSyncing) "Syncing…" else "Sync now")
        }

        if (isSyncing || syncSucceeded || syncFailed) {
            Spacer(Modifier.height(12.dp))
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = when {
                        isSyncing -> MaterialTheme.colorScheme.surfaceVariant
                        syncSucceeded -> MaterialTheme.colorScheme.primaryContainer
                        else -> MaterialTheme.colorScheme.errorContainer
                    }
                )
            ) {
                Column(Modifier.padding(16.dp)) {
                    if (isSyncing) {
                        Text(syncStage.ifBlank { "Syncing…" }, style = MaterialTheme.typography.bodyMedium)
                        Spacer(Modifier.height(8.dp))
                        LinearProgressIndicator(
                            progress = { syncProgress.toFloat() / 100f },
                            modifier = Modifier.fillMaxWidth().height(8.dp)
                        )
                    } else if (syncSucceeded) {
                        Text("Sync complete", style = MaterialTheme.typography.bodyMedium)
                    } else if (syncFailed) {
                        Column {
                            Text("Sync failed.", style = MaterialTheme.typography.bodyMedium)
                            if (syncStage.isNotBlank() && syncStage != "Sync had errors") {
                                Spacer(Modifier.height(4.dp))
                                Text(syncStage, style = MaterialTheme.typography.bodySmall)
                            }
                        }
                    }
                }
            }
        }

        Spacer(Modifier.height(16.dp))
        Text("Supa School", style = MaterialTheme.typography.titleMedium)
        Text("Sync student list from Supa School so attendance/meals show on the dashboard.", style = MaterialTheme.typography.bodySmall)
        Spacer(Modifier.height(8.dp))
        Button(
            onClick = onSyncStudentsFromSupaSchool,
            modifier = Modifier.heightIn(min = 48.dp),
            enabled = !syncStudentsLoading
        ) { Text(if (syncStudentsLoading) "Syncing…" else "Sync students from Supa School") }
        if (syncStudentsMessage != null) {
            Spacer(Modifier.height(4.dp))
            Text(syncStudentsMessage, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.primary)
        }
        Spacer(Modifier.height(16.dp))
        TextButton(onClick = onBack, modifier = Modifier.heightIn(min = 48.dp)) { Text("Back") }
    }
}
