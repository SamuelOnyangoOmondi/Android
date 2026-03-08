package com.farmtopalm.terminal.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

data class AttendanceRowUi(
    val studentLabel: String,
    val timeLabel: String,
    val confidenceLabel: String
)

data class MealRowUi(
    val studentLabel: String,
    val timeLabel: String,
    val methodLabel: String
)

@Composable
fun AttendanceListScreen(
    rows: List<AttendanceRowUi>,
    onBack: () -> Unit
) {
    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Attendance events", style = MaterialTheme.typography.titleLarge)
        Spacer(Modifier.height(8.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(4.dp), modifier = Modifier.weight(1f, fill = true)) {
            items(rows) { row ->
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp)) {
                        Text(row.studentLabel, style = MaterialTheme.typography.titleMedium)
                        Spacer(Modifier.height(4.dp))
                        Text(row.timeLabel, style = MaterialTheme.typography.bodyMedium)
                        Text(row.confidenceLabel, style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }
        TextButton(onClick = onBack, modifier = Modifier.heightIn(min = 68.dp)) { Text("Back") }
    }
}

@Composable
fun MealListScreen(
    rows: List<MealRowUi>,
    onBack: () -> Unit
) {
    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Meal events", style = MaterialTheme.typography.titleLarge)
        Spacer(Modifier.height(8.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(4.dp), modifier = Modifier.weight(1f, fill = true)) {
            items(rows) { row ->
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp)) {
                        Text(row.studentLabel, style = MaterialTheme.typography.titleMedium)
                        Spacer(Modifier.height(4.dp))
                        Text(row.timeLabel, style = MaterialTheme.typography.bodyMedium)
                        Text(row.methodLabel, style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }
        TextButton(onClick = onBack, modifier = Modifier.heightIn(min = 68.dp)) { Text("Back") }
    }
}

