import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Filter, Printer, Search, Loader2 } from "lucide-react";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { useAttendanceRecords } from "@/hooks/useAttendance";
import { useClasses } from "@/hooks/useClasses";
import { format } from "date-fns";

export const AttendanceReports = () => {
  const [schoolId, setSchoolId] = useState("");
  const [classId, setClassId] = useState("all");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data: records = [], isLoading } = useAttendanceRecords({
    schoolId: schoolId || undefined,
    classId: classId === "all" ? undefined : classId,
    attendanceDate,
  });

  const { data: classes } = useClasses(schoolId);

  const filteredRecords = records.filter((r) => {
    if (!searchQuery.trim()) return true;
    const student = r.students as { first_name?: string; last_name?: string; admission_number?: string } | null;
    if (!student) return false;
    const name = `${student.first_name ?? ""} ${student.last_name ?? ""}`.toLowerCase();
    const adm = (student.admission_number ?? "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || adm.includes(q);
  });

  const handleExportCSV = () => {
    const headers = ["Student", "Class", "Date", "Status", "Note"];
    const rows = filteredRecords.map((r) => {
      const student = r.students as { first_name?: string; last_name?: string } | null;
      const cls = r.classes as { name?: string } | null;
      const name = student ? `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() : "";
      return [name, cls?.name ?? "", r.attendance_date, r.status, r.notes ?? ""];
    });
    const csv = [headers.join(","), ...rows.map((row) => row.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${attendanceDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Attendance Reports</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={filteredRecords.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} disabled={filteredRecords.length === 0} title="Print or Save as PDF">
            <Printer className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/4">
            <Label htmlFor="school">School</Label>
            <SchoolFilter value={schoolId} onValueChange={setSchoolId} />
          </div>
          <div className="w-full md:w-1/4">
            <Label htmlFor="class-filter">Class</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger id="class-filter">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/4">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/4">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No attendance records for the selected filters.
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary">
                  <th className="text-left py-2 px-4 border-b">Student Name</th>
                  <th className="text-left py-2 px-4 border-b">Class</th>
                  <th className="text-left py-2 px-4 border-b">Date</th>
                  <th className="text-left py-2 px-4 border-b">Status</th>
                  <th className="text-left py-2 px-4 border-b">Note</th>
                  <th className="text-left py-2 px-4 border-b">Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((row) => {
                  const student = row.students as { first_name?: string; last_name?: string } | null;
                  const cls = row.classes as { name?: string } | null;
                  const name = student ? `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() : "—";
                  return (
                    <tr key={row.id} className="hover:bg-muted">
                      <td className="py-2 px-4 border-b">{name}</td>
                      <td className="py-2 px-4 border-b">{cls?.name ?? "—"}</td>
                      <td className="py-2 px-4 border-b">{format(new Date(row.attendance_date), "PPP")}</td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs capitalize ${
                            row.status === "present"
                              ? "bg-green-100 text-green-800"
                              : row.status === "absent"
                              ? "bg-red-100 text-red-800"
                              : row.status === "late"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">{row.notes ?? ""}</td>
                      <td className="py-2 px-4 border-b text-muted-foreground">{row.source ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
