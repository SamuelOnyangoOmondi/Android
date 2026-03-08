-- Farm to Feed Integration: SupaSchool shared schema
-- Enums, tables, indexes, triggers for attendance and meal events

-- 5.1 Enums
CREATE TYPE public.app_role AS ENUM (
  'super_admin', 'county_admin', 'school_admin', 'teacher', 'feeding_staff', 'viewer'
);

CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

CREATE TYPE public.meal_type AS ENUM ('breakfast', 'lunch', 'supper', 'snack');

CREATE TYPE public.record_source AS ENUM ('supaschool', 'farm_to_feed', 'import', 'api', 'backfill');

CREATE TYPE public.sync_status AS ENUM ('received', 'processed', 'failed', 'duplicate');

-- 5.2 Core tables

-- user_profiles: Application user identity and role metadata
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  role public.app_role NOT NULL DEFAULT 'viewer',
  phone text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- school_users: Maps users to one or more schools
CREATE TABLE IF NOT EXISTS public.school_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, user_id)
);

-- classes: Class roster grouping within a school
CREATE TABLE IF NOT EXISTS public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  grade_level text,
  stream text,
  teacher_name text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, name)
);

-- students: Master student records
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE RESTRICT,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  admission_number text NOT NULL,
  nemis_id text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  gender text,
  date_of_birth date,
  guardian_name text,
  guardian_phone text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, admission_number)
);

-- Partial unique on nemis_id when not null (optional NEMIS per school)
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_school_nemis_unique
  ON public.students (school_id, nemis_id)
  WHERE nemis_id IS NOT NULL;

-- attendance_records: One attendance status per student per date
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  attendance_date date NOT NULL,
  status public.attendance_status NOT NULL,
  notes text,
  recorded_by uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  source public.record_source NOT NULL DEFAULT 'supaschool',
  device_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, attendance_date)
);

-- meal_records: One meal event per student, date, and meal type
CREATE TABLE IF NOT EXISTS public.meal_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  meal_date date NOT NULL,
  meal_type public.meal_type NOT NULL,
  served boolean NOT NULL DEFAULT true,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  notes text,
  recorded_by uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  source public.record_source NOT NULL DEFAULT 'farm_to_feed',
  device_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, meal_date, meal_type)
);

-- device_registrations: Known capture devices/tablets
CREATE TABLE IF NOT EXISTS public.device_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  device_code text NOT NULL UNIQUE,
  device_name text,
  platform text,
  is_active boolean NOT NULL DEFAULT true,
  last_seen_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- sync_events: Inbound payload tracking and troubleshooting
CREATE TABLE IF NOT EXISTS public.sync_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_event_id text UNIQUE,
  source public.record_source NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  sync_status public.sync_status NOT NULL DEFAULT 'received',
  error_message text,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5.3 Indexes
CREATE INDEX IF NOT EXISTS idx_students_school_class ON public.students (school_id, class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_school_date ON public.attendance_records (school_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.attendance_records (student_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_meals_school_date ON public.meal_records (school_id, meal_date);
CREATE INDEX IF NOT EXISTS idx_meals_student_date ON public.meal_records (student_id, meal_date);
CREATE INDEX IF NOT EXISTS idx_sync_events_status ON public.sync_events (sync_status, created_at DESC);

-- 5.4 Helper rules (school_id is already NOT NULL, constraints are redundant but kept for clarity)
ALTER TABLE public.attendance_records
  DROP CONSTRAINT IF EXISTS attendance_school_student_fk_check;
ALTER TABLE public.attendance_records
  ADD CONSTRAINT attendance_school_student_fk_check CHECK (school_id IS NOT NULL);

ALTER TABLE public.meal_records
  DROP CONSTRAINT IF EXISTS meal_school_student_fk_check;
ALTER TABLE public.meal_records
  ADD CONSTRAINT meal_school_student_fk_check CHECK (school_id IS NOT NULL);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_attendance_records_updated_at
  BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_meal_records_updated_at
  BEFORE UPDATE ON public.meal_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS: Enable RLS on all new tables (permissive policies for initial setup; tighten per PRD later)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_events ENABLE ROW LEVEL SECURITY;

-- Permissive policies for development (allow all for anon/authenticated until auth is wired)
CREATE POLICY "Allow all for user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for school_users" ON public.school_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for classes" ON public.classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for attendance_records" ON public.attendance_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for meal_records" ON public.meal_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for device_registrations" ON public.device_registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for sync_events" ON public.sync_events FOR ALL USING (true) WITH CHECK (true);
