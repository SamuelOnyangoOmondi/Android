package com.farmtopalm.terminal.ui.screens

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import java.text.SimpleDateFormat
import java.util.*

// ——— Mobile-first: base 16dp, tight 12dp ———
private val SpaceMicro = 8.dp
private val SpaceTight = 12.dp
private val SpaceStandard = 16.dp
private val SpaceSection = 24.dp
private val SpaceMajor = 32.dp

// ——— Breakpoints: Compact <600, Medium 600–840, Expanded >840 ———
private enum class WidthClass { Compact, Medium, Expanded }

@Composable
private fun rememberWidthClass(): WidthClass {
    val config = LocalConfiguration.current
    val widthDp = config.screenWidthDp
    return when {
        widthDp < 600 -> WidthClass.Compact
        widthDp < 840 -> WidthClass.Medium
        else -> WidthClass.Expanded
    }
}

// ——— Card radii ———
private val StatCardRadius = 16.dp
private val PrimaryButtonRadius = 16.dp
private val GridCardRadius = 14.dp

@Composable
fun HomeScreen(
    modifier: Modifier = Modifier,
    todayAttendanceCount: Int,
    todayMealCount: Int,
    onAttendance: () -> Unit,
    onMeal: () -> Unit,
    onEnrollment: () -> Unit,
    onStudents: () -> Unit,
    onSyncStatus: () -> Unit,
    onDeviceStatus: () -> Unit,
    onSettings: () -> Unit,
    onAttendanceList: () -> Unit,
    onMealList: () -> Unit,
) {
    val widthClass = rememberWidthClass()
    val scroll = rememberScrollState()
    Column(
        modifier = modifier
            .fillMaxSize()
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(scroll),
    ) {
        HeaderSection()
        Spacer(Modifier.height(SpaceTight))
        StatsSection(
            todayAttendanceCount = todayAttendanceCount,
            todayMealCount = todayMealCount,
            onAttendanceList = onAttendanceList,
            onMealList = onMealList,
        )
        Spacer(Modifier.height(SpaceTight))
        PrimaryActionsSection(
            onAttendance = onAttendance,
            onMeal = onMeal,
        )
        Spacer(Modifier.height(SpaceSection))
        SecondaryGridSection(
            widthClass = widthClass,
            onEnrollment = onEnrollment,
            onStudents = onStudents,
            onSyncStatus = onSyncStatus,
            onDeviceStatus = onDeviceStatus,
            onSettings = onSettings,
        )
        Spacer(Modifier.height(SpaceMajor))
    }
}

@Composable
private fun HeaderSection() {
    val dateFormat = remember { SimpleDateFormat("EEE, MMM d", Locale.getDefault()) }
    val greeting = remember { greetingForHour() }
    val dateStr = remember { dateFormat.format(Date()) }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 144.dp)
            .padding(vertical = SpaceTight),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = greeting,
                style = MaterialTheme.typography.headlineMedium,
                color = MaterialTheme.colorScheme.onBackground,
            )
            Spacer(Modifier.height(4.dp))
            Text(
                text = dateStr,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Column(horizontalAlignment = Alignment.End) {
            Text(
                text = "Device",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Spacer(Modifier.height(4.dp))
            SyncIndicatorDot()
        }
    }
}

@Composable
private fun SyncIndicatorDot() {
    Box(
        modifier = Modifier
            .size(26.dp)
            .clip(androidx.compose.foundation.shape.CircleShape)
            .background(MaterialTheme.colorScheme.outline.copy(alpha = 0.6f)),
    )
}

@Composable
private fun StatsSection(
    todayAttendanceCount: Int,
    todayMealCount: Int,
    onAttendanceList: () -> Unit,
    onMealList: () -> Unit,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(SpaceStandard),
    ) {
        StatCard(
            modifier = Modifier.weight(1f),
            icon = Icons.Default.Badge,
            value = todayAttendanceCount.toString(),
            label = "Attendance Today",
            onClick = onAttendanceList,
        )
        StatCard(
            modifier = Modifier.weight(1f),
            icon = Icons.Default.Restaurant,
            value = todayMealCount.toString(),
            label = "Meals Today",
            onClick = onMealList,
        )
    }
}

@Composable
private fun StatCard(
    modifier: Modifier = Modifier,
    icon: ImageVector,
    value: String,
    label: String,
    onClick: () -> Unit,
) {
    Card(
        modifier = modifier
            .height(264.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(StatCardRadius),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
    ) {
        Box(modifier = Modifier.fillMaxSize().padding(SpaceStandard)) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier
                    .size(64.dp)
                    .align(Alignment.TopStart),
                tint = MaterialTheme.colorScheme.primary,
            )
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(top = 72.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(
                    text = value,
                    style = MaterialTheme.typography.headlineLarge,
                    color = MaterialTheme.colorScheme.onSurface,
                )
                Spacer(Modifier.height(SpaceMicro))
                Text(
                    text = label,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun PrimaryActionsSection(
    onAttendance: () -> Unit,
    onMeal: () -> Unit,
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(SpaceTight),
    ) {
        PrimaryButton(
            text = "Scan Attendance",
            icon = Icons.Default.Fingerprint,
            onClick = onAttendance,
        )
        SecondaryButton(
            text = "Record Meal",
            icon = Icons.Default.Restaurant,
            onClick = onMeal,
        )
    }
}

@Composable
private fun PrimaryButton(
    text: String,
    icon: ImageVector,
    onClick: () -> Unit,
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.97f else 1f,
        animationSpec = tween(150),
        label = "scale",
    )

    Button(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .height(136.dp)
            .scale(scale),
        shape = RoundedCornerShape(PrimaryButtonRadius),
        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
        elevation = ButtonDefaults.buttonElevation(defaultElevation = 2.dp),
        interactionSource = interactionSource,
        contentPadding = PaddingValues(horizontal = SpaceStandard, vertical = SpaceTight),
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(56.dp),
        )
        Spacer(Modifier.width(SpaceTight))
        Text(
            text = text,
            style = MaterialTheme.typography.labelLarge,
        )
    }
}

@Composable
private fun SecondaryButton(
    text: String,
    icon: ImageVector,
    onClick: () -> Unit,
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.97f else 1f,
        animationSpec = tween(150),
        label = "scale",
    )

    OutlinedButton(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .height(136.dp)
            .scale(scale),
        shape = RoundedCornerShape(PrimaryButtonRadius),
        interactionSource = interactionSource,
        contentPadding = PaddingValues(horizontal = SpaceStandard, vertical = SpaceTight),
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(56.dp),
        )
        Spacer(Modifier.width(SpaceTight))
        Text(
            text = text,
            style = MaterialTheme.typography.labelLarge,
        )
    }
}

@Composable
private fun SecondaryGridSection(
    widthClass: WidthClass,
    onEnrollment: () -> Unit,
    onStudents: () -> Unit,
    onSyncStatus: () -> Unit,
    onDeviceStatus: () -> Unit,
    onSettings: () -> Unit,
) {
    // Always 2 per row: 2, 2, 1 layout with larger tiles
    val gridColumns = 2
    val tileHeight = 240.dp
    val tileIconSize = 72.dp

    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "More",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = SpaceStandard),
        )
        val items = listOf(
            Triple(Icons.Default.Person, "Students", onStudents),
            Triple(Icons.Default.PersonAdd, "Enrollment", onEnrollment),
            Triple(Icons.Default.Sync, "Sync Status", onSyncStatus),
            Triple(Icons.Default.PhoneAndroid, "Device Status", onDeviceStatus),
            Triple(Icons.Default.Settings, "Settings", onSettings),
        )
        var index = 0
        while (index < items.size) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(SpaceStandard),
            ) {
                repeat(gridColumns) { col ->
                    if (index < items.size) {
                        val (icon, label, onClick) = items[index]
                        GridCard(
                            modifier = Modifier.weight(1f),
                            icon = icon,
                            label = label,
                            iconSize = tileIconSize,
                            height = tileHeight,
                            onClick = onClick,
                        )
                        index++
                    } else {
                        Spacer(Modifier.weight(1f))
                    }
                }
            }
            if (index < items.size) Spacer(Modifier.height(SpaceStandard))
        }
    }
}

@Composable
private fun GridCard(
    modifier: Modifier = Modifier,
    icon: ImageVector,
    label: String,
    iconSize: Dp = 72.dp,
    height: Dp = 240.dp,
    onClick: () -> Unit,
) {
    Card(
        modifier = modifier
            .height(height)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(GridCardRadius),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(SpaceStandard),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(iconSize),
                tint = MaterialTheme.colorScheme.primary,
            )
            Spacer(Modifier.height(SpaceMicro))
            Text(
                text = label,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface,
            )
        }
    }
}

private fun greetingForHour(): String {
    val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
    return when {
        hour < 12 -> "Good Morning"
        hour < 17 -> "Good Afternoon"
        else -> "Good Evening"
    }
}
