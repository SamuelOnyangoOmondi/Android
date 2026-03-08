import { supabase } from "@/integrations/supabase/client";

export type MealRecordPayload = {
  studentId: string;
  schoolId: string;
  classId?: string | null;
  mealDate: string;
  mealType: "breakfast" | "lunch" | "supper" | "snack";
  served?: boolean;
  quantity?: number;
  notes?: string;
  recordedBy?: string;
  source?: "farm_to_feed" | "supaschool" | "api" | "import" | "backfill";
  deviceId?: string | null;
};

export type MealFilters = {
  schoolId?: string;
  classId?: string;
  mealDate?: string;
  mealType?: "breakfast" | "lunch" | "supper" | "snack";
  studentId?: string;
  source?: "farm_to_feed" | "supaschool" | "api" | "import" | "backfill";
};

export async function recordMeal(payload: MealRecordPayload) {
  const row = {
    student_id: payload.studentId,
    school_id: payload.schoolId,
    class_id: payload.classId ?? null,
    meal_date: payload.mealDate,
    meal_type: payload.mealType,
    served: payload.served ?? true,
    quantity: payload.quantity ?? 1,
    notes: payload.notes ?? null,
    recorded_by: payload.recordedBy ?? null,
    source: (payload.source ?? "farm_to_feed") as "farm_to_feed" | "supaschool" | "api" | "import" | "backfill",
    device_id: payload.deviceId ?? null,
  };

  const { data, error } = await supabase
    .from("meal_records")
    .upsert(row, {
      onConflict: "student_id,meal_date,meal_type",
      ignoreDuplicates: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMealRecord(params: {
  studentId: string;
  mealDate: string;
  mealType: "breakfast" | "lunch" | "supper" | "snack";
}) {
  const { error } = await supabase
    .from("meal_records")
    .delete()
    .eq("student_id", params.studentId)
    .eq("meal_date", params.mealDate)
    .eq("meal_type", params.mealType);

  if (error) throw error;
}

/** Bulk delete all meal records for a meal type on a date for a school (e.g. "Clear all Lunch"). */
export async function deleteMealRecordsByFilter(params: {
  schoolId: string;
  mealDate: string;
  mealType: "breakfast" | "lunch" | "supper" | "snack";
}) {
  const { error } = await supabase
    .from("meal_records")
    .delete()
    .eq("school_id", params.schoolId)
    .eq("meal_date", params.mealDate)
    .eq("meal_type", params.mealType);

  if (error) throw error;
}

export async function upsertMealBatch(
  items: MealRecordPayload[]
) {
  if (items.length === 0) return [];

  const rows = items.map((item) => ({
    student_id: item.studentId,
    school_id: item.schoolId,
    class_id: item.classId ?? null,
    meal_date: item.mealDate,
    meal_type: item.mealType,
    served: item.served ?? true,
    quantity: item.quantity ?? 1,
    notes: item.notes ?? null,
    recorded_by: item.recordedBy ?? null,
    source: (item.source ?? "farm_to_feed") as "farm_to_feed" | "supaschool" | "api" | "import" | "backfill",
    device_id: item.deviceId ?? null,
  }));

  const { data, error } = await supabase
    .from("meal_records")
    .upsert(rows, {
      onConflict: "student_id,meal_date,meal_type",
      ignoreDuplicates: false,
    })
    .select();

  if (error) throw error;
  return data;
}

export async function getMealRecords(params: MealFilters) {
  let query = supabase
    .from("meal_records")
    .select(
      `
      *,
      students(first_name, last_name, admission_number, class_id),
      classes(name)
    `
    )
    .order("meal_date", { ascending: false });

  if (params.schoolId) query = query.eq("school_id", params.schoolId);
  if (params.classId) query = query.eq("class_id", params.classId);
  if (params.mealDate) query = query.eq("meal_date", params.mealDate);
  if (params.mealType) query = query.eq("meal_type", params.mealType);
  if (params.studentId) query = query.eq("student_id", params.studentId);
  if (params.source) query = query.eq("source", params.source);

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getMealSummary(params: {
  schoolId?: string;
  classId?: string;
  mealDate: string;
  mealType?: "breakfast" | "lunch" | "supper" | "snack";
}) {
  let query = supabase
    .from("meal_records")
    .select("meal_type, student_id")
    .eq("meal_date", params.mealDate);

  if (params.schoolId) query = query.eq("school_id", params.schoolId);
  if (params.classId) query = query.eq("class_id", params.classId);
  if (params.mealType) query = query.eq("meal_type", params.mealType);

  const { data, error } = await query;

  if (error) throw error;

  const byType = {
    breakfast: 0,
    lunch: 0,
    supper: 0,
    snack: 0,
  };

  for (const r of data ?? []) {
    if (r.meal_type in byType) {
      (byType as Record<string, number>)[r.meal_type]++;
    }
  }

  return {
    byType,
    total: data?.length ?? 0,
  };
}
