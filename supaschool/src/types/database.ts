
export interface School {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  secondary_image_url: string | null;
  motto: string | null;
  website: string | null;
  level_of_education: string | null;
  school_status: string | null;
  sponsor: string | null;
  institution_type_1: string | null;
  institution_type_2: string | null;
  institution_type_3: string | null;
  province: string | null;
  county: string | null;
  district: string | null;
  division: string | null;
  location: string | null;
  constituency: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  pupil_teacher_ratio: number | null;
  pupil_classroom_ratio: number | null;
  pupil_toilet_ratio: number | null;
  total_classrooms: number | null;
  boys_toilets: number | null;
  girls_toilets: number | null;
  total_toilets: number | null;
  teachers_toilets: number | null;
  total_boys: number | null;
  total_girls: number | null;
  total_enrollment: number | null;
  gok_tsc_male: number | null;
  gok_tsc_female: number | null;
  local_authority_male: number | null;
  local_authority_female: number | null;
  pta_bog_male: number | null;
  pta_bog_female: number | null;
  others_male: number | null;
  others_female: number | null;
  non_teaching_staff_male: number | null;
  non_teaching_staff_female: number | null;
  geolocation: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  school_id: string;
  name: string;
  grade_level: number | null;
  academic_year: string | null;
  created_at: string;
  updated_at: string;
}

export interface SchoolMember {
  id: string;
  school_id: string;
  profile_id: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
