package com.farmtopalm.terminal.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.farmtopalm.terminal.data.db.entities.StudentEntity

@Composable
fun StudentsScreen(
    schoolId: String,
    students: List<StudentEntity>,
    searchQuery: String,
    onSearchChange: (String) -> Unit,
    onBack: () -> Unit
) {
    Column(Modifier.fillMaxSize().padding(16.dp)) {
        OutlinedTextField(value = searchQuery, onValueChange = onSearchChange, label = { Text("Search") }, modifier = Modifier.fillMaxWidth())
        Spacer(Modifier.height(8.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            items(students) { s ->
                Card(Modifier.fillMaxWidth()) {
                    Row(Modifier.padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(s.name)
                        Text(s.externalId, style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }
        TextButton(onClick = onBack, modifier = Modifier.heightIn(min = 68.dp)) { Text("Back") }
    }
}
