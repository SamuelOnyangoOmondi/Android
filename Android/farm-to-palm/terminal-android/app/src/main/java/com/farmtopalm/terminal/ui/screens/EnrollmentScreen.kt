package com.farmtopalm.terminal.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.farmtopalm.terminal.biometric.PalmBiometricManager
import com.farmtopalm.terminal.biometric.PalmSdkBridge
import com.farmtopalm.terminal.data.db.entities.StudentEntity
import com.farmtopalm.terminal.util.Result
import com.farmtopalm.terminal.ui.components.PalmZoneState
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EnrollmentScreen(
    palmManager: PalmBiometricManager,
    adminPinVerified: Boolean,
    schoolId: String,
    schoolName: String?,
    students: List<StudentEntity>,
    searchQuery: String,
    onSearchChange: (String) -> Unit,
    preselectedStudentId: String? = null,
    onRequestPin: (onVerified: () -> Unit) -> Unit,
    onSaveTemplate: (externalId: String, name: String, hand: String, rgb: ByteArray, ir: ByteArray, quality: Int, streamType: String?, rgbModelHash: String?, irModelHash: String?, sdkTemplateId: String?, onSaved: () -> Unit) -> Unit,
    onBack: () -> Unit,
    onSyncStudents: () -> Unit = {},
    syncStudentsMessage: String? = null,
    syncStudentsLoading: Boolean = false
) {
    var selectedStudent by remember { mutableStateOf<StudentEntity?>(null) }
    LaunchedEffect(students, preselectedStudentId) {
        if (preselectedStudentId != null) {
            selectedStudent = students.find { it.id == preselectedStudentId }
        }
    }
    var hand by remember { mutableStateOf("left") }
    var status by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var openReady by remember { mutableStateOf(false) }
    var guidedState by remember { mutableStateOf<GuidedEnrollmentState?>(null) }
    val scope = rememberCoroutineScope()

    if (!adminPinVerified) {
        LaunchedEffect(Unit) { onRequestPin { } }
        return
    }

    LaunchedEffect(Unit) {
        status = "Opening scanner..."
        palmManager.open(scope) { openResult ->
            openReady = true
            when (openResult) {
                is Result.Error -> status = "Error: ${(openResult as Result.Error).message}"
                is Result.Success -> status = ""
            }
        }
    }

    val cardShape = RoundedCornerShape(8.dp)
    val textFieldColors = OutlinedTextFieldDefaults.colors(
        focusedBorderColor = MaterialTheme.colorScheme.primary,
        focusedLabelColor = MaterialTheme.colorScheme.primary,
        cursorColor = MaterialTheme.colorScheme.primary,
        focusedLeadingIconColor = MaterialTheme.colorScheme.primary,
        focusedTrailingIconColor = MaterialTheme.colorScheme.primary
    )

    Column(
        Modifier
            .fillMaxSize()
            .padding(24.dp)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = cardShape,
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(Modifier.padding(24.dp)) {
                Text(
                    "Enrollment",
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    "School: ${schoolName ?: schoolId}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(Modifier.height(16.dp))

                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = onSearchChange,
                    label = { Text("Search students") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    colors = textFieldColors
                )
                Spacer(Modifier.height(8.dp))

                if (students.isEmpty()) {
                    Text(
                        "No students. Sync from Supa School first.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(Modifier.height(8.dp))
                    FilledTonalButton(
                        onClick = onSyncStudents,
                        modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp),
                        shape = RoundedCornerShape(8.dp),
                        enabled = !syncStudentsLoading,
                        colors = ButtonDefaults.filledTonalButtonColors(
                            containerColor = MaterialTheme.colorScheme.secondaryContainer,
                            contentColor = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                    ) { Text(if (syncStudentsLoading) "Syncing…" else "Sync students from Supa School") }
                    if (syncStudentsMessage != null) {
                        Spacer(Modifier.height(4.dp))
                        Text(
                            syncStudentsMessage,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                } else {
                    Text(
                        "Select a student to enroll palm:",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(Modifier.height(8.dp))
                    LazyColumn(
                        modifier = Modifier.heightIn(max = 180.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        items(students) { s ->
                            val isSelected = selectedStudent?.id == s.id
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { selectedStudent = s },
                                colors = CardDefaults.cardColors(
                                    containerColor = if (isSelected) MaterialTheme.colorScheme.primaryContainer
                                    else MaterialTheme.colorScheme.surface
                                ),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Row(
                                    Modifier.padding(12.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        s.name,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = if (isSelected) MaterialTheme.colorScheme.onPrimaryContainer
                                        else MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        s.externalId,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = if (isSelected) MaterialTheme.colorScheme.onPrimaryContainer
                                        else MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(Modifier.height(16.dp))
                HandDropdown(
                    value = hand,
                    onChange = { hand = it },
                    modifier = Modifier.fillMaxWidth()
                )
                Text(
                    status,
                    color = if (status.startsWith("Error:") || status.startsWith("Capture failed")) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary,
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.padding(top = 8.dp)
                )
                if (status.contains("already in use") || status.contains("device index")) {
                    FilledTonalButton(
                        onClick = {
                            openReady = false
                            status = "Opening scanner..."
                            palmManager.release()
                            palmManager.open(scope) { openResult ->
                                openReady = true
                                when (openResult) {
                                    is Result.Error -> status = "Error: ${(openResult as Result.Error).message}"
                                    is Result.Success -> status = ""
                                }
                            }
                        },
                        modifier = Modifier.fillMaxWidth().padding(top = 8.dp).heightIn(min = 56.dp),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.filledTonalButtonColors(
                            containerColor = MaterialTheme.colorScheme.secondaryContainer,
                            contentColor = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                    ) { Text("Retry scanner") }
                }
            }
        }
        if (guidedState != null) {
            Spacer(Modifier.height(12.dp))
            GuidedEnrollmentOverlay(
                state = guidedState!!,
                hand = hand,
                modifier = Modifier.fillMaxWidth()
            )
        }
        Spacer(Modifier.height(16.dp))
        Button(
            onClick = {
                val student = selectedStudent
                if (student == null || !openReady || loading) return@Button
                loading = true
                guidedState = GuidedEnrollmentState(currentStep = 0, isCapturing = true)
                scope.launch(Dispatchers.Main) {
                    var best: GuidedCapture? = null
                    for (step in 0 until GUIDED_CAPTURE_COUNT) {
                        guidedState = guidedState!!.copy(
                            currentStep = step,
                            isCapturing = true,
                            liveHint = null,
                            error = null
                        )
                        val result = suspendCancellableCoroutine<Result<com.farmtopalm.terminal.biometric.dto.CaptureResult>> { cont ->
                            palmManager.captureForEnroll(scope, hand, { hint ->
                                guidedState = guidedState?.copy(liveHint = hint) ?: guidedState
                            }) { capResult ->
                                cont.resume(capResult)
                            }
                        }
                        when (result) {
                            is Result.Success -> {
                                val v = result.value
                                val rgb = v.rgbFeature ?: ByteArray(0)
                                val ir = v.irFeature ?: rgb
                                val q = v.quality
                                val capture = GuidedCapture(
                                    rgb, ir, q,
                                    v.streamType, v.rgbModelHash, v.irModelHash, v.matchTemplateId
                                )
                                if (q >= GUIDED_ENROLL_MIN_QUALITY) {
                                    if (best == null || q > best!!.quality) best = capture
                                    val newZones = guidedState!!.zoneStates.toMutableMap()
                                    newZones[step] = if (q >= 75) PalmZoneState.GOOD else PalmZoneState.WEAK
                                    guidedState = guidedState!!.copy(
                                        zoneStates = newZones,
                                        bestCapture = best,
                                        isCapturing = false,
                                        error = null
                                    )
                                } else {
                                    guidedState = guidedState!!.copy(
                                        isCapturing = false,
                                        error = "Quality $q% too low. Retrying..."
                                    )
                                    if (best == null) best = capture
                                }
                            }
                            is Result.Error -> {
                                val msg = (result as Result.Error).message
                                guidedState = guidedState!!.copy(
                                    isCapturing = false,
                                    error = msg
                                )
                            }
                        }
                        if (step < GUIDED_CAPTURE_COUNT - 1) {
                            kotlinx.coroutines.delay(800)
                        }
                    }
                    withContext(Dispatchers.Main) {
                        loading = false
                        guidedState = null
                        val finalBest = best
                        if (finalBest != null && finalBest.quality >= GUIDED_ENROLL_MIN_QUALITY) {
                            onSaveTemplate(
                                student!!.externalId,
                                student!!.name,
                                hand,
                                finalBest.rgb,
                                finalBest.ir,
                                finalBest.quality,
                                finalBest.streamType,
                                finalBest.rgbModelHash,
                                finalBest.irModelHash,
                                finalBest.sdkTemplateId
                            ) {
                                status = if (PalmSdkBridge.isUsingRealSdk) "Saved (quality ${finalBest.quality}%)" else "Saved"
                                selectedStudent = null
                            }
                        } else {
                            status = finalBest?.let { "Quality too low (${it.quality}%). Hold palm 2–4 cm above sensor, good lighting." }
                                ?: "Capture failed. Hold palm 2–4 cm above sensor, good lighting."
                        }
                    }
                }
            },
            enabled = selectedStudent != null && !loading && openReady && !status.startsWith("Error:"),
            modifier = Modifier.fillMaxWidth().heightIn(min = 56.dp),
            shape = RoundedCornerShape(8.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary
            )
        ) {
            Text(
                when {
                    loading -> "Guided capture…"
                    selectedStudent != null -> "Capture & Save palm for ${selectedStudent!!.name}"
                    else -> "Select a student first"
                }
            )
        }
        Spacer(Modifier.height(8.dp))
        TextButton(
            onClick = onBack,
            modifier = Modifier.heightIn(min = 48.dp),
            colors = ButtonDefaults.textButtonColors(contentColor = MaterialTheme.colorScheme.primary)
        ) { Text("Back") }
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
