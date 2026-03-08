package com.farmtopalm.terminal.ui

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.farmtopalm.terminal.data.crypto.Crypto
import com.farmtopalm.terminal.data.db.AppDatabase
import com.farmtopalm.terminal.di.AppModule
import com.farmtopalm.terminal.nfc.NfcManager
import com.farmtopalm.terminal.nfc.NfcParser
import com.farmtopalm.terminal.provisioning.ProvisioningManager
import com.farmtopalm.terminal.sync.SyncScheduler
import com.farmtopalm.terminal.ui.components.VendorSdkBanner
import com.farmtopalm.terminal.util.Logger
import com.farmtopalm.terminal.ui.screens.*
import com.farmtopalm.terminal.ui.theme.FarmToPalmTheme
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.UUID

class MainActivity : ComponentActivity() {

    private lateinit var provisioningManager: ProvisioningManager
    private lateinit var nfcManager: NfcManager
    private val nfcUidState = mutableStateOf<String?>(null)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        provisioningManager = ProvisioningManager(this)
        nfcManager = NfcManager(this)
        setContent {
            FarmToPalmTheme {
                Surface(Modifier.fillMaxSize()) {
                    val ctx = LocalContext.current
                    val db = AppDatabase.getInstance(ctx)
                    val studentRepo = remember { AppModule.studentRepo(ctx) }
                    val eventRepo = remember { AppModule.eventRepo(ctx) }
                    val terminalRepo = remember { AppModule.terminalRepo(ctx) }
                    val palmManager = remember { AppModule.palmBiometricManager(ctx) }
                    val securePrefs = remember { mutableStateOf<android.content.SharedPreferences?>(null) }
                    val fallbackPrefs = remember { ctx.getSharedPreferences("farmtopalm_secure_plain", android.content.Context.MODE_PRIVATE) }
                    val prefs = securePrefs.value ?: fallbackPrefs
                    LaunchedEffect(Unit) {
                        withContext(Dispatchers.IO) {
                            val p = Crypto.prefs(ctx)
                            securePrefs.value = p
                            p.edit().putLong("boot_ok", System.currentTimeMillis()).apply()
                        }
                    }
                    var mealRequiresPalm by remember { mutableStateOf(false) }
                    LaunchedEffect(prefs) {
                        mealRequiresPalm = prefs.getBoolean("meal_requires_palm", false)
                    }
                    var route by remember { mutableStateOf("") }
                    var showPinDialog by remember { mutableStateOf(false) }
                    var pinVerified by remember { mutableStateOf(false) }
                    var nfcUid by remember { nfcUidState }
                    val scope = rememberCoroutineScope()
                    val config = remember { mutableStateOf<com.farmtopalm.terminal.data.db.entities.TerminalConfigEntity?>(null) }
                    LaunchedEffect(Unit) { config.value = terminalRepo.getConfig() }
                    val todayStart = java.util.Calendar.getInstance().apply { set(java.util.Calendar.HOUR_OF_DAY, 0); set(java.util.Calendar.MINUTE, 0); set(java.util.Calendar.SECOND, 0); set(java.util.Calendar.MILLISECOND, 0) }.timeInMillis
                    val attendanceCount = remember { mutableStateOf(0) }
                    val mealCount = remember { mutableStateOf(0) }
                    LaunchedEffect(Unit) {
                        attendanceCount.value = db.attendanceEventDao().getUnsynced().size
                        mealCount.value = db.mealEventDao().getUnsynced().size
                    }
                    LaunchedEffect(Unit) {
                        palmManager.initialize()
                    }
                    Column(Modifier.fillMaxSize()) {
                        if (config.value != null) VendorSdkBanner()
                        when {
                        config.value == null -> ActivationScreen(
                            defaultBaseUrl = "http://192.168.1.128:3000",
                            onActivated = { route = "home"; scope.launch { config.value = terminalRepo.getConfig() } },
                            onOpenWifiSettings = { startActivity(Intent(Settings.ACTION_WIRELESS_SETTINGS)) },
                            onGoHome = { startActivity(Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME).setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) },
                            provisioningManager = provisioningManager
                        )
                        route.isEmpty() || route == "home" -> Scaffold(
                            modifier = Modifier.fillMaxSize(),
                            contentWindowInsets = WindowInsets(0, 0, 0, 0),
                        ) { paddingValues ->
                            HomeScreen(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(paddingValues)
                                    .padding(horizontal = 16.dp, vertical = 12.dp),
                                todayAttendanceCount = attendanceCount.value,
                                todayMealCount = mealCount.value,
                                onAttendance = { route = "attendance" },
                                onMeal = { route = "meal" },
                                onEnrollment = { showPinDialog = true; route = "enrollment" },
                                onStudents = { route = "students" },
                                onSyncStatus = { route = "sync" },
                                onDeviceStatus = { route = "device" },
                                onSettings = { route = "settings" },
                                onAttendanceList = { route = "attendance_list" },
                                onMealList = { route = "meal_list" }
                            )
                        }
                        route == "attendance" -> config.value?.let { c ->
                            AttendanceScreen(
                                palmManager = palmManager,
                                terminalId = c.terminalId,
                                schoolId = c.schoolId,
                                onRecordAttendance = { id, conf -> scope.launch { eventRepo.recordAttendance(id, c.terminalId, c.schoolId, conf); attendanceCount.value = db.attendanceEventDao().getUnsynced().size }; route = "home" },
                                onBack = { route = "home" }
                            )
                        } ?: run { route = "home" }
                        route == "meal" -> config.value?.let { c ->
                            MealScreen(
                                palmManager = palmManager,
                                nfcUid = nfcUid,
                                onNfcLookup = { uid -> kotlinx.coroutines.runBlocking { db.nfcCardDao().getByUid(uid)?.studentId } },
                                mealRequiresPalm = mealRequiresPalm,
                                terminalId = c.terminalId,
                                schoolId = c.schoolId,
                                onRecordMeal = { id, method -> scope.launch { eventRepo.recordMeal(id, c.terminalId, c.schoolId, method); mealCount.value = db.mealEventDao().getUnsynced().size }; route = "home" },
                                onBack = { route = "home" }
                            )
                        } ?: run { route = "home" }
                        route == "enrollment" -> if (pinVerified) EnrollmentScreen(
                            palmManager = palmManager,
                            adminPinVerified = true,
                            onRequestPin = { },
                            onSaveTemplate = { extId, studentName, hand, rgb, ir, quality, streamType, rgbModelHash, irModelHash, sdkTemplateId, onSaved ->
                                scope.launch {
                                    try {
                                        studentRepo.upsert(extId, studentName.ifBlank { "Student $extId" }, config.value!!.schoolId)
                                        val student = studentRepo.getByExternalId(extId)
                                        if (student == null) {
                                            kotlinx.coroutines.withContext(kotlinx.coroutines.Dispatchers.Main) { onSaved() }
                                            return@launch
                                        }
                                        val handNorm = hand.trim().lowercase()
                                        val encRgb = Crypto.encrypt(ctx, rgb)
                                        val encIr = Crypto.encrypt(ctx, ir)
                                        val templateId = "${student.id}_${handNorm}"
                                        Logger.d("PalmEnroll: saving template id=$templateId sdkTemplateId=$sdkTemplateId streamType=$streamType rgbSize=${rgb.size} irSize=${ir.size}")
                                        db.palmTemplateDao().insert(com.farmtopalm.terminal.data.db.entities.PalmTemplateEntity(
                                            templateId, student.id, handNorm, encRgb, encIr, quality, System.currentTimeMillis(),
                                            streamType = streamType, rgbModelHash = rgbModelHash, irModelHash = irModelHash, sdkTemplateId = sdkTemplateId
                                        ))
                                    } finally {
                                        kotlinx.coroutines.withContext(kotlinx.coroutines.Dispatchers.Main) { onSaved() }
                                    }
                                }
                            },
                            onBack = { route = "home"; pinVerified = false }
                        ) else {
                            if (showPinDialog) AdminPinDialog(onVerified = { pinVerified = true; showPinDialog = false }, onCancel = { showPinDialog = false; route = "home" }, prefs = prefs)
                            else route = "home"
                        }
                        route == "students" -> config.value?.let { c ->
                            var query by remember { mutableStateOf("") }
                            val students = remember(query, c.schoolId) { mutableStateOf<List<com.farmtopalm.terminal.data.db.entities.StudentEntity>>(emptyList()) }
                            LaunchedEffect(query, c.schoolId) { students.value = studentRepo.search(c.schoolId, query).first() }
                            StudentsScreen(schoolId = c.schoolId, students = students.value, searchQuery = query, onSearchChange = { query = it }, onBack = { route = "home" })
                        } ?: run { route = "home" }
                        route == "attendance_list" -> config.value?.let { c ->
                            val rows = remember { mutableStateOf<List<AttendanceRowUi>>(emptyList()) }
                            LaunchedEffect(c.schoolId) {
                                val events = eventRepo.getUnsyncedAttendance()
                                val fmt = java.text.SimpleDateFormat("HH:mm:ss", java.util.Locale.getDefault())
                                rows.value = events.map { e ->
                                    val student = studentRepo.getById(e.studentId)
                                    val label = student?.name ?: e.studentId
                                    AttendanceRowUi(
                                        studentLabel = label,
                                        timeLabel = fmt.format(java.util.Date(e.ts)),
                                        confidenceLabel = "Confidence: ${"%.2f".format(e.confidence)}"
                                    )
                                }
                            }
                            AttendanceListScreen(rows = rows.value, onBack = { route = "home" })
                        } ?: run { route = "home" }
                        route == "meal_list" -> config.value?.let { c ->
                            val rows = remember { mutableStateOf<List<MealRowUi>>(emptyList()) }
                            LaunchedEffect(c.schoolId) {
                                val events = eventRepo.getUnsyncedMeals()
                                val fmt = java.text.SimpleDateFormat("HH:mm:ss", java.util.Locale.getDefault())
                                rows.value = events.map { e ->
                                    val student = studentRepo.getById(e.studentId)
                                    val label = student?.name ?: e.studentId
                                    MealRowUi(
                                        studentLabel = label,
                                        timeLabel = fmt.format(java.util.Date(e.ts)),
                                        methodLabel = "Method: ${e.method}"
                                    )
                                }
                            }
                            MealListScreen(rows = rows.value, onBack = { route = "home" })
                        } ?: run { route = "home" }
                        route == "sync" -> config.value?.let { c ->
                            val unsyncedA = remember { mutableStateOf(0) }
                            val unsyncedM = remember { mutableStateOf(0) }
                            scope.launch { unsyncedA.value = eventRepo.getUnsyncedAttendance().size; unsyncedM.value = eventRepo.getUnsyncedMeals().size }
                            SyncStatusScreen(
                                unsyncedAttendance = unsyncedA.value,
                                unsyncedMeals = unsyncedM.value,
                                lastSyncTime = c.lastHeartbeatAt,
                                onSyncNow = { SyncScheduler.runNow(ctx) },
                                onBack = { route = "home" }
                            )
                        } ?: run { route = "home" }
                        route == "device" -> DeviceStatusScreen(palmStatus = palmManager.status(), onBack = { route = "home" })
                        route == "settings" -> SettingsScreen(
                            apiBaseUrl = config.value?.apiBaseUrl ?: "",
                            mealRequiresPalm = mealRequiresPalm,
                            onMealRequiresPalmChange = { mealRequiresPalm = it; prefs.edit().putBoolean("meal_requires_palm", it).apply() },
                            onAdminPinChange = { },
                            onBack = { route = "home" }
                        )
                    }
                    }
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        intent ?: return
        val tag = nfcManager.fromIntent(intent)
        if (tag != null) nfcUidState.value = NfcParser.getUid(tag)
    }
}
