-- Run this in Supabase Dashboard → SQL Editor to create the schools table and fix "Could not find the table public.schools"

CREATE TABLE IF NOT EXISTS public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  county text,
  constituency text,
  district text,
  division text,
  location text,
  province text,
  level_of_education text,
  institution_type_1 text,
  institution_type_2 text,
  institution_type_3 text,
  sponsor text,
  school_status text,
  geolocation text,
  total_enrollment integer,
  total_boys integer,
  total_girls integer,
  total_classrooms integer,
  total_toilets integer,
  boys_toilets integer,
  girls_toilets integer,
  teachers_toilets integer,
  gok_tsc_male integer,
  gok_tsc_female integer,
  local_authority_male integer,
  local_authority_female integer,
  pta_bog_male integer,
  pta_bog_female integer,
  others_male integer,
  others_female integer,
  non_teaching_staff_male integer,
  non_teaching_staff_female integer,
  pupil_teacher_ratio numeric,
  pupil_classroom_ratio numeric,
  pupil_toilet_ratio numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read schools" ON public.schools;
CREATE POLICY "Allow read schools" ON public.schools FOR SELECT USING (true);

-- Optional: add a first school so the dropdown is not empty (edit name as needed)
INSERT INTO public.schools (name, county)
VALUES ('Kisumu Primary School', 'Kisumu')
ON CONFLICT DO NOTHING;
