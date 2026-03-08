# PHASE 3 — Android (Device) Integration Implementation Summary

**Date:** 2025-03-07  
**Scope:** Backend bridge so device bulk events also write to SupaSchool’s Supabase.  
**Reference:** PHASE_2_ANDROID_INTEGRATION_DESIGN.md, SYSTEM_AUDIT_REPORT_ANDROID.md.

---

## 1. What Was Implemented

### Backend (android/farm-to-palm/backend)

| Item | Detail |
|------|--------|
| **Dependency** | Added `@supabase/supabase-js` in `package.json`. |
| **Env** | `src/env.ts`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (optional; bridge disabled when either is empty). |
| **Supabase client** | `src/supabase/client.ts`: `getSupabase()`, `isSupabaseConfigured()`; lazy init, returns `null` if not configured. |
| **Attendance bridge** | `src/supabase/attendance.ts`: `upsertAttendanceToSupabase(events, schoolIdFromToken)`. Maps each event to one row per (student_id, attendance_date); `student_id` = `externalId ?? studentId` (SupaSchool student uuid); `attendance_date` = date(ts); `status` = `'present'`, `source` = `'farm_to_feed'`, `device_id` = terminalId. Upsert on `student_id,attendance_date`. |
| **Meals bridge** | `src/supabase/meals.ts`: `upsertMealsToSupabase(events, schoolIdFromToken)`. Same student/date resolution; one row per (student_id, meal_date) with `meal_type` = `'lunch'`, `served` = true, `quantity` = 1. Upsert on `student_id,meal_date,meal_type`. |
| **Bulk handlers** | `src/modules/events/attendance.ts`: After writing to backend PostgreSQL, calls `upsertAttendanceToSupabase(parsed.data.events, schoolIdFromToken)`; logs warning on failure, still returns 200. |
| **Bulk handlers** | `src/modules/events/meals.ts`: Same pattern for `upsertMealsToSupabase`. |
| **.env.example** | Documented `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. |

### Android app

- **No code changes.** Device continues to POST to the same backend; no new env or SDK.

### SupaSchool

- **No code changes.** Already reads `attendance_records` and `meal_records` with `source` and `device_id`; dashboard and reports show device data once the backend writes it.

---

## 2. Files Created

| File | Purpose |
|------|--------|
| `android/farm-to-palm/backend/src/supabase/client.ts` | Supabase client (lazy, null if not configured). |
| `android/farm-to-palm/backend/src/supabase/attendance.ts` | Map device attendance events → Supabase attendance_records upsert. |
| `android/farm-to-palm/backend/src/supabase/meals.ts` | Map device meal events → Supabase meal_records upsert. |

---

## 3. Files Modified

| File | Change |
|------|--------|
| `android/farm-to-palm/backend/package.json` | Added `@supabase/supabase-js`. |
| `android/farm-to-palm/backend/src/env.ts` | Added `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. |
| `android/farm-to-palm/backend/src/modules/events/attendance.ts` | Import and call `upsertAttendanceToSupabase`; log warning on failure. |
| `android/farm-to-palm/backend/src/modules/events/meals.ts` | Import and call `upsertMealsToSupabase`; log warning on failure. |
| `android/farm-to-palm/backend/.env.example` | Documented Supabase env vars. |

---

## 4. Student Identity (Supabase student_id)

- **Source:** `externalId` (from device) or `studentId` (if present in payload).
- **Requirement:** For rows to appear correctly in SupaSchool, `externalId` on the device must be the **SupaSchool `students.id`** (uuid). Ensure student sync or enrollment stores SupaSchool student id as `externalId` in the device’s local DB and in the backend’s `students.external_id` if used for resolution.
- **Backend:** Still resolves externalId to its own `students.id` for writing to backend PostgreSQL; the Supabase bridge uses `externalId ?? studentId` as the SupaSchool `student_id` for upserts.

---

## 5. Behaviour Summary

- **Supabase not configured:** Backend works as before; no Supabase writes; no errors.
- **Supabase configured:** After each successful bulk write to backend DB, the same events are written to SupaSchool’s Supabase. One device event per student per day → one attendance_record (status present). One device event per student per day → one meal_record (meal_type lunch). Duplicate events for the same student/date do not create duplicate rows (upsert).
- **On Supabase failure:** Backend logs a warning and still returns 200; device marks events synced. Optional: add a retry job for failed Supabase writes later.

---

## 6. Manual QA Steps

1. **Backend env**  
   - Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to SupaSchool’s project.  
   - Run backend: `npm run dev`.  
   - Confirm no startup errors when Supabase is configured or when vars are unset.

2. **Attendance**  
   - On device (or via API client): activate terminal, record attendance (palm), trigger sync (or wait for periodic sync).  
   - Call `POST /v1/events/attendance/bulk` with a valid token and at least one event with `externalId` = a SupaSchool student uuid, `schoolId`, `terminalId`, `ts` (epoch ms).  
   - In SupaSchool: open Attendance (or dashboard); filter by date = date(ts); confirm a row with `source = farm_to_feed` and correct `student_id` / `attendance_date`.

3. **Meals**  
   - Same flow for `POST /v1/events/meals/bulk`; confirm a row in SupaSchool Meals with `source = farm_to_feed`, `meal_type = lunch`, `meal_date` = date(ts).

4. **Duplicates**  
   - Send two bulk requests for the same student and same calendar day (different eventIds, same ts date).  
   - Confirm only one attendance_record and one meal_record for that student/date in Supabase.

5. **Device_id**  
   - Confirm `device_id` in Supabase equals the request’s `terminalId` (or is null if terminalId empty).

---

## 7. Schema / Assumptions

- SupaSchool `attendance_records`: unique on `(student_id, attendance_date)` for upsert.  
- SupaSchool `meal_records`: unique on `(student_id, meal_date, meal_type)` for upsert.  
- Enums: `attendance_status` includes `'present'`; `meal_type` includes `'lunch'`; `record_source` includes `'farm_to_feed'`.  
- All assumed to match existing SupaSchool migrations and types.

---

*End of Phase 3 implementation summary. Proceed to Phase 4 for QA and hardening.*
