import { getSupabase } from './client.js';

export type MealEventItem = {
  eventId: string;
  studentId?: string;
  externalId?: string;
  terminalId: string;
  schoolId: string;
  ts: number;
  method: string;
};

function getSupabaseStudentId(e: MealEventItem): string | null {
  const id = e.externalId ?? e.studentId ?? null;
  if (!id || typeof id !== 'string') return null;
  return id;
}

/**
 * Write device meal events to SupaSchool Supabase as meal_records.
 * One record per (student_id, meal_date, meal_type); default meal_type = 'lunch', source = 'farm_to_feed'.
 * No-op if Supabase is not configured.
 */
export async function upsertMealsToSupabase(
  events: MealEventItem[],
  _schoolIdFromToken: string
): Promise<{ ok: boolean; error?: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: true };

  const byKey = new Map<string, { student_id: string; school_id: string; meal_date: string; device_id: string | null }>();
  for (const e of events) {
    const studentId = getSupabaseStudentId(e);
    if (!studentId) continue;
    const schoolId = e.schoolId ?? _schoolIdFromToken;
    const mealDate = new Date(e.ts).toISOString().slice(0, 10);
    const key = `${studentId}:${mealDate}:lunch`;
    if (!byKey.has(key)) {
      byKey.set(key, {
        student_id: studentId,
        school_id: schoolId,
        meal_date: mealDate,
        device_id: e.terminalId || null,
      });
    }
  }

  if (byKey.size === 0) return { ok: true };

  const rows = Array.from(byKey.values()).map((r) => ({
    student_id: r.student_id,
    school_id: r.school_id,
    class_id: null,
    meal_date: r.meal_date,
    meal_type: 'lunch' as const,
    served: true,
    quantity: 1,
    notes: null,
    recorded_by: null,
    source: 'farm_to_feed' as const,
    device_id: r.device_id,
  }));

  const { error } = await sb
    .from('meal_records')
    .upsert(rows, { onConflict: 'student_id,meal_date,meal_type', ignoreDuplicates: false });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
