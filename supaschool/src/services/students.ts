import { supabase } from "@/integrations/supabase/client";

/**
 * Students service. Used by Manage Students and Attendance (same DB, same school_id filter)
 * so students added or imported in Manage Students appear in Attendance when the same school is selected.
 */
export type StudentFilters = {
  schoolId: string;
  classId?: string;
  search?: string;
  isActive?: boolean;
};

export type CreateStudentPayload = {
  school_id: string;
  class_id?: string | null;
  admission_number: string;
  nemis_id?: string | null;
  first_name: string;
  last_name: string;
  gender?: string | null;
  date_of_birth?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
};

export async function getStudents(params: StudentFilters) {
  let query = supabase
    .from("students")
    .select("*")
    .eq("school_id", params.schoolId)
    .order("last_name", { ascending: true });

  if (params.classId) {
    query = query.eq("class_id", params.classId);
  }

  if (params.isActive !== undefined) {
    query = query.eq("is_active", params.isActive);
  }

  if (params.search?.trim()) {
    const term = params.search.trim();
    query = query.or(
      `first_name.ilike.%${term}%,last_name.ilike.%${term}%,admission_number.ilike.%${term}%,nemis_id.ilike.%${term}%`
    );
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function createStudent(payload: CreateStudentPayload) {
  const { data, error } = await supabase
    .from("students")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Bulk insert students (e.g. CSV import). All rows must have the same school_id. */
export async function createStudentsBulk(payloads: CreateStudentPayload[]) {
  if (payloads.length === 0) return [];
  const { data, error } = await supabase
    .from("students")
    .insert(payloads)
    .select();

  if (error) throw error;
  return data;
}

export async function updateStudent(
  studentId: string,
  payload: Partial<CreateStudentPayload>
) {
  const { data, error } = await supabase
    .from("students")
    .update(payload)
    .eq("id", studentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function archiveStudent(studentId: string) {
  return updateStudent(studentId, { is_active: false } as Partial<CreateStudentPayload>);
}
