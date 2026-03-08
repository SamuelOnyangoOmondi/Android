# SYSTEM AUDIT REPORT — Android (Farm-to-Feed Device) App

**Date:** 2025-03-07  
**Scope:** Physical device app and its backend under `android/`. No code changes; analysis only.  
**Purpose:** Map schema, flows, and integration points so Android device data can feed SupaSchool.

---

## 1. Executive Summary

- The **Android app** lives under `android/farm-to-palm/terminal-android/`. It is the **Farm-to-Feed physical device** app (Kotlin, Jetpack Compose, Room, palm biometrics, NFC). It captures **attendance** (palm scan) and **meals** (palm or NFC), stores them in a **local Room DB**, and syncs to a **Node/Fastify backend** via REST.
- The **backend** lives under `android/farm-to-palm/backend/`. It uses **PostgreSQL (Knex)** and exposes the API the device expects: `/v1/terminals/activate`, `/v1/events/attendance/bulk`, `/v1/events/meals/bulk`, plus reports and dashboard auth. It has **its own schema** (schools, terminals, students, attendance_events, meal_events), **not** Supabase or the same schema as SupaSchool.
- **SupaSchool** uses **Supabase** with `attendance_records` and `meal_records` (date-based, status, source, device_id). So today there are **two separate data stores**: backend PostgreSQL (device events) and SupaSchool Supabase (school dashboard). Integration requires the backend to **also write** (or sync) into the **shared Supabase** so SupaSchool can read device-originated data.
- **Key finding:** The device does not talk to Supabase. It talks only to the backend. The backend must be the **bridge** that writes to Supabase when it receives device bulk events.

---

## 2. Tech Stack — Android App

| Item | Detail |
|------|--------|
| **Location** | `android/farm-to-palm/terminal-android/` |
| **Language** | Kotlin |
| **Build** | Gradle (Android application) |
| **Min/Target SDK** | 26 / 34 |
| **UI** | Jetpack Compose, Material 3 |
| **Local DB** | Room 2.6 (SQLite) |
| **Network** | OkHttp (sync, provisioning) |
| **Auth** | Bearer token from activation; stored encrypted (Security Crypto) |
| **Sync** | WorkManager (periodic 15 min + run now) |
| **Biometrics** | Palm (PalmBiometricManager; vendor SDK via libs) |
| **NFC** | NfcManager, NfcParser (meal path) |
| **Package** | `com.farmtopalm.terminal` |

**Evidence:** `android/farm-to-palm/terminal-android/app/build.gradle`, `AppDatabase.kt`, `ApiClient.kt`, `SyncWorker.kt`, `ProvisioningManager.kt`, `MainActivity.kt`.

---

## 3. Folder Architecture — Android App

```
android/farm-to-palm/terminal-android/
├── app/
│   ├── build.gradle
│   └── src/main/java/com/farmtopalm/terminal/
│       ├── biometric/          # PalmBiometricManager, IdentifyResult, PalmBiometricError
│       ├── data/
│       │   ├── crypto/          # Crypto (encrypt token, prefs)
│       │   ├── db/
│       │   │   ├── entities/    # AttendanceEventEntity, MealEventEntity, StudentEntity, PalmTemplateEntity, NfcCardEntity, TerminalConfigEntity
│       │   │   ├── dao/         # AttendanceEventDao, MealEventDao, StudentDao, ...
│       │   │   └── AppDatabase.kt
│       │   └── repo/            # EventRepo, StudentRepo, TerminalRepo
│       ├── di/                  # AppModule (repos, palm manager)
│       ├── nfc/                 # NfcManager, NfcParser
│       ├── palm/                # PalmModelsInstaller
│       ├── provisioning/        # ProvisioningManager (activate, ping health)
│       ├── sync/                # ApiClient, SyncWorker, SyncScheduler
│       ├── ui/
│       │   ├── screens/         # HomeScreen, AttendanceScreen, MealScreen, StudentsScreen, EnrollmentScreen, SyncStatusScreen, ...
│       │   ├── components/      # VendorSdkBanner, AdminPinGate
│       │   └── theme/
│       └── util/                # Result, Logger
└── libs/                       # Vendor SDK (jar/aar)
```

---

## 4. Entity Inventory — Android App

| Entity | Where | Storage | Purpose |
|--------|--------|---------|---------|
| **StudentEntity** | data/db/entities/StudentEntity.kt | Room `students` | Local cache: id, externalId, name, schoolId. externalId = server student id. |
| **AttendanceEventEntity** | data/db/entities/AttendanceEventEntity.kt | Room `attendance_events` | id, studentId, terminalId, schoolId, ts (epoch ms), confidence, synced, createdAt. |
| **MealEventEntity** | data/db/entities/MealEventEntity.kt | Room `meal_events` | id, studentId, terminalId, schoolId, ts, method (nfc/palm/nfc_palm), synced, createdAt. |
| **TerminalConfigEntity** | data/db/entities/TerminalConfigEntity.kt | Room `terminal_config` | terminalId, schoolId, apiBaseUrl, tokenEnc, activatedAt, lastHeartbeatAt. |
| **PalmTemplateEntity** | data/db/entities/PalmTemplateEntity.kt | Room `palm_templates` | Palm templates per student/hand for identify. |
| **NfcCardEntity** | data/db/entities/NfcCardEntity.kt | Room `nfc_cards` | uid → studentId for meal NFC path. |

---

## 5. Local Database Schema (Room)

**Source:** `AppDatabase.kt`, entity files, migration in AppDatabase.

| Table | Columns | PK | Notes |
|-------|----------|-----|------|
| **students** | id, externalId, name, schoolId, createdAt, updatedAt | id | externalId = server-side student id. |
| **attendance_events** | id, studentId, terminalId, schoolId, ts, confidence, synced, createdAt | id | Indices: synced, terminalId, ts. |
| **meal_events** | id, studentId, terminalId, schoolId, ts, method, synced, createdAt | id | Indices: synced, terminalId, ts. |
| **terminal_config** | id (=1), terminalId, schoolId, apiBaseUrl, tokenEnc, activatedAt, lastHeartbeatAt | id | Single row. |
| **palm_templates** | id, studentId, hand, rgbFeatureEnc, irFeatureEnc, quality, createdAt, streamType, rgbModelHash, irModelHash, sdkTemplateId | id | FK students. |
| **nfc_cards** | id, studentId, uid, createdAt | id | FK students; index on uid. |

---

## 6. Backend (Node/Fastify) — Overview

| Item | Detail |
|------|--------|
| **Location** | `android/farm-to-palm/backend/` |
| **Runtime** | Node.js |
| **Framework** | Fastify |
| **DB** | PostgreSQL via Knex (env: DATABASE_URL) |
| **Auth** | JWT for dashboard; terminal token for device (from activate). |

**Key routes (device):**

- `POST /v1/terminals/activate` — body: activationCode, deviceMeta. Returns terminalId, schoolId, apiBaseUrl, token.
- `POST /v1/events/attendance/bulk` — Bearer terminal token. Body: { events: [{ eventId, externalId?, studentId?, terminalId, schoolId, ts, confidence }] }.
- `POST /v1/events/meals/bulk` — Bearer terminal token. Body: { events: [{ eventId, externalId?, studentId?, terminalId, schoolId, ts, method }] }.

**Evidence:** `backend/src/index.ts`, `backend/src/modules/events/attendance.ts`, `meals.ts`, `backend/src/modules/terminals/activate.ts`, `backend/src/shared/validation/schemas.ts`.

---

## 7. Backend Database Schema (PostgreSQL)

**Source:** `backend/src/db/migrations/20250215000001_init.cjs`.

| Table | Columns | Purpose |
|-------|---------|--------|
| **schools** | id (uuid), name, timestamps | Schools. |
| **terminals** | id, school_id, activation_code, token_hash, device_meta, last_heartbeat_at, timestamps | Device activation. |
| **students** | id (uuid), school_id, external_id, name, timestamps | UNIQUE(school_id, external_id). external_id used by device. |
| **attendance_events** | id (string PK), student_id, terminal_id, school_id, ts (bigint), confidence, timestamps | Device attendance events. |
| **meal_events** | id (string PK), student_id, terminal_id, school_id, ts (bigint), method, timestamps | Device meal events. |
| **palm_templates**, **nfc_cards**, **users**, **terminal_heartbeats** | (see migration) | Biometrics, NFC, dashboard auth, heartbeat. |

---

## 8. Attendance Flow (End-to-End)

| Step | Where | What |
|------|--------|------|
| 1 | ActivationScreen | User enters base URL and activation code; POST /v1/terminals/activate → terminalId, schoolId, apiBaseUrl, token stored in terminal_config. |
| 2 | HomeScreen | User taps "Scan Attendance" → route = attendance. |
| 3 | AttendanceScreen | Palm scanner opened; user taps "Scan Palm" → captureForIdentify → identify → Matched(studentId, confidence). |
| 4 | MainActivity | onRecordAttendance(studentId, confidence) → eventRepo.recordAttendance(studentId, terminalId, schoolId, confidence). |
| 5 | EventRepo | UUID event id, now = System.currentTimeMillis(); insert AttendanceEventEntity(id, studentId, terminalId, schoolId, ts=now, confidence, synced=false, createdAt=now). |
| 6 | SyncWorker | Periodic or run-now. getUnsyncedAttendance(); for each event, externalId = studentDao.getById(studentId)?.externalId; postAttendanceBulk(events, externalIdByStudentId). |
| 7 | ApiClient | POST baseUrl + "/v1/events/attendance/bulk", body: { events: [{ eventId, externalId, terminalId, schoolId, ts, confidence }] }, Bearer token. |
| 8 | Backend | terminalAuth; parse body; for each event resolve externalId → student_id (backend students table); insert into backend attendance_events (id, student_id, terminal_id, school_id, ts, confidence). onConflict('id').ignore(). |
| 9 | SyncWorker | On success, markAttendanceSynced(ids). |

**Summary:** Attendance is **event-based** (one row per palm scan at time `ts`). There is no explicit "present/absent/late" — a scan implies present. The backend stores events in its own `attendance_events` table; **SupaSchool expects one row per (student_id, attendance_date) with status**. So integration needs a **mapping**: many device events per day → one attendance_record per student per date (e.g. status = 'present', date = date(ts)).

---

## 9. Meal Flow (End-to-End)

| Step | Where | What |
|------|--------|------|
| 1 | HomeScreen | User taps "Record Meal" → route = meal. |
| 2 | MealScreen | NFC path: nfcUid → onNfcLookup(uid) = nfcCardDao.getByUid(uid)?.studentId → onRecordMeal(studentId, "nfc" or "nfc_palm"). Palm path: same as attendance → onRecordMeal(studentId, "palm"). |
| 3 | EventRepo | recordMeal(studentId, terminalId, schoolId, method) → insert MealEventEntity(id, studentId, terminalId, schoolId, ts=now, method, synced=false, createdAt=now). |
| 4 | SyncWorker | getUnsyncedMeals(); externalId from studentDao; postMealsBulk(events, externalIdByStudentId). |
| 5 | ApiClient | POST /v1/events/meals/bulk, body: { events: [{ eventId, externalId, terminalId, schoolId, ts, method }] }. |
| 6 | Backend | Resolve externalId → student_id; insert into meal_events. |

**Summary:** Meal is event-based (one row per serve at time `ts`). Method is nfc | palm | nfc_palm. **SupaSchool meal_records** are one row per (student_id, meal_date, meal_type) with breakfast/lunch/supper/snack. So integration needs **meal_date = date(ts)** and a **meal_type** (e.g. default "lunch" or from config/session).

---

## 10. Student Identity and externalId

- On the **device**, students are stored in Room with **id** (local UUID) and **externalId** (string). Enrollment and any sync from server set externalId; SyncWorker sends **externalId** in bulk payloads so the backend can resolve to its **students.id** (uuid).
- For **SupaSchool integration**, the shared schema uses **students.id** (uuid) in attendance_records and meal_records. So **externalId** on the device must ultimately represent the **SupaSchool student id** (uuid) once students are synced from SupaSchool (or the backend uses the same student ids). Today the backend has its own students table; integration will require either (a) backend students aligned with SupaSchool (same ids or mapping), or (b) backend resolving externalId and then writing to Supabase with that id.

---

## 11. API Contract (Device → Backend)

**POST /v1/events/attendance/bulk**  
- Headers: `Authorization: Bearer <token>`.  
- Body: `{ events: [{ eventId (uuid), externalId?, studentId?, terminalId, schoolId, ts (ms), confidence (0–1) }] }`.  
- Backend: Resolves externalId/studentId to student_id; inserts into attendance_events; onConflict('id').ignore().

**POST /v1/events/meals/bulk**  
- Headers: `Authorization: Bearer <token>`.  
- Body: `{ events: [{ eventId (uuid), externalId?, studentId?, terminalId, schoolId, ts (ms), method: 'nfc'|'palm'|'nfc_palm' }] }`.  
- Backend: Same resolve; inserts into meal_events; onConflict('id').ignore().

---

## 12. Relationship Map (Android + Backend)

```
Backend PostgreSQL:
  schools
    ├── terminals (activation_code, token, school_id)
    ├── students (external_id, name, school_id)
    │     ├── palm_templates (backend stores if needed)
    │     └── nfc_cards
    ├── attendance_events (student_id, terminal_id, school_id, ts, confidence)
    └── meal_events (student_id, terminal_id, school_id, ts, method)

Device Room:
  terminal_config (1 row: terminalId, schoolId, apiBaseUrl, tokenEnc)
  students (id, externalId, name, schoolId)  ← cache; externalId = server student id
  attendance_events (synced to backend)
  meal_events (synced to backend)
  palm_templates, nfc_cards (local only)
```

---

## 13. SupaSchool vs Backend Schema (Relevant Tables)

| Concept | Backend (device) | SupaSchool (Supabase) |
|---------|-------------------|------------------------|
| **Attendance** | attendance_events: id, student_id, terminal_id, school_id, ts, confidence | attendance_records: student_id, school_id, class_id?, attendance_date (date), status (present/absent/late/excused), source, device_id, recorded_by, notes |
| **Meals** | meal_events: id, student_id, terminal_id, school_id, ts, method | meal_records: student_id, school_id, class_id?, meal_date (date), meal_type (breakfast/lunch/supper/snack), served, quantity, source, device_id |
| **Students** | students: id, school_id, external_id, name | students: id, school_id, class_id, admission_number, first_name, last_name, ... |
| **School** | schools: id, name | schools: id, name, ... (many columns) |

**Gaps for integration:**  
- Backend uses **ts** (epoch ms); SupaSchool uses **attendance_date** / **meal_date** (date).  
- Backend has no **status** (device implies present); SupaSchool has status enum.  
- Backend has **method** (nfc/palm); SupaSchool has **meal_type** (breakfast/lunch/supper/snack).  
- Backend has **terminal_id** (string); SupaSchool has **device_id** (uuid, optional FK device_registrations).  
- **source** and **recorded_by** exist only in SupaSchool; must be set when writing from backend (e.g. source = 'farm_to_feed').

---

## 14. CRUD Matrix (Device + Backend)

| Entity | Create | Read | Update | Delete | Where |
|--------|--------|------|--------|--------|--------|
| **Device: attendance_events** | EventRepo.recordAttendance; AttendanceScreen → palm match | SyncWorker getUnsynced | markSynced after sync | — | Room |
| **Device: meal_events** | EventRepo.recordMeal; MealScreen (palm/NFC) | SyncWorker getUnsynced | markSynced | — | Room |
| **Device: students** | EnrollmentScreen upsert; sync from server if implemented | StudentRepo.observeBySchool, search, getById, getByExternalId | upsert | StudentRepo.delete | Room |
| **Backend: attendance_events** | POST /v1/events/attendance/bulk | reports, exports | — | — | Knex |
| **Backend: meal_events** | POST /v1/events/meals/bulk | reports, exports | — | — | Knex |
| **Backend: students** | POST /v1/students (terminal) | resolve by external_id in bulk handlers | — | — | Knex |

---

## 15. Mock vs Real Data

- **Device:** All persistence is real (Room). Palm identify can be mock (PalmBiometricManagerImpl) or vendor SDK per build config.  
- **Backend:** Uses real PostgreSQL. No mock layer in the handlers.  
- **Dashboard:** `android/farm-to-palm/dashboard/` uses backend `/v1/reports/*` and `/v1/auth/login`; data is real if backend DB is populated.

---

## 16. Integration Readiness

| Area | Score | Evidence |
|------|-------|----------|
| **Device capture** | 9/10 | Attendance and meal recorded locally and synced to backend via bulk API. |
| **Backend API** | 9/10 | Bulk endpoints and activation exist; validation and DB writes in place. |
| **Backend → SupaSchool** | 0/10 | Backend does not write to Supabase; separate DB and schema. |
| **Student id alignment** | 5/10 | Backend students have external_id; SupaSchool students have id (uuid). externalId on device must match SupaSchool student id for shared writes. |
| **Schema alignment** | 3/10 | Event-based (ts) vs date-based (attendance_date, meal_date); need mapping and default status/meal_type. |

---

## 17. File Reference Summary

| Area | Files |
|------|--------|
| **Device entities** | `terminal-android/.../entities/AttendanceEventEntity.kt`, `MealEventEntity.kt`, `StudentEntity.kt`, `TerminalConfigEntity.kt` |
| **Device sync** | `ApiClient.kt`, `SyncWorker.kt`, `SyncScheduler.kt`, `EventRepo.kt` |
| **Device UI** | `AttendanceScreen.kt`, `MealScreen.kt`, `HomeScreen.kt`, `MainActivity.kt` |
| **Provisioning** | `ProvisioningManager.kt`, `ActivationScreen.kt` |
| **Backend bulk** | `backend/src/modules/events/attendance.ts`, `meals.ts` |
| **Backend schema** | `backend/src/db/migrations/20250215000001_init.cjs` |
| **Backend validation** | `backend/src/shared/validation/schemas.ts` |

---

*End of Android system audit. Use this for Phase 2 (integration design) and Phase 3 (implementation) so the device flow feeds SupaSchool.*
