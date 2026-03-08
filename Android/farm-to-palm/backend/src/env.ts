export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL ?? 'postgres://farmtopalm:farmtopalm_secret@localhost:5432/farmtopalm',
  JWT_SECRET: process.env.JWT_SECRET ?? 'change-me-in-production',
  BIOMETRIC_ENC_KEY: process.env.BIOMETRIC_ENC_KEY ?? '0123456789abcdef0123456789abcdef',
  /** SupaSchool Supabase: URL and service role key for writing attendance/meal records from device. */
  SUPABASE_URL: process.env.SUPABASE_URL ?? '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
};
