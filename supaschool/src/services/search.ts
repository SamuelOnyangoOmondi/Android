import { supabase } from "@/integrations/supabase/client";

export type SearchResultType = "student" | "teacher" | "class" | "school" | "page";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  url: string;
};

export type SearchFilters = {
  students?: boolean;
  teachers?: boolean;
  classes?: boolean;
  schools?: boolean;
  pages?: boolean;
};

const PAGE_RESULTS: SearchResult[] = [
  { id: "attendance", type: "page", title: "Attendance", url: "/attendance" },
  { id: "meals", type: "page", title: "Meals", url: "/meals" },
  { id: "reports", type: "page", title: "Reports", url: "/reports" },
  { id: "analytics", type: "page", title: "Analytics", url: "/analytics" },
  { id: "students", type: "page", title: "Students", url: "/students" },
  { id: "classes", type: "page", title: "Classes", url: "/classes" },
  { id: "curriculum", type: "page", title: "Curriculum", url: "/curriculum" },
  { id: "exams", type: "page", title: "Exams & Grades", url: "/exams" },
  { id: "schools", type: "page", title: "Schools", url: "/schools" },
  { id: "teachers", type: "page", title: "Teachers", url: "/teachers" },
  { id: "flami", type: "page", title: "FLAMI AI Assistant", url: "/flami" },
];

const SUBJECTS = ["Mathematics", "English", "Science", "Social Studies", "ICT", "Agriculture"];

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, " ");
}

function matchesSearch(text: string | null | undefined, query: string): boolean {
  if (!text) return false;
  return normalizeQuery(text).includes(normalizeQuery(query));
}

export async function searchGlobal(
  query: string,
  filters?: SearchFilters
): Promise<{ students: SearchResult[]; teachers: SearchResult[]; classes: SearchResult[]; schools: SearchResult[]; pages: SearchResult[] }> {
  const q = query.trim();
  const results = {
    students: [] as SearchResult[],
    teachers: [] as SearchResult[],
    classes: [] as SearchResult[],
    schools: [] as SearchResult[],
    pages: [] as SearchResult[],
  };

  if (!q || q.length < 2) {
    return results;
  }

  const showAll = !filters || Object.keys(filters).length === 0;
  const includeStudents = showAll || filters?.students !== false;
  const includeTeachers = showAll || filters?.teachers !== false;
  const includeClasses = showAll || filters?.classes !== false;
  const includeSchools = showAll || filters?.schools !== false;
  const includePages = showAll || filters?.pages !== false;

  const searchPattern = `%${q}%`;

  const promises: Promise<void>[] = [];

  if (includeStudents) {
    promises.push(
      (async () => {
        const { data } = await supabase
          .from("students")
          .select("id, first_name, last_name, admission_number, class_id, school_id")
          .or(`first_name.ilike.${searchPattern},last_name.ilike.${searchPattern},admission_number.ilike.${searchPattern},nemis_id.ilike.${searchPattern}`)
          .eq("is_active", true)
          .limit(5);

        if (data?.length) {
          const schoolIds = [...new Set(data.map((s) => s.school_id))];
          const { data: schools } = await supabase.from("schools").select("id, name").in("id", schoolIds);
          const schoolMap = new Map((schools || []).map((s) => [s.id, s.name]));

          const classIds = data.map((s) => s.class_id).filter(Boolean) as string[];
          const { data: classes } =
            classIds.length > 0 ? await supabase.from("classes").select("id, name").in("id", classIds) : { data: [] };
          const classMap = new Map((classes || []).map((c) => [c.id, c.name]));

          results.students = data.map((s) => ({
            id: s.id,
            type: "student" as const,
            title: `${s.first_name} ${s.last_name}`,
            subtitle: [classMap.get(s.class_id || "") || "—", schoolMap.get(s.school_id) || "—"].join(" · "),
            url: `/students?student=${s.id}`,
          }));
        }
      })()
    );
  }

  if (includeTeachers) {
    promises.push(
      (async () => {
        const { data } = await supabase
          .from("user_profiles")
          .select("id, full_name, email")
          .or(`full_name.ilike.${searchPattern},email.ilike.${searchPattern}`)
          .limit(5);

        if (data) {
          results.teachers = data.map((u) => ({
            id: u.id,
            type: "teacher" as const,
            title: u.full_name || u.email || "Unknown",
            subtitle: "Staff",
            url: `/teachers?user=${u.id}`,
          }));
        }
      })()
    );
  }

  if (includeClasses) {
    promises.push(
      (async () => {
        const { data } = await supabase
          .from("classes")
          .select("id, name, grade_level, stream, school_id")
          .or(`name.ilike.${searchPattern},grade_level.ilike.${searchPattern},stream.ilike.${searchPattern}`)
          .eq("is_active", true)
          .limit(5);

        if (data) {
          const { data: schools } = await supabase.from("schools").select("id, name").in("id", data.map((c) => c.school_id));
          const schoolMap = new Map((schools || []).map((s) => [s.id, s.name]));

          results.classes = data.map((c) => ({
            id: c.id,
            type: "class" as const,
            title: c.name,
            subtitle: schoolMap.get(c.school_id) || "—",
            url: `/classes?class=${c.id}`,
          }));
        }
      })()
    );
  }

  if (includeSchools) {
    promises.push(
      (async () => {
        const { data } = await supabase
          .from("schools")
          .select("id, name, county, location")
          .or(`name.ilike.${searchPattern},county.ilike.${searchPattern},location.ilike.${searchPattern},constituency.ilike.${searchPattern}`)
          .limit(5);

        if (data) {
          results.schools = data.map((s) => ({
            id: s.id,
            type: "school" as const,
            title: s.name,
            subtitle: [s.county, s.location].filter(Boolean).join(" · ") || undefined,
            url: `/schools?school=${s.id}`,
          }));
        }
      })()
    );
  }

  if (includePages) {
    const nq = normalizeQuery(q);
    const pageMatches = PAGE_RESULTS.filter((p) => normalizeQuery(p.title).includes(nq));
    const subjectMatches = SUBJECTS.filter((s) => normalizeQuery(s).includes(nq)).map((s) => ({
      id: `subject-${s}`,
      type: "page" as const,
      title: s,
      subtitle: "Curriculum",
      url: "/curriculum",
    }));
    results.pages = [...pageMatches, ...subjectMatches].slice(0, 5);
  }

  await Promise.all(promises);

  return results;
}
