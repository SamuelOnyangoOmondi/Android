import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import { useClasses } from "@/hooks/useClasses";
import {
  Calendar,
  Clock,
  Edit3,
  LayoutGrid,
  Plus,
  User,
} from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const PERIODS = ["8:00", "9:00", "10:00", "11:00", "12:00", "14:00", "15:00"];

const demoSlots: Record<string, string> = {
  "Mon-0": "Math",
  "Mon-1": "English",
  "Mon-2": "Science",
  "Mon-3": "Break",
  "Tue-0": "English",
  "Tue-1": "Math",
  "Tue-2": "Social Studies",
  "Wed-0": "Science",
  "Wed-1": "English",
  "Thu-0": "Math",
  "Thu-2": "P.E.",
  "Fri-0": "Art",
  "Fri-1": "Music",
};

export default function TimetablePage() {
  const [schoolId, setSchoolId] = useState("");
  const [classId, setClassId] = useState("");
  const [activeTab, setActiveTab] = useState("view");

  const { data: classes } = useClasses(schoolId || undefined);

  const getSlot = (dayIdx: number, periodIdx: number) => {
    const key = `${DAYS[dayIdx]}-${periodIdx}`;
    return demoSlots[key] ?? "—";
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-sky-600 to-cyan-700 p-6 rounded-xl shadow-md border border-sky-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">Timetable</h1>
          <p className="text-white/80 max-w-2xl">
            View and manage class schedules. Assign subjects to periods and sync with teacher availability.
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
                  <label className="text-sm font-medium">School</label>
                  <SchoolFilter value={schoolId} onValueChange={setSchoolId} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Class</label>
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
                <CardTitle className="text-lg font-medium">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" disabled={!schoolId}>
                  <Plus className="h-4 w-4 mr-2" />
                  New timetable
                </Button>
                <Button variant="outline" className="w-full" disabled={!schoolId}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit slots
                </Button>
                <Button variant="outline" className="w-full" disabled={!schoolId}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Copy from term
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Sample timetable shown. Add Supabase tables for <code className="text-xs bg-muted px-1 rounded">timetable_slots</code> and <code className="text-xs bg-muted px-1 rounded">periods</code> to persist schedules.</p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {!schoolId ? (
              <EmptyState
                icon={LayoutGrid}
                title="Select a school"
                description="Choose a school to view and manage timetables."
              />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="view" className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4" />
                    <span>By class</span>
                  </TabsTrigger>
                  <TabsTrigger value="teacher" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>By teacher</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="view" className="space-y-6">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Weekly timetable</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {classId ? classes?.find((c) => c.id === classId)?.name ?? "Class" : "All classes"} • Sample data
                        </p>
                      </div>
                      <Button variant="outline" disabled>
                        <Clock className="h-4 w-4 mr-2" />
                        Set periods
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[600px]">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border px-3 py-2 text-left text-sm font-medium text-gray-500 w-20">Time</th>
                              {DAYS.map((d) => (
                                <th key={d} className="border px-3 py-2 text-center text-sm font-medium text-gray-500">
                                  {d}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {PERIODS.map((period, pIdx) => (
                              <tr key={period} className="bg-white">
                                <td className="border px-3 py-2 text-sm text-muted-foreground font-medium">
                                  {period}
                                </td>
                                {DAYS.map((_, dIdx) => (
                                  <td key={dIdx} className="border px-3 py-2 text-center text-sm">
                                    <span className="inline-block px-2 py-1 rounded bg-sky-50 text-sky-800 min-w-[4rem]">
                                      {getSlot(dIdx, pIdx)}
                                    </span>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="teacher" className="space-y-6">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Teacher schedule</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        View timetable by teacher. Connect to teacher assignments when ready.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <EmptyState
                        icon={User}
                        title="Teacher view coming soon"
                        description="Select a teacher to see their weekly schedule. Requires teacher-subject-class assignments in Supabase."
                        action={
                          <Button variant="outline" disabled>
                            Select teacher
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
