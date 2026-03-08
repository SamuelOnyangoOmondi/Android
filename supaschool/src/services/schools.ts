import { supabase } from "@/integrations/supabase/client";

export async function getSchools() {
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}
