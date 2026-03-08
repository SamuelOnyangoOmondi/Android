# PHASE 2 — ANDROID (DEVICE) INTEGRATION DESIGN

**Date:** 2025-03-07  
**Baseline:** SYSTEM_AUDIT_REPORT_ANDROID.md  
**Scope:** Attendance and meal data from the **physical Android device** (farm-to-palm terminal) flowing into **SupaSchool** via the existing backend as bridge. One canonical data model in SupaSchool’s Supabase.  
**Constraint:** Design only; implementation in Phase 3.

---

## 1. Final Architecture Decision

**Recommendation: Backend dual-write to Supabase (API bridge variant)**

- **Android device** → unchanged: continues to POST to the existing backend at `POST /v1/events/attendance/bulk` and `POST /v1/events/meals/bulk` with Bearer token from activation.
- **Backend** → **dual-write**: (1) Keep writing to its own PostgreSQL (`attendance_events`, `meal_events`) for the existing farm-to-palm dashboard and reports. (2) **Also** write to **SupaSchool’s Supabase** into `attendance_records` and `meal_records` with the canonical schema, so SupaSchool can read device-originated data.
- **SupaSchool** → unchanged: continues to read from its Supabase; no new API. Device data appears as rows with `source = 'farm_to_feed'` and optional `device_id`.

**Why this option**

- **Device unchanged:** No change to the Android app or its API contract; activation and sync stay as-is.
- **Single bridge:** The backend is the only place that needs to know both schemas; it maps device event payloads to SupaSchool’s date-based, status/meal_type model.
- **Reuse:** SupaSchool already has services and UI for `source` and `device_id`; no change to SupaSchool read path for MVP.
- **Operational:** Backend already has terminal auth and student resolution; adding a Supabase client and one upsert path per bulk handler is contained.

**Alternatives not chosen**

- **Device → Supabase directly:** Would require adding Supabase SDK and auth on the device, and either changing how activation works or using anon key with RLS; higher change surface and key management on devices.
- **Sync job (backend DB → Supabase):** Adds delay and a separate process; dual-write at request time is simpler and immediate.

---

## 2. Canonical Shared Supabase Schema (SupaSchool Baseline)

Same as in the existing Phase 2 design for the web Farm-to-Feed. Only the tables relevant to the **backend bridge** are listed here.

| Table | Purpose | Written by backend bridge |
|-------|---------|---------------------------|
| **attendance_records** | One row per (student, date) with status | Yes: upsert from device bulk events |
| **meal_records** | One row per (student, date, meal_type) | Yes: upsert from device bulk events |
| **schools** | Master list | No (read-only; must exist) |
| **students** | Master list; id used in records | No (read-only; externalId must match students.id or admission_number resolution) |

**attendance_records (relevant columns)**  
- Required for bridge: `student_id`, `school_id`, `attendance_date` (date), `status` (e.g. `'present'`), `source` = `'farm_to_feed'`, `device_id` (optional; terminal id or uuid).  
- Optional: `class_id`, `recorded_by`, `notes`.  
- Uniqueness: one row per (student_id, attendance_date) per source/device; upsert key (student_id, attendance_date) or (student_id, attendance_date, source).

**meal_records (relevant columns)**  
- Required for bridge: `student_id`, `school_id`, `meal_date` (date), `meal_type` (e.g. `'lunch'`), `served` (boolean), `source` = `'farm_to_feed'`, `device_id` (optional).  
- Optional: `class_id`, `quantity`, `recorded_by`, `notes`.  
- Uniqueness: per (student_id, meal_date, meal_type); upsert key as per existing SupaSchool design.

---

## 3. Required Schema / Config (Backend and SupaSchool)

- **SupaSchool:** No schema change required; `attendance_records` and `meal_records` already have `source` and `device_id`. Ensure unique constraint allows one row per (student_id, attendance_date) for upsert (and similarly for meals).
- **Backend:** No change to its PostgreSQL schema. Add **env** for Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (or anon key with RLS allowing insert; service role preferred so backend can write without RLS blocking).

---

## 4. Student Identity and externalId

- Device sends **externalId** in each event (from local StudentEntity.externalId). Backend currently resolves externalId to its own **students.id** (uuid) in its DB.
- For SupaSchool writes, **student_id** in `attendance_records` and `meal_records` must be the **SupaSchool students.id** (uuid).
- **MVP options:**  
  - **A:** Backend’s `students` table is populated from SupaSchool (sync or manual), and **external_id** on the backend equals **SupaSchool students.id** (uuid). Then the same id is used for Supabase writes.  
  - **B:** Backend stores a mapping (e.g. backend student id → SupaSchool student id) and uses that when writing to Supabase.  
  - **C:** Device is configured so **externalId** is the SupaSchool **students.id** (e.g. student list on device comes from SupaSchool). Backend then uses externalId directly as student_id for Supabase.  
- **Recommendation for MVP:** Prefer **A** or **C**: ensure **externalId** in the payload is the SupaSchool **students.id**. Backend uses it as-is for Supabase; no mapping table. If the backend currently stores its own uuid for students, align so that when a student is created/synced, external_id = SupaSchool student id (uuid). Document this in deployment/setup.

---

## 5. Mapping: Device Events → SupaSchool Rows

### Attendance

| Device / backend field | SupaSchool attendance_records |
|------------------------|-------------------------------|
| eventId | Not stored (idempotency via student_id + attendance_date) |
| externalId → student_id | student_id (uuid) |
| schoolId | school_id |
| terminalId | device_id (string; or uuid if device_registrations used) |
| ts (epoch ms) | attendance_date = date(ts) in server timezone or UTC |
| — | status = `'present'` (device scan implies present) |
| — | source = `'farm_to_feed'` |
| — | class_id = null (optional: resolve from SupaSchool students if needed later) |

- **Upsert:** On conflict (e.g. student_id, attendance_date) update status/source/device_id or ignore. One record per student per day; multiple device events for the same day collapse to one row.

### Meals

| Device / backend field | SupaSchool meal_records |
|------------------------|--------------------------|
| eventId | Not stored |
| externalId → student_id | student_id |
| schoolId | school_id |
| terminalId | device_id |
| ts | meal_date = date(ts) |
| method (nfc/palm/nfc_palm) | Not mapped to meal_type; use default |
| — | meal_type = `'lunch'` (default for MVP; or configurable) |
| — | served = true |
| — | source = `'farm_to_feed'` |
| — | quantity = null or 1 (if required) |

- **Upsert:** On conflict (e.g. student_id, meal_date, meal_type) update or ignore. Multiple events same student/day can result in one row or multiple rows if meal_type differs (e.g. breakfast + lunch); for MVP single meal_type default is enough.

---

## 6. Integration Write Flows

### Attendance (device → backend → Supabase)

1. Device: SyncWorker sends POST /v1/events/attendance/bulk with events (eventId, externalId, terminalId, schoolId, ts, confidence).
2. Backend: terminalAuth; validate body; for each event:
   - Resolve externalId to student_id (backend DB or use externalId as SupaSchool student id per Section 4).
   - Insert into backend `attendance_events` (existing logic).
   - **New:** Derive attendance_date from ts; upsert into Supabase `attendance_records` (student_id, school_id, attendance_date, status='present', source='farm_to_feed', device_id=terminalId).
3. Return 200; device marks events synced.

### Meals (device → backend → Supabase)

1. Device: POST /v1/events/meals/bulk with events (eventId, externalId, terminalId, schoolId, ts, method).
2. Backend: Same resolve; insert into backend `meal_events`; **new:** upsert into Supabase `meal_records` (student_id, school_id, meal_date, meal_type='lunch', served=true, source='farm_to_feed', device_id=terminalId).
3. Return 200; device marks events synced.

---

## 7. Integration Read Flows (SupaSchool)

- **Unchanged.** SupaSchool reads `attendance_records` and `meal_records` via existing services; filters by date, school, class, and optionally `source`. Dashboard and reports show device data as soon as the backend has written it.

---

## 8. Auth and Identity

- **Device → backend:** Existing Bearer token from activation; backend validates and gets schoolId/terminalId from token. No change.
- **Backend → Supabase:** Use **service role key** (or anon + RLS) so the server can insert/upsert without user context. `recorded_by` can be null for device-originated rows.

---

## 9. Device and Sync Strategy

- **No change** on the device: periodic WorkManager sync and “Sync now” continue to call the same backend endpoints. Backend remains the single place that writes to both its own DB and Supabase.

---

## 10. File-by-File Implementation Plan (Phase 3)

### Backend (android/farm-to-palm/backend)

| Action | File | Reason |
|--------|------|--------|
| Add env | `src/env.ts` | SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY. |
| Create | `src/supabase/client.ts` (or `lib/supabase.ts`) | Create Supabase client with service role. |
| Create | `src/supabase/attendance.ts` | `upsertAttendanceToSupabase(events, resolveExternalId)` — map events to attendance_records rows, upsert by (student_id, attendance_date). |
| Create | `src/supabase/meals.ts` | `upsertMealsToSupabase(events, resolveExternalId)` — map to meal_records, upsert by (student_id, meal_date, meal_type). |
| Modify | `src/modules/events/attendance.ts` | After existing insert loop, call upsertAttendanceToSupabase(parsed.data.events, resolver). Resolver: externalId → student_id (use externalId as SupaSchool id or lookup). |
| Modify | `src/modules/events/meals.ts` | After existing insert loop, call upsertMealsToSupabase(parsed.data.events, resolver). |
| Optional | `src/modules/terminals/activate.ts` | If device_registrations in Supabase are used, register terminal after activation (device_id = terminalId). |

### Android app

- **No file changes** for MVP; device contract unchanged.

### SupaSchool

- **No file changes** for MVP; already supports source and device_id.

---

## 11. API / Service Contract (Backend → Supabase)

- **upsertAttendanceToSupabase(events, getStudentId(externalId, schoolId))**  
  - For each event: student_id = getStudentId(e.externalId, e.schoolId); attendance_date = new Date(e.ts).toISOString().slice(0,10); row = { student_id, school_id: e.schoolId, attendance_date, status: 'present', source: 'farm_to_feed', device_id: e.terminalId }.  
  - Upsert on (student_id, attendance_date) or (student_id, attendance_date, source).

- **upsertMealsToSupabase(events, getStudentId)**  
  - Same; meal_date from ts; meal_type = 'lunch'; served = true; upsert on (student_id, meal_date, meal_type).

- **getStudentId(externalId, schoolId):** Return SupaSchool student uuid (either externalId if it is already the SupaSchool id, or lookup in backend and map). Must not throw; skip event if no student_id.

---

## 12. Step-by-Step Build Order (Phase 3)

1. **Backend env and Supabase client** — Add SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY; create client; verify connectivity (e.g. list schools or simple select).
2. **Attendance bridge** — Implement upsertAttendanceToSupabase; call from attendance bulk handler; test with one event (check Supabase row).
3. **Meals bridge** — Implement upsertMealsToSupabase; call from meals bulk handler; test.
4. **Student id resolution** — Document and implement getStudentId (externalId = SupaSchool id or mapping); handle missing student (skip or log).
5. **Error handling** — If Supabase write fails, decide: still return 200 to device (event already in backend DB) or return 5xx and let device retry. Recommend: log error, still return 200 so device marks synced; optional retry job for failed Supabase writes later.
6. **Manual QA** — Device records attendance/meal → backend → Supabase → SupaSchool dashboard shows data with source farm_to_feed.

---

## 13. Acceptance Criteria (MVP)

- [ ] Device records attendance (palm scan) and syncs; backend receives bulk; backend writes to its PostgreSQL and to Supabase attendance_records; SupaSchool shows the record (source = farm_to_feed).
- [ ] Device records meal (palm or NFC) and syncs; backend writes to Supabase meal_records; SupaSchool shows the record.
- [ ] Duplicate events (same student, same day) do not create duplicate rows in SupaSchool (upsert).
- [ ] attendance_date and meal_date are the calendar date derived from event ts.
- [ ] device_id (or terminal_id) is stored so reports can filter by device if needed.

---

## 14. Risks / Open Questions

| Risk | Severity | Mitigation |
|------|----------|-------------|
| externalId ≠ SupaSchool student id | High | Align student identity at setup (device/backend use SupaSchool student id as externalId); document in deployment. |
| Supabase down or key wrong | Medium | Backend still writes to its own DB; device sync succeeds; add logging and optional retry for Supabase. |
| Timezone for ts → date | Low | Use server timezone or UTC consistently; document. |
| meal_type always lunch | Low | Accept for MVP; later add session/config or pass from device. |
| device_registrations not populated | Low | device_id can be terminal id string; FK to device_registrations optional. |

---

*End of Phase 2 Android Integration Design. Proceed to Phase 3 for implementation.*
