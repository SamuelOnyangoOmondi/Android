# PHASE 4 — Android (Device) Integration QA Report

**Date:** 2025-03-07  
**Scope:** Verification and hardening of the backend bridge (device → backend → SupaSchool Supabase).  
**References:** PHASE_3_ANDROID_IMPLEMENTATION.md, PHASE_2_ANDROID_INTEGRATION_DESIGN.md.

---

## 1. Verification Summary

| Area | Status | Notes |
|------|--------|--------|
| **Backend bridge code** | ✅ Implemented | Supabase client, attendance + meals upsert modules; bulk handlers call them. |
| **Env and optional bridge** | ✅ Implemented | Bridge no-op when SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY unset. |
| **Student id for Supabase** | ✅ Documented | Uses externalId ?? studentId; requires externalId = SupaSchool students.id. |
| **Error handling** | ✅ Implemented | Supabase failure logs warning; response 200 so device marks synced. |
| **Android app** | ✅ Unchanged | No changes; same API contract. |
| **SupaSchool** | ✅ Unchanged | Already supports source and device_id. |

---

## 2. Code Review Findings

### 2.1 Backend

- **Supabase client:** Lazy init; returns null when env not set; no crash if vars missing.
- **Attendance bridge:** Deduplicates by (student_id, attendance_date); date from `new Date(ts).toISOString().slice(0, 10)` (UTC date). Status always `'present'`; source `'farm_to_feed'`; device_id from terminalId.
- **Meals bridge:** Same date logic; one row per (student_id, meal_date) with meal_type `'lunch'`; served true, quantity 1.
- **Handlers:** Backend DB write remains first; Supabase write is best-effort; 200 even if Supabase fails (device sync succeeds).

### 2.2 Edge Cases

- **Missing student_id for Supabase:** Events with no valid externalId/studentId are skipped in the bridge (byKey only includes resolved rows). No crash.
- **Invalid UUID for student_id:** Supabase may reject with FK violation if student_id is not in SupaSchool students. Ensure externalId is a valid SupaSchool student uuid.
- **Timezone:** Date is derived in server process timezone (typically UTC for ISO slice). Document for deployments in other timezones.

---

## 3. Known Limitations / Deferred

| Item | Limitation | Recommendation |
|------|------------|-----------------|
| **meal_type** | Always `'lunch'` | Later: add config or device session (breakfast/lunch/supper). |
| **class_id** | Always null in Supabase rows | Later: resolve from SupaSchool students if needed for reports. |
| **recorded_by** | Always null | OK for device-only; later link to user if auth unified. |
| **Retry on Supabase failure** | No automatic retry | Optional: background job to retry failed upserts from backend DB. |
| **device_registrations** | Not populated | device_id stored as string (terminalId); FK to device_registrations optional later. |

---

## 4. Manual QA Checklist

Use this for stakeholder or release testing.

### 4.1 Backend Configuration

- [ ] With Supabase env **unset**: backend starts; POST /v1/events/attendance/bulk and /meals/bulk succeed; no Supabase calls.
- [ ] With Supabase env **set**: backend starts; no startup error; bridge is active.

### 4.2 Attendance Flow

- [ ] Device (or Postman): activate terminal; record one attendance (palm); sync (or “Sync now”).
- [ ] Backend: request reaches POST /v1/events/attendance/bulk with valid Bearer token; backend DB has one row in attendance_events.
- [ ] Supabase: one row in attendance_records for that student and date; status = present; source = farm_to_feed; device_id = terminal id.
- [ ] SupaSchool UI: Attendance or dashboard shows the record; source column shows “farm_to_feed” (if displayed).

### 4.3 Meals Flow

- [ ] Device: record one meal (palm or NFC); sync.
- [ ] Backend: one row in meal_events.
- [ ] Supabase: one row in meal_records; meal_type = lunch; source = farm_to_feed; device_id set.
- [ ] SupaSchool UI: Meals or dashboard shows the record.

### 4.4 Duplicate Handling

- [ ] Send two bulk attendance payloads (same student, same calendar day, different eventIds). Supabase has only one attendance_record for that (student_id, attendance_date).
- [ ] Same for meals: two bulk payloads same student/day → one meal_record (lunch) in Supabase.

### 4.5 Student Identity

- [ ] Use a SupaSchool student uuid as externalId in the bulk payload; row in Supabase has that student_id and appears under that student in SupaSchool.
- [ ] Use an externalId that is not a SupaSchool student id: Supabase upsert may fail (FK); backend still 200; log shows Supabase error.

### 4.6 Error Handling

- [ ] Set SUPABASE_SERVICE_ROLE_KEY to invalid value; trigger bulk; backend returns 200; log shows Supabase error; device marks events synced.

---

## 5. Blocker / Follow-Up List

| Priority | Item | Owner / Action |
|----------|------|-----------------|
| **P0** | Ensure device/backend use SupaSchool student id as externalId when syncing students | Deployment / student sync design |
| **P1** | Document SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in deployment runbook | Docs |
| **P2** | Optional: retry job for failed Supabase writes (e.g. from backend attendance_events/meal_events with a “supabase_synced” flag) | Backlog |
| **P2** | Optional: meal_type from device or session (breakfast/lunch/supper) | Backlog |

---

## 6. Sign-Off

- **Implementation:** Complete per PHASE_3_ANDROID_IMPLEMENTATION.md.  
- **Design:** Aligned with PHASE_2_ANDROID_INTEGRATION_DESIGN.md.  
- **QA:** Manual checklist above to be run before release; no automated tests added in this phase.

---

*End of Phase 4 Android QA Report.*
