import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  BookOpen,
  ClipboardList,
  FileText,
  Search,
  Upload,
  Layers,
  Sparkles,
} from "lucide-react";

type Subject = {
  id: string;
  name: string;
  gradeBand: string;
  strands: number;
  updatedAt: string;
};

const demoSubjects: Subject[] = [
  { id: "math", name: "Mathematics", gradeBand: "Grade 1–8", strands: 6, updatedAt: "2026-03-06" },
  { id: "eng", name: "English", gradeBand: "Grade 1–8", strands: 5, updatedAt: "2026-03-06" },
  { id: "sci", name: "Science & Technology", gradeBand: "Grade 4–8", strands: 7, updatedAt: "2026-03-06" },
  { id: "sst", name: "Social Studies", gradeBand: "Grade 1–8", strands: 4, updatedAt: "2026-03-06" },
];

export default function CurriculumPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [schoolId, setSchoolId] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");

  const filteredSubjects = useMemo(() => {
    const q = subjectSearch.trim().toLowerCase();
    if (!q) return demoSubjects;
    return demoSubjects.filter((s) => s.name.toLowerCase().includes(q));
  }, [subjectSearch]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-indigo-600 to-fuchsia-700 p-6 rounded-xl shadow-md border border-indigo-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">Curriculum</h1>
          <p className="text-white/80 max-w-2xl">
            Organize subjects, schemes of work, lesson plans, and learning resources. This page is
            designed to be extended once curriculum tables are added in Supabase.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">School</CardTitle>
              </CardHeader>
              <CardContent>
                <SchoolFilter value={schoolId} onValueChange={setSchoolId} />
                <p className="mt-2 text-xs text-muted-foreground">
                  Curriculum content is scoped per school.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" disabled={!schoolId}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload resources
                </Button>
                <Button variant="outline" className="w-full" disabled={!schoolId}>
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Create lesson plan
                </Button>
                <Button variant="outline" className="w-full" disabled={!schoolId}>
                  <Layers className="h-4 w-4 mr-2" />
                  Create scheme of work
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border p-3 bg-white">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium">Coverage</span>
                  </div>
                  <Badge variant="secondary">Prototype</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 bg-white">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-fuchsia-700" />
                    <span className="text-sm font-medium">Resources</span>
                  </div>
                  <Badge variant="secondary">Ready</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {!schoolId ? (
              <EmptyState
                icon={BookOpen}
                title="Select a school"
                description="Choose a school to manage subjects and curriculum resources."
              />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="subjects" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    <span>Subjects</span>
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Resources</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Subjects</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{demoSubjects.length}</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Available subject templates
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Schemes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">—</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Add a Supabase table to activate
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Lesson plans</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">—</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Add a Supabase table to activate
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>What’s next</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        When you’re ready, we can add `subjects`, `schemes_of_work`, `lesson_plans`,
                        and `resources` tables in Supabase and switch these cards to live data.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg border p-4 bg-white">
                          <p className="font-medium">Recommended schema</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Subject templates + per-school customization.
                          </p>
                        </div>
                        <div className="rounded-lg border p-4 bg-white">
                          <p className="font-medium">Workflow</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Teacher creates plan → HOD approves → resources attached.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="subjects" className="space-y-6">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-xl">Subjects</CardTitle>
                      <Button variant="outline" disabled>
                        <Upload className="h-4 w-4 mr-2" />
                        Import (coming soon)
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative w-full md:w-1/2">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                          <Input
                            value={subjectSearch}
                            onChange={(e) => setSubjectSearch(e.target.value)}
                            placeholder="Search subjects..."
                            className="pl-10"
                          />
                        </div>
                        <div className="flex-1 text-sm text-muted-foreground flex items-center">
                          Showing {filteredSubjects.length} of {demoSubjects.length}
                        </div>
                      </div>

                      {filteredSubjects.length === 0 ? (
                        <div className="py-10 text-center text-muted-foreground">
                          No subjects match your search.
                        </div>
                      ) : (
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Subject</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Grade band</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Strands</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {filteredSubjects.map((s) => (
                                <tr key={s.id} className="bg-white">
                                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{s.name}</td>
                                  <td className="px-4 py-3 text-sm text-gray-500">{s.gradeBand}</td>
                                  <td className="px-4 py-3 text-sm text-gray-500">{s.strands}</td>
                                  <td className="px-4 py-3 text-right">
                                    <Badge variant="secondary">Template</Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources" className="space-y-6">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Resources</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Upload and tag PDFs, worksheets, and guides. Hook this up to Supabase Storage
                        when you’re ready.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <EmptyState
                        icon={Upload}
                        title="No resources yet"
                        description="Upload resources for teachers and students. (Storage integration coming next.)"
                        action={
                          <Button disabled>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload resource
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

