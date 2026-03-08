package com.farmtopalm.terminal.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun SettingsScreen(
    apiBaseUrl: String,
    mealRequiresPalm: Boolean,
    onMealRequiresPalmChange: (Boolean) -> Unit,
    onAdminPinChange: () -> Unit,
    onBack: () -> Unit
) {
    Column(Modifier.fillMaxSize().padding(24.dp)) {
        Text("Settings", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(16.dp))
        Text("API base URL (read-only): $apiBaseUrl", style = MaterialTheme.typography.bodySmall)
        Spacer(Modifier.height(8.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("Meal requires palm")
            Switch(checked = mealRequiresPalm, onCheckedChange = onMealRequiresPalmChange)
        }
        Spacer(Modifier.height(8.dp))
        TextButton(onClick = onAdminPinChange, modifier = Modifier.heightIn(min = 68.dp)) { Text("Change admin PIN") }
        Spacer(Modifier.height(16.dp))
        TextButton(onClick = onBack, modifier = Modifier.heightIn(min = 68.dp)) { Text("Back") }
    }
}
