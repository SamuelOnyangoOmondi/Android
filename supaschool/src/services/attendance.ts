import { supabase } from "@/integrations/supabase/client";

export type AttendanceBatchItem = {
  studentId: string;
  schoolId: string;
  classId?: string | null;
  attendanceDate: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
  recordedBy?: string;
  source?: "supaschool" | "farm_to_feed" | "api" | "import" | "backfill";
  deviceId?: string | null;
};

export type AttendanceFilters = {
  schoolId?: string;
  classId?: string;
  attendanceDate?: string;
  studentId?: string;
  source?: "supaschool" | "farm_to_feed" | "api" | "import" | "backfill";
};

export async function upsertAttendanceBatch(items: AttendanceBatchItem[]) {
  if (items.length === 0) return [];

  const rows = items.map((item) => ({
    student_id: item.studentId,
    school_id: item.schoolId,
    class_id: item.classId ?? null,
    attendance_date: item.attendanceDate,
    status: item.status,
    notes: item.notes ?? null,
    recorded_by: item.recordedBy ?? null,
    source: (item.source ?? "supaschool") as "supaschool" | "farm_to_feed" | "api" | "import" | "backfill",
    device_id: item.deviceId ?? null,
  }));

  const { data, error } = await supabase
    .from("attendance_records")
    .upsert(rows, {
      onConflict: "student_id,attendance_date",
      ignoreDuplicates: false,
    })
    .select();

  if (error) throw error;
  return data;
}

export async function getAttendanceRecords(params: AttendanceFilters) {
  let query = supabase
    .from("attendance_records")
    .select(
      `
      *,
      students(first_name, last_name, admission_number, class_id),
      classes(name)
    `
    )
    .order("attendance_date", { ascending: false });

  if (params.schoolId) query = query.eq("school_id", params.schoolId);
  if (params.classId) query = query.eq("class_id", params.classId);
  if (params.attendanceDate) query = query.eq("attendance_date", params.attendanceDate);
  if (params.studentId) query = query.eq("student_id", params.studentId);
  if (params.source) query = query.eq("source", params.source);

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getAttendanceSummary(params: {
  schoolId?: string;
  classId?: string;
  attendanceDate: string;
}) {
  let query = supabase
    .from("attendance_records")
    .select("status")
    .eq("attendance_date", params.attendanceDate);

  if (params.schoolId) query = query.eq("school_id", params.schoolId);
  if (params.classId) query = query.eq("class_id", params.classId);

  const { data: records, error } = await query;

  if (error) throw error;

  const summary = {
    present: records?.filter((r) => r.status === "present").length ?? 0,
    absent: records?.filter((r) => r.status === "absent").length ?? 0,
    late: records?.filter((r) => r.status === "late").length ?? 0,
    excused: records?.filter((r) => r.status === "excused").length ?? 0,
    total: records?.length ?? 0,
  };

  return summary;
}
