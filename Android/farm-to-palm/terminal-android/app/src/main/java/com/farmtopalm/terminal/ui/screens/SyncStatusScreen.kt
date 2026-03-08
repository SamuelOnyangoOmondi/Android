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
    onBack: () -> Unit
) {
    Column(Modifier.fillMaxSize().padding(24.dp)) {
        Text("Sync Status", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(16.dp))
        Text("Unsynced attendance: $unsyncedAttendance")
        Text("Unsynced meals: $unsyncedMeals")
        Text("Last sync: ${if (lastSyncTime != null) java.text.SimpleDateFormat.getDateTimeInstance().format(java.util.Date(lastSyncTime)) else "Never"}")
        Spacer(Modifier.height(16.dp))
        Button(onClick = onSyncNow, modifier = Modifier.heightIn(min = 88.dp)) { Text("Sync now") }
        Spacer(Modifier.height(8.dp))
        TextButton(onClick = onBack, modifier = Modifier.heightIn(min = 68.dp)) { Text("Back") }
    }
}
