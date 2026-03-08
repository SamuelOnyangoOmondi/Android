/**
 * Test the backend → Supabase bridge without a physical device.
 *
 * Prereqs:
 * - Backend running: npm run dev
 * - Backend DB seeded: npm run seed (creates activation code FARM-PALM-001)
 * - A real SupaSchool student UUID (from SupaSchool dashboard or Supabase students table)
 *
 * Usage:
 *   node scripts/test-bridge-without-device.mjs <SUPASCHOOL_STUDENT_UUID>
 *   or set SUPABASE_TEST_STUDENT_ID in env
 *
 * Example:
 *   node scripts/test-bridge-without-device.mjs a1b2c3d4-0000-0000-0000-000000000001
 */
const BASE = process.env.API_BASE_URL || 'http://localhost:3000';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function main() {
  const studentId = process.argv[2] || process.env.SUPABASE_TEST_STUDENT_ID;
  const schoolIdOverride = process.argv[3] || process.env.SUPABASE_TEST_SCHOOL_ID;
  if (!studentId) {
    console.error('Usage: node scripts/test-bridge-without-device.mjs <SUPASCHOOL_STUDENT_UUID> [SUPASCHOOL_SCHOOL_UUID]');
    console.error('Or set SUPABASE_TEST_STUDENT_ID (and optionally SUPABASE_TEST_SCHOOL_ID) in env.');
    console.error('Get UUIDs from SupaSchool (Schools / Students) or Supabase tables.');
    process.exit(1);
  }

  console.log('1. Activating terminal (code FARM-PALM-001)...');
  const activateRes = await fetch(`${BASE}/v1/terminals/activate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activationCode: 'FARM-PALM-001' }),
  });
  if (!activateRes.ok) {
    const t = await activateRes.text();
    console.error('Activate failed:', activateRes.status, t);
    process.exit(1);
  }
  const { token, terminalId, schoolId: activatedSchoolId } = await activateRes.json();
  const schoolId = schoolIdOverride || activatedSchoolId;
  if (schoolIdOverride) console.log('   Using SupaSchool school_id override:', schoolId);
  console.log('   Token received, terminalId:', terminalId, 'schoolId:', schoolId);

  const ts = Date.now();
  const eventId1 = uuid();
  const eventId2 = uuid();

  console.log('2. Sending one attendance event...');
  const attRes = await fetch(`${BASE}/v1/events/attendance/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      events: [
        {
          eventId: eventId1,
          externalId: studentId,
          terminalId,
          schoolId,
          ts,
          confidence: 0.95,
        },
      ],
    }),
  });
  if (!attRes.ok) {
    console.error('Attendance bulk failed:', attRes.status, await attRes.text());
    process.exit(1);
  }
  console.log('   Attendance OK');

  console.log('3. Sending one meal event...');
  const mealRes = await fetch(`${BASE}/v1/events/meals/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      events: [
        {
          eventId: eventId2,
          externalId: studentId,
          terminalId,
          schoolId,
          ts,
          method: 'palm',
        },
      ],
    }),
  });
  if (!mealRes.ok) {
    console.error('Meals bulk failed:', mealRes.status, await mealRes.text());
    process.exit(1);
  }
  console.log('   Meals OK');

  const dateStr = new Date(ts).toISOString().slice(0, 10);
  console.log('\nDone. Check SupaSchool:');
  console.log('  - Attendance for date', dateStr, '→ should show one record, source = farm_to_feed');
  console.log('  - Meals for date', dateStr, '→ should show one record (lunch), source = farm_to_feed');
  console.log('  - student_id in both should be:', studentId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
