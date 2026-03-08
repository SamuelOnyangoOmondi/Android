import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../env.js';

let supabase: SupabaseClient | null = null;

/**
 * Supabase client for writing to SupaSchool's project (attendance_records, meal_records).
 * Returns null if SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are not set (bridge disabled).
 */
export function getSupabase(): SupabaseClient | null {
  if (supabase !== null) return supabase;
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  return supabase;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}
