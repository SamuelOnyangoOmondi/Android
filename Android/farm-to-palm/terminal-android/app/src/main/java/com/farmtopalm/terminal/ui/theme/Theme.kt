package com.farmtopalm.terminal.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// ——— Light mode (design system) ———
private val BackgroundLight = Color(0xFFF8FAFC)
private val PrimaryLight = Color(0xFF2563EB)
private val PrimaryHoverLight = Color(0xFF1D4ED8)
private val SuccessLight = Color(0xFF16A34A)
private val WarningLight = Color(0xFFF59E0B)
private val ErrorLight = Color(0xFFDC2626)
private val CardBackgroundLight = Color(0xFFFFFFFF)
private val BorderLight = Color(0xFFE2E8F0)
private val PrimaryTextLight = Color(0xFF0F172A)
private val SecondaryTextLight = Color(0xFF64748B)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryLight,
    onPrimary = Color.White,
    primaryContainer = PrimaryLight.copy(alpha = 0.12f),
    surface = CardBackgroundLight,
    surfaceVariant = BackgroundLight,
    onSurface = PrimaryTextLight,
    onSurfaceVariant = SecondaryTextLight,
    outline = BorderLight,
    error = ErrorLight,
    onError = Color.White,
    tertiary = SuccessLight,
    outlineVariant = BorderLight.copy(alpha = 0.5f),
    background = BackgroundLight,
    onBackground = PrimaryTextLight,
)

// ——— Dark mode ———
private val BackgroundDark = Color(0xFF0F172A)
private val CardDark = Color(0xFF1E293B)
private val PrimaryDark = Color(0xFF3B82F6)
private val TextDark = Color(0xFFF8FAFC)

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryDark,
    onPrimary = Color.White,
    surface = CardDark,
    onSurface = TextDark,
    surfaceVariant = CardDark.copy(alpha = 0.8f),
    onSurfaceVariant = TextDark.copy(alpha = 0.8f),
    outline = TextDark.copy(alpha = 0.3f),
    error = ErrorLight,
    background = BackgroundDark,
    onBackground = TextDark,
)

// ——— Typography: extra large kiosk (greeting 56sp, section 34sp, stat 72sp, button 34sp, small 22sp) ———
private val InterFallback = FontFamily.Default

private val FarmToPalmTypography = Typography(
    headlineMedium = TextStyle(
        fontFamily = InterFallback,
        fontSize = 56.sp,
        fontWeight = FontWeight.SemiBold,
    ),
    titleMedium = TextStyle(
        fontFamily = InterFallback,
        fontSize = 34.sp,
        fontWeight = FontWeight.Medium,
    ),
    titleLarge = TextStyle(
        fontFamily = InterFallback,
        fontSize = 36.sp,
        fontWeight = FontWeight.Medium,
    ),
    headlineLarge = TextStyle(
        fontFamily = InterFallback,
        fontSize = 72.sp,
        fontWeight = FontWeight.Bold,
    ),
    headlineSmall = TextStyle(
        fontFamily = InterFallback,
        fontSize = 64.sp,
        fontWeight = FontWeight.Bold,
    ),
    labelLarge = TextStyle(
        fontFamily = InterFallback,
        fontSize = 34.sp,
        fontWeight = FontWeight.Medium,
    ),
    labelMedium = TextStyle(
        fontFamily = InterFallback,
        fontSize = 28.sp,
        fontWeight = FontWeight.Medium,
    ),
    bodySmall = TextStyle(
        fontFamily = InterFallback,
        fontSize = 22.sp,
        fontWeight = FontWeight.Normal,
    ),
    bodyMedium = TextStyle(
        fontFamily = InterFallback,
        fontSize = 28.sp,
        fontWeight = FontWeight.Normal,
    ),
    bodyLarge = TextStyle(
        fontFamily = InterFallback,
        fontSize = 30.sp,
        fontWeight = FontWeight.Normal,
    ),
    labelSmall = TextStyle(
        fontFamily = InterFallback,
        fontSize = 22.sp,
        fontWeight = FontWeight.Medium,
    ),
    displayLarge = TextStyle(fontFamily = InterFallback, fontSize = 80.sp, fontWeight = FontWeight.Bold),
    displayMedium = TextStyle(fontFamily = InterFallback, fontSize = 72.sp, fontWeight = FontWeight.Bold),
    displaySmall = TextStyle(fontFamily = InterFallback, fontSize = 64.sp, fontWeight = FontWeight.Bold),
)

@Composable
fun FarmToPalmTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme,
        typography = FarmToPalmTypography,
        content = content,
    )
}
