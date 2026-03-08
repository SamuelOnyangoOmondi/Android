-- Run this in Supabase SQL Editor if import fails with "relation public.students does not exist".
-- Requires: public.schools already exists (run create-schools-table.sql first).

-- Helper for updated_at (used by classes, students)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- classes
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

CREATE TRIGGER set_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- students
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

CREATE TRIGGER set_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS: allow read/insert/update for anon (so app can load and import)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for classes" ON public.classes;
CREATE POLICY "Allow all for classes" ON public.classes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for students" ON public.students;
CREATE POLICY "Allow all for students" ON public.students FOR ALL USING (true) WITH CHECK (true);
