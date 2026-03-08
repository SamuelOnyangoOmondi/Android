package com.farmtopalm.terminal.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.farmtopalm.terminal.biometric.PalmSdkBridge

/**
 * Shows a clear banner when the vendor palm SDK is not installed so the app fails loudly
 * instead of silently using mock. Shown when [PalmSdkBridge.isUsingRealSdk] is false.
 */
@Composable
fun VendorSdkBanner(
    modifier: Modifier = Modifier
) {
    if (PalmSdkBridge.isUsingRealSdk) return

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.errorContainer)
            .padding(12.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Text(
            text = "Vendor SDK not installed",
            style = MaterialTheme.typography.titleSmall,
            color = MaterialTheme.colorScheme.onErrorContainer
        )
        Text(
            text = "Palm scan will use mock data. Run: ./scripts/install_vendor_sdk.sh /path/to/palm-android-sdk-v1.3.14-L.zip",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onErrorContainer
        )
    }
}
