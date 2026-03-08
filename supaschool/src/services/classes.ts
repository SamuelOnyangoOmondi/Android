import { supabase } from "@/integrations/supabase/client";

export async function getClassesBySchool(schoolId: string) {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("school_id", schoolId)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createClass(payload: {
  school_id: string;
  name: string;
  grade_level?: string | null;
  stream?: string | null;
  teacher_name?: string | null;
}) {
  const { data, error } = await supabase
    .from("classes")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClass(
  classId: string,
  payload: Partial<{
    name: string;
    grade_level: string | null;
    stream: string | null;
    teacher_name: string | null;
    is_active: boolean;
  }>
) {
  const { data, error } = await supabase
    .from("classes")
    .update(payload)
    .eq("id", classId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
