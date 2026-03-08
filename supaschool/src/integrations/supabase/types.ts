export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          boys_toilets: number | null
          constituency: string | null
          county: string | null
          created_at: string | null
          district: string | null
          division: string | null
          geolocation: string | null
          girls_toilets: number | null
          gok_tsc_female: number | null
          gok_tsc_male: number | null
          id: string
          institution_type_1: string | null
          institution_type_2: string | null
          institution_type_3: string | null
          level_of_education: string | null
          local_authority_female: number | null
          local_authority_male: number | null
          location: string | null
          name: string
          non_teaching_staff_female: number | null
          non_teaching_staff_male: number | null
          others_female: number | null
          others_male: number | null
          province: string | null
          pta_bog_female: number | null
          pta_bog_male: number | null
          pupil_classroom_ratio: number | null
          pupil_teacher_ratio: number | null
          pupil_toilet_ratio: number | null
          school_status: string | null
          sponsor: string | null
          teachers_toilets: number | null
          total_boys: number | null
          total_classrooms: number | null
          total_enrollment: number | null
          total_girls: number | null
          total_toilets: number | null
          updated_at: string | null
        }
        Insert: {
          boys_toilets?: number | null
          constituency?: string | null
          county?: string | null
          created_at?: string | null
          district?: string | null
          division?: string | null
          geolocation?: string | null
          girls_toilets?: number | null
          gok_tsc_female?: number | null
          gok_tsc_male?: number | null
          id?: string
          institution_type_1?: string | null
          institution_type_2?: string | null
          institution_type_3?: string | null
          level_of_education?: string | null
          local_authority_female?: number | null
          local_authority_male?: number | null
          location?: string | null
          name: string
          non_teaching_staff_female?: number | null
          non_teaching_staff_male?: number | null
          others_female?: number | null
          others_male?: number | null
          province?: string | null
          pta_bog_female?: number | null
          pta_bog_male?: number | null
          pupil_classroom_ratio?: number | null
          pupil_teacher_ratio?: number | null
          pupil_toilet_ratio?: number | null
          school_status?: string | null
          sponsor?: string | null
          teachers_toilets?: number | null
          total_boys?: number | null
          total_classrooms?: number | null
          total_enrollment?: number | null
          total_girls?: number | null
          total_toilets?: number | null
          updated_at?: string | null
        }
        Update: {
          boys_toilets?: number | null
          constituency?: string | null
          county?: string | null
          created_at?: string | null
          district?: string | null
          division?: string | null
          geolocation?: string | null
          girls_toilets?: number | null
          gok_tsc_female?: number | null
          gok_tsc_male?: number | null
          id?: string
          institution_type_1?: string | null
          institution_type_2?: string | null
          institution_type_3?: string | null
          level_of_education?: string | null
          local_authority_female?: number | null
          local_authority_male?: number | null
          location?: string | null
          name?: string
          non_teaching_staff_female?: number | null
          non_teaching_staff_male?: number | null
          others_female?: number | null
          others_male?: number | null
          province?: string | null
          pta_bog_female?: number | null
          pta_bog_male?: number | null
          pupil_classroom_ratio?: number | null
          pupil_teacher_ratio?: number | null
          pupil_toilet_ratio?: number | null
          school_status?: string | null
          sponsor?: string | null
          teachers_toilets?: number | null
          total_boys?: number | null
          total_classrooms?: number | null
          total_enrollment?: number | null
          total_girls?: number | null
          total_toilets?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: Database["public"]["Enums"]["app_role"]
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role?: Database["public"]["Enums"]["app_role"]
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: Database["public"]["Enums"]["app_role"]
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      school_users: {
        Row: {
          id: string
          school_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "school_users_school_id_fkey"; columns: ["school_id"]; referencedRelation: "schools"; referencedColumns: ["id"] },
          { foreignKeyName: "school_users_user_id_fkey"; columns: ["user_id"]; referencedRelation: "user_profiles"; referencedColumns: ["id"] }
        ]
      }
      classes: {
        Row: {
          id: string
          school_id: string
          name: string
          grade_level: string | null
          stream: string | null
          teacher_name: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          grade_level?: string | null
          stream?: string | null
          teacher_name?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          grade_level?: string | null
          stream?: string | null
          teacher_name?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [{ foreignKeyName: "classes_school_id_fkey"; columns: ["school_id"]; referencedRelation: "schools"; referencedColumns: ["id"] }]
      }
      students: {
        Row: {
          id: string
          school_id: string
          class_id: string | null
          admission_number: string
          nemis_id: string | null
          first_name: string
          last_name: string
          gender: string | null
          date_of_birth: string | null
          guardian_name: string | null
          guardian_phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          class_id?: string | null
          admission_number: string
          nemis_id?: string | null
          first_name: string
          last_name: string
          gender?: string | null
          date_of_birth?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          class_id?: string | null
          admission_number?: string
          nemis_id?: string | null
          first_name?: string
          last_name?: string
          gender?: string | null
          date_of_birth?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "students_school_id_fkey"; columns: ["school_id"]; referencedRelation: "schools"; referencedColumns: ["id"] },
          { foreignKeyName: "students_class_id_fkey"; columns: ["class_id"]; referencedRelation: "classes"; referencedColumns: ["id"] }
        ]
      }
      attendance_records: {
        Row: {
          id: string
          student_id: string
          school_id: string
          class_id: string | null
          attendance_date: string
          status: Database["public"]["Enums"]["attendance_status"]
          notes: string | null
          recorded_by: string | null
          source: Database["public"]["Enums"]["record_source"]
          device_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          school_id: string
          class_id?: string | null
          attendance_date: string
          status: Database["public"]["Enums"]["attendance_status"]
          notes?: string | null
          recorded_by?: string | null
          source?: Database["public"]["Enums"]["record_source"]
          device_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          school_id?: string
          class_id?: string | null
          attendance_date?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          notes?: string | null
          recorded_by?: string | null
          source?: Database["public"]["Enums"]["record_source"]
          device_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "attendance_records_student_id_fkey"; columns: ["student_id"]; referencedRelation: "students"; referencedColumns: ["id"] },
          { foreignKeyName: "attendance_records_school_id_fkey"; columns: ["school_id"]; referencedRelation: "schools"; referencedColumns: ["id"] },
          { foreignKeyName: "attendance_records_class_id_fkey"; columns: ["class_id"]; referencedRelation: "classes"; referencedColumns: ["id"] }
        ]
      }
      meal_records: {
        Row: {
          id: string
          student_id: string
          school_id: string
          class_id: string | null
          meal_date: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          served: boolean
          quantity: number
          notes: string | null
          recorded_by: string | null
          source: Database["public"]["Enums"]["record_source"]
          device_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          school_id: string
          class_id?: string | null
          meal_date: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          served?: boolean
          quantity?: number
          notes?: string | null
          recorded_by?: string | null
          source?: Database["public"]["Enums"]["record_source"]
          device_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          school_id?: string
          class_id?: string | null
          meal_date?: string
          meal_type?: Database["public"]["Enums"]["meal_type"]
          served?: boolean
          quantity?: number
          notes?: string | null
          recorded_by?: string | null
          source?: Database["public"]["Enums"]["record_source"]
          device_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "meal_records_student_id_fkey"; columns: ["student_id"]; referencedRelation: "students"; referencedColumns: ["id"] },
          { foreignKeyName: "meal_records_school_id_fkey"; columns: ["school_id"]; referencedRelation: "schools"; referencedColumns: ["id"] },
          { foreignKeyName: "meal_records_class_id_fkey"; columns: ["class_id"]; referencedRelation: "classes"; referencedColumns: ["id"] }
        ]
      }
      device_registrations: {
        Row: {
          id: string
          school_id: string | null
          device_code: string
          device_name: string | null
          platform: string | null
          is_active: boolean
          last_seen_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id?: string | null
          device_code: string
          device_name?: string | null
          platform?: string | null
          is_active?: boolean
          last_seen_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string | null
          device_code?: string
          device_name?: string | null
          platform?: string | null
          is_active?: boolean
          last_seen_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      sync_events: {
        Row: {
          id: string
          external_event_id: string | null
          source: Database["public"]["Enums"]["record_source"]
          event_type: string
          payload: Json
          sync_status: Database["public"]["Enums"]["sync_status"]
          error_message: string | null
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          external_event_id?: string | null
          source: Database["public"]["Enums"]["record_source"]
          event_type: string
          payload: Json
          sync_status?: Database["public"]["Enums"]["sync_status"]
          error_message?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          external_event_id?: string | null
          source?: Database["public"]["Enums"]["record_source"]
          event_type?: string
          payload?: Json
          sync_status?: Database["public"]["Enums"]["sync_status"]
          error_message?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "super_admin" | "county_admin" | "school_admin" | "teacher" | "feeding_staff" | "viewer"
      attendance_status: "present" | "absent" | "late" | "excused"
      meal_type: "breakfast" | "lunch" | "supper" | "snack"
      record_source: "supaschool" | "farm_to_feed" | "import" | "api" | "backfill"
      sync_status: "received" | "processed" | "failed" | "duplicate"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
