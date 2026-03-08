import { supabase } from "@/integrations/supabase/client";

export type DashboardFilters = {
  schoolId?: string;
  classId?: string;
  date?: string;
};

export async function getDashboardSnapshot(params: DashboardFilters) {
  const date = params.date ?? new Date().toISOString().split("T")[0];

  // Today's attendance summary
  let attendanceQuery = supabase
    .from("attendance_records")
    .select("status")
    .eq("attendance_date", date);

  if (params.schoolId) attendanceQuery = attendanceQuery.eq("school_id", params.schoolId);
  if (params.classId) attendanceQuery = attendanceQuery.eq("class_id", params.classId);

  const { data: attendanceData, error: attendanceError } = await attendanceQuery;

  if (attendanceError) throw attendanceError;

  const attendanceSummary = {
    present: attendanceData?.filter((r) => r.status === "present").length ?? 0,
    absent: attendanceData?.filter((r) => r.status === "absent").length ?? 0,
    late: attendanceData?.filter((r) => r.status === "late").length ?? 0,
    excused: attendanceData?.filter((r) => r.status === "excused").length ?? 0,
    total: attendanceData?.length ?? 0,
  };

  // Today's meal counts
  let mealsQuery = supabase
    .from("meal_records")
    .select("meal_type")
    .eq("meal_date", date);

  if (params.schoolId) mealsQuery = mealsQuery.eq("school_id", params.schoolId);
  if (params.classId) mealsQuery = mealsQuery.eq("class_id", params.classId);

  const { data: mealsData, error: mealsError } = await mealsQuery;

  if (mealsError) throw mealsError;

  const mealsSummary = {
    breakfast: mealsData?.filter((r) => r.meal_type === "breakfast").length ?? 0,
    lunch: mealsData?.filter((r) => r.meal_type === "lunch").length ?? 0,
    supper: mealsData?.filter((r) => r.meal_type === "supper").length ?? 0,
    snack: mealsData?.filter((r) => r.meal_type === "snack").length ?? 0,
    total: mealsData?.length ?? 0,
  };

  // Active student count in scope
  let studentsQuery = supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  if (params.schoolId) studentsQuery = studentsQuery.eq("school_id", params.schoolId);
  if (params.classId) studentsQuery = studentsQuery.eq("class_id", params.classId);

  const { count: activeStudents, error: studentsError } = await studentsQuery;

  if (studentsError) throw studentsError;

  const attendanceCoverage =
    (activeStudents ?? 0) > 0
      ? Math.round((attendanceSummary.total / (activeStudents ?? 1)) * 100)
      : 0;

  const mealCoverage =
    (activeStudents ?? 0) > 0
      ? Math.round((mealsSummary.total / (activeStudents ?? 1)) * 100)
      : 0;

  return {
    date,
    attendance: attendanceSummary,
    meals: mealsSummary,
    activeStudents: activeStudents ?? 0,
    attendanceCoverage,
    mealCoverage,
  };
}
