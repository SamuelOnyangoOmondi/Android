import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import { useClasses } from "@/hooks/useClasses";
import { useStudents } from "@/hooks/useStudents";
import {
  Award,
  BookOpenCheck,
  ClipboardList,
  FileSpreadsheet,
  Plus,
  Search,
  TrendingUp,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type DbStudent = Tables<"students">;

type DemoExam = {
  id: string;
  name: string;
  term: string;
  year: number;
  status: "draft" | "published";
};

const demoExams: DemoExam[] = [
  { id: "midterm-1", name: "Midterm", term: "Term 1", year: 2026, status: "published" },
  { id: "endterm-1", name: "Endterm", term: "Term 1", year: 2026, status: "draft" },
];

export default function ExamsPage() {
  const [schoolId, setSchoolId] = useState("");
  const [classId, setClassId] = useState("");
  const [activeTab, setActiveTab] = useState("gradebook");
  const [search, setSearch] = useState("");

  const [selectedExamId, setSelectedExamId] = useState<string>(demoExams[0]?.id ?? "");
  const selectedExam = demoExams.find((e) => e.id === selectedExamId) ?? demoExams[0];

  const { data: classes } = useClasses(schoolId || undefined);
  const { data: students = [], isLoading } = useStudents({
    schoolId,
    classId: classId || undefined,
    search: search || undefined,
    isActive: true,
  });

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const name = `${s.first_name} ${s.last_name}`.toLowerCase();
      return (
        name.includes(q) ||
        s.admission_number.toLowerCase().includes(q) ||
        (s.nemis_id?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [students, search]);

  const [scores, setScores] = useState<Record<string, { math?: string; eng?: string; sci?: string }>>({});

  const setScore = (studentId: string, subject: "math" | "eng" | "sci", value: string) => {
    setScores((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [subject]: value },
    }));
  };

  const saveDraft = () => {
    // UI is ready; connect to Supabase tables for exam_sessions + grades later.
    console.log("Saving draft scores", { selectedExamId, schoolId, classId, scores });
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-rose-600 to-red-700 p-6 rounded-xl shadow-md border border-rose-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">Exams & Grades</h1>
          <p className="text-white/80 max-w-2xl">
            Create exam sessions, capture scores, and generate gradebook summaries and report cards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Scope</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>School</Label>
                  <SchoolFilter value={schoolId} onValueChange={setSchoolId} />
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select
                    value={classId || "__all__"}
                    onValueChange={(v) => setClassId(v === "__all__" ? "" : v)}
                    disabled={!schoolId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={!schoolId ? "Select school first" : "All classes"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">All classes</SelectItem>
                      {classes?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Exam session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={selectedExamId} onValueChange={setSelectedExamId} disabled={!schoolId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {demoExams.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name} • {e.term} {e.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedExam && (
                  <div className="flex items-center justify-between rounded-lg border p-3 bg-white">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{selectedExam.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedExam.term} • {selectedExam.year}
                      </p>
                    </div>
                    <Badge variant={selectedExam.status === "published" ? "secondary" : "outline"}>
                      {selectedExam.status}
                    </Badge>
                  </div>
                )}
                <Button variant="outline" className="w-full" disabled={!schoolId}>
                  <Plus className="h-4 w-4 mr-2" />
                  New exam session
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Search students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Name, admission #, NEMIS..."
                    className="pl-10"
                    disabled={!schoolId}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {!schoolId ? (
              <EmptyState
                icon={Award}
                title="Select a school"
                description="Choose a school to start recording exams and grades."
              />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="gradebook" className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Gradebook</span>
                  </TabsTrigger>
                  <TabsTrigger value="assessments" className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    <span>Assessments</span>
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Insights</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="gradebook" className="space-y-6">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Gradebook</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Enter scores per student. Connect to Supabase when ready.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={saveDraft}>
                          Save draft
                        </Button>
                        <Button disabled>
                          <BookOpenCheck className="h-4 w-4 mr-2" />
                          Publish
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="py-12 text-center text-muted-foreground">Loading roster...</div>
                      ) : filteredStudents.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                          No students found for this scope. Add students first.
                        </div>
                      ) : (
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Student</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Admission #</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Math</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">English</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Science</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {filteredStudents.slice(0, 50).map((s: DbStudent) => (
                                <tr key={s.id} className="bg-white">
                                  <td className="px-4 py-3 text-sm text-gray-900">
                                    {s.first_name} {s.last_name}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-500">{s.admission_number}</td>
                                  <td className="px-4 py-3">
                                    <Input
                                      value={scores[s.id]?.math ?? ""}
                                      onChange={(e) => setScore(s.id, "math", e.target.value)}
                                      placeholder="0-100"
                                      className="h-9 w-24"
                                    />
                                  </td>
                                  <td className="px-4 py-3">
                                    <Input
                                      value={scores[s.id]?.eng ?? ""}
                                      onChange={(e) => setScore(s.id, "eng", e.target.value)}
                                      placeholder="0-100"
                                      className="h-9 w-24"
                                    />
                                  </td>
                                  <td className="px-4 py-3">
                                    <Input
                                      value={scores[s.id]?.sci ?? ""}
                                      onChange={(e) => setScore(s.id, "sci", e.target.value)}
                                      placeholder="0-100"
                                      className="h-9 w-24"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {filteredStudents.length > 50 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Showing first 50 students for performance. We can paginate when the exams schema is live.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="assessments" className="space-y-6">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Assessments</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Configure subjects, grading scales, and exam templates.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg border p-4 bg-white">
                          <p className="font-medium">Subjects</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Define subject list per school and grade.
                          </p>
                          <Button className="mt-3" variant="outline" disabled>
                            Manage subjects
                          </Button>
                        </div>
                        <div className="rounded-lg border p-4 bg-white">
                          <p className="font-medium">Grading scale</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Configure grade bands (A–E) and pass marks.
                          </p>
                          <Button className="mt-3" variant="outline" disabled>
                            Configure scale
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="insights" className="space-y-6">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Insights</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Performance trends and top/bottom students per subject.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <EmptyState
                        icon={TrendingUp}
                        title="Insights will appear here"
                        description="Once exams are stored in Supabase, we’ll compute averages, distributions, and trends."
                        action={
                          <Button variant="outline" disabled>
                            Generate summary (coming soon)
                          </Button>
                        }
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

