package com.farmtopalm.terminal.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.farmtopalm.terminal.biometric.PalmGuidanceHelper
import com.farmtopalm.terminal.ui.components.PalmOutline
import com.farmtopalm.terminal.ui.components.PalmZoneState

/** Minimum quality (0-100) to accept a capture. */
const val GUIDED_ENROLL_MIN_QUALITY = 55

/** Number of guided capture positions. */
const val GUIDED_CAPTURE_COUNT = 3

/**
 * State for guided multi-position enrollment.
 */
data class GuidedEnrollmentState(
    val currentStep: Int = 0,
    val zoneStates: Map<Int, PalmZoneState> = emptyMap(),
    val liveHint: String? = null,
    val bestCapture: GuidedCapture? = null,
    val isCapturing: Boolean = false,
    val error: String? = null
)

data class GuidedCapture(
    val rgb: ByteArray,
    val ir: ByteArray,
    val quality: Int,
    val streamType: String?,
    val rgbModelHash: String?,
    val irModelHash: String?,
    val sdkTemplateId: String?
) {
    override fun equals(other: Any?): Boolean = this === other || (other is GuidedCapture &&
            rgb.contentEquals(other.rgb) && ir.contentEquals(other.ir) && quality == other.quality)
    override fun hashCode(): Int = rgb.hashCode() xor ir.hashCode() xor quality
}

/**
 * Composable that shows the guided palm enrollment UI during capture.
 * Displays palm outline with zone progress, live hints, and step instructions.
 */
@Composable
fun GuidedEnrollmentOverlay(
    state: GuidedEnrollmentState,
    hand: String,
    modifier: Modifier = Modifier
) {
    val instruction = PalmGuidanceHelper.ZONE_INSTRUCTIONS.getOrElse(state.currentStep) {
        PalmGuidanceHelper.DEFAULT_PLACE_PALM
    }
    val hintMessage = state.liveHint?.let { PalmGuidanceHelper.hintToMessage(it) } ?: instruction

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                "Enroll ${hand.replaceFirstChar { it.uppercase() }} hand",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.primary
            )
            Spacer(Modifier.height(16.dp))

            PalmOutline(
                size = 160.dp,
                zoneStates = state.zoneStates,
                baseColor = MaterialTheme.colorScheme.outline,
                weakColor = MaterialTheme.colorScheme.tertiary,
                goodColor = MaterialTheme.colorScheme.primary
            )

            Spacer(Modifier.height(16.dp))

            Text(
                if (state.isCapturing) hintMessage else instruction,
                style = MaterialTheme.typography.bodyLarge,
                color = if (state.isCapturing) MaterialTheme.colorScheme.primary
                else MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(Modifier.height(8.dp))

            LinearProgressIndicator(
                progress = { (state.currentStep + 1).toFloat() / GUIDED_CAPTURE_COUNT },
                modifier = Modifier.fillMaxWidth().height(6.dp),
                color = MaterialTheme.colorScheme.primary,
                trackColor = MaterialTheme.colorScheme.surfaceVariant
            )
            Text(
                "Step ${state.currentStep + 1} of $GUIDED_CAPTURE_COUNT",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            state.bestCapture?.let { best ->
                Spacer(Modifier.height(8.dp))
                Text(
                    "Best quality: ${best.quality}%",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            state.error?.let { err ->
                Spacer(Modifier.height(8.dp))
                Text(
                    err,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.error
                )
            }
        }
    }
}
