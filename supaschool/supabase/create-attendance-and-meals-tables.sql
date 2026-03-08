-- Run this in Supabase SQL Editor if saving attendance fails with "relation attendance_records does not exist".
-- Requires: public.schools and public.students (and public.classes) exist.

-- Helper for updated_at (if not already created by create-students-and-classes-tables.sql)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enums (skip if already exist)
DO $$ BEGIN
  CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.meal_type AS ENUM ('breakfast', 'lunch', 'supper', 'snack');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.record_source AS ENUM ('supaschool', 'farm_to_feed', 'import', 'api', 'backfill');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- attendance_records
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  attendance_date date NOT NULL,
  status public.attendance_status NOT NULL,
  notes text,
  recorded_by uuid,
  source public.record_source NOT NULL DEFAULT 'supaschool',
  device_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, attendance_date)
);

CREATE TRIGGER set_attendance_records_updated_at
  BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- meal_records
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
  recorded_by uuid,
  source public.record_source NOT NULL DEFAULT 'supaschool',
  device_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, meal_date, meal_type)
);

CREATE TRIGGER set_meal_records_updated_at
  BEFORE UPDATE ON public.meal_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for attendance_records" ON public.attendance_records;
CREATE POLICY "Allow all for attendance_records" ON public.attendance_records FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for meal_records" ON public.meal_records;
CREATE POLICY "Allow all for meal_records" ON public.meal_records FOR ALL USING (true) WITH CHECK (true);
