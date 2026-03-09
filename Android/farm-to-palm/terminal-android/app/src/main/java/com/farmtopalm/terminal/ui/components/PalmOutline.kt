package com.farmtopalm.terminal.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Zone state for palm coverage visualization.
 * Gray = not captured, Orange = weak, Green = good.
 */
enum class PalmZoneState {
    NOT_CAPTURED,
    WEAK,
    GOOD
}

/**
 * Palm outline with 7 zones for guided enrollment.
 * Zones: upper-left, upper-right, thumb base, outer edge, lower-left, lower-right, center.
 */
@Composable
fun PalmOutline(
    modifier: Modifier = Modifier,
    size: Dp = 180.dp,
    zoneStates: Map<Int, PalmZoneState> = emptyMap(),
    strokeWidth: Float = 4f,
    baseColor: Color = Color.Gray,
    weakColor: Color = Color(0xFFFFA726.toInt()),
    goodColor: Color = Color(0xFF66BB6A.toInt())
) {
    Canvas(modifier = modifier.size(size)) {
        val w = size.toPx()
        val h = size.toPx()
        val cx = w / 2f
        val cy = h / 2f

        // Simplified palm shape: rounded rectangle as base
        val palmPath = Path().apply {
            moveTo(cx - w * 0.35f, cy - h * 0.2f)
            lineTo(cx + w * 0.35f, cy - h * 0.2f)
            lineTo(cx + w * 0.4f, cy + h * 0.25f)
            lineTo(cx, cy + h * 0.4f)
            lineTo(cx - w * 0.4f, cy + h * 0.25f)
            close()
        }

        // Draw zones as overlapping regions (simplified: we use a single palm + zone overlays)
        // Zone 0: center, 1: upper-left, 2: upper-right, 3: thumb, 4: outer, 5: lower-left, 6: lower-right
        val zonePaths = listOf(
            Path().apply { addOval(Rect(cx - w * 0.15f, cy - h * 0.1f, cx + w * 0.15f, cy + h * 0.15f)) },
            Path().apply { addOval(Rect(cx - w * 0.35f, cy - h * 0.2f, cx - w * 0.05f, cy + h * 0.05f)) },
            Path().apply { addOval(Rect(cx + w * 0.05f, cy - h * 0.2f, cx + w * 0.35f, cy + h * 0.05f)) },
            Path().apply { addOval(Rect(cx - w * 0.4f, cy - h * 0.05f, cx - w * 0.15f, cy + h * 0.3f)) },
            Path().apply { addOval(Rect(cx + w * 0.15f, cy - h * 0.05f, cx + w * 0.4f, cy + h * 0.3f)) },
            Path().apply { addOval(Rect(cx - w * 0.3f, cy + h * 0.1f, cx, cy + h * 0.4f)) },
            Path().apply { addOval(Rect(cx, cy + h * 0.1f, cx + w * 0.3f, cy + h * 0.4f)) }
        )

        // Draw base palm outline
        drawPath(palmPath, color = baseColor, style = Stroke(width = strokeWidth))

        // Draw zone fills based on state
        zonePaths.forEachIndexed { idx, path ->
            val state = zoneStates[idx] ?: PalmZoneState.NOT_CAPTURED
            val color = when (state) {
                PalmZoneState.NOT_CAPTURED -> baseColor.copy(alpha = 0.3f)
                PalmZoneState.WEAK -> weakColor.copy(alpha = 0.5f)
                PalmZoneState.GOOD -> goodColor.copy(alpha = 0.6f)
            }
            drawPath(path, color = color)
        }
    }
}
