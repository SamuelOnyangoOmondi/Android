import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Search, Save, Check, X, Loader2, HelpCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { useStudents } from "@/hooks/useStudents";
import { useClasses } from "@/hooks/useClasses";
import { useAttendanceRecords, useUpsertAttendanceBatch } from "@/hooks/useAttendance";
import type { Tables } from "@/integrations/supabase/types";

type DbStudent = Tables<"students">;
type Status = "present" | "absent" | "late" | "excused";

interface AttendanceRecordingProps {
  selectedDate?: Date;
  schoolId?: string;
}

export const AttendanceRecording = ({ selectedDate, schoolId: propSchoolId }: AttendanceRecordingProps) => {
  const [schoolId, setSchoolId] = useState(propSchoolId ?? "");
  const [classId, setClassId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [localStatus, setLocalStatus] = useState<Record<string, Status>>({});

  const dateStr = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const effectiveSchoolId = propSchoolId ?? schoolId;

  const { data: students = [], isLoading } = useStudents({
    schoolId: effectiveSchoolId,
    classId: classId || undefined,
    search: searchTerm || undefined,
    isActive: true,
  });

  const { data: classes } = useClasses(effectiveSchoolId);
  const upsertMutation = useUpsertAttendanceBatch();

  const { data: attendanceRecords = [] } = useAttendanceRecords({
    schoolId: effectiveSchoolId || undefined,
    attendanceDate: dateStr,
  });

  const savedStatusByStudentId = useMemo(() => {
    const map = new Map<string, Status>();
    attendanceRecords.forEach((r: { student_id: string; status: Status }) => {
      map.set(r.student_id, r.status as Status);
    });
    return map;
  }, [attendanceRecords]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const t = searchTerm.toLowerCase();
    return students.filter(
      (s) =>
        s.first_name.toLowerCase().includes(t) ||
        s.last_name.toLowerCase().includes(t) ||
        s.admission_number.toLowerCase().includes(t) ||
        (s.nemis_id?.toLowerCase().includes(t) ?? false)
    );
  }, [students, searchTerm]);

  const markAttendance = (id: string, status: Status) => {
    setLocalStatus((prev) => ({ ...prev, [id]: status }));
  };

  const getStatus = (student: DbStudent): Status | null => {
    return localStatus[student.id] ?? savedStatusByStudentId.get(student.id) ?? null;
  };

  const saveAttendance = async () => {
    if (!effectiveSchoolId) {
      toast.error("Please select a school");
      return;
    }

    const toSave = filteredStudents
      .map((s) => {
        const status = getStatus(s);
        if (!status) return null;
        return {
          studentId: s.id,
          schoolId: s.school_id,
          classId: s.class_id,
          attendanceDate: dateStr,
          status,
          source: "supaschool" as const,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (toSave.length === 0) {
      toast.warning("Mark at least one student's attendance before saving");
      return;
    }

    const unrecorded = filteredStudents.filter((s) => !getStatus(s)).length;
    if (unrecorded > 0) {
      toast.warning(`Saving ${toSave.length} records. ${unrecorded} students still unrecorded.`);
    }

    try {
      await upsertMutation.mutateAsync(toSave);
      setLocalStatus((prev) => {
        const next = { ...prev };
        toSave.forEach(({ studentId }) => delete next[studentId]);
        return next;
      });
      toast.success(`Attendance saved for ${toSave.length} students`);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof (err as { message?: string })?.message === "string"
            ? (err as { message: string }).message
            : typeof (err as { details?: string })?.details === "string"
              ? (err as { details: string }).details
              : "Failed to save attendance";
      toast.error(msg);
    }
  };

  const getStatusColor = (status: Status | null) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border border-green-200";
      case "absent":
        return "bg-red-100 text-red-800 border border-red-200";
      case "late":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "excused":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-muted/60 text-muted-foreground border border-dashed border-muted-foreground/40";
    }
  };

  const getRowBg = (student: DbStudent) => {
    const status = getStatus(student);
    if (!status) return "bg-amber-50/50 border-l-4 border-amber-300";
    switch (status) {
      case "present":
        return "bg-green-50/70 border-l-4 border-green-400";
      case "absent":
        return "bg-red-50/50 border-l-4 border-red-400";
      case "late":
        return "bg-yellow-50/70 border-l-4 border-yellow-400";
      case "excused":
        return "bg-blue-50/50 border-l-4 border-blue-400";
      default:
        return "bg-white border-l-4 border-transparent";
    }
  };

  if (!effectiveSchoolId) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Record Daily Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a school in the sidebar to record attendance.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Record Daily Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Select value={classId || "__all__"} onValueChange={(v) => setClassId(v === "__all__" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="All classes" />
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search student name or admission number"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          {!propSchoolId && (
            <SchoolFilter value={schoolId} onValueChange={setSchoolId} className="w-64" />
          )}
          <span className="text-sm text-muted-foreground">
            Date: {selectedDate?.toLocaleDateString() ?? dateStr}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No students found. Add students in Manage Students first.
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Admission #</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      Actions
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                              aria-label="Actions help"
                            >
                              <HelpCircle className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-[240px]">
                            <p className="font-medium mb-1">Attendance actions</p>
                            <p className="text-xs text-muted-foreground">
                              ✓ Present · ✗ Absent · <strong>L</strong> Late · <strong>E</strong> Excused (e.g. sick, trip). Click one per student, then Save.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className={getRowBg(student)}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{student.admission_number}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getStatus(student))}`}
                      >
                        {getStatus(student)
                          ? getStatus(student)!.charAt(0).toUpperCase() + getStatus(student)!.slice(1)
                          : "— Not recorded"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-1">
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`rounded-full p-0 w-8 h-8 ${getStatus(student) === "present" ? "bg-green-100" : ""}`}
                                onClick={() => markAttendance(student.id, "present")}
                                aria-label="Mark present"
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Present</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`rounded-full p-0 w-8 h-8 ${getStatus(student) === "absent" ? "bg-red-100" : ""}`}
                                onClick={() => markAttendance(student.id, "absent")}
                                aria-label="Mark absent"
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Absent</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`rounded-full p-0 w-8 h-8 ${getStatus(student) === "late" ? "bg-yellow-100" : ""}`}
                                onClick={() => markAttendance(student.id, "late")}
                                aria-label="Mark late"
                              >
                                <span className="text-yellow-600 text-xs font-bold">L</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Late</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`rounded-full p-0 w-8 h-8 ${getStatus(student) === "excused" ? "bg-blue-100" : ""}`}
                                onClick={() => markAttendance(student.id, "excused")}
                                aria-label="Mark excused"
                              >
                                <span className="text-blue-600 text-xs font-bold">E</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excused (e.g. sick, school trip)</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            onClick={saveAttendance}
            className="bg-primary hover:bg-primary/90"
            disabled={upsertMutation.isPending || filteredStudents.length === 0}
          >
            {upsertMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Attendance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
