
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarCheck, FileSpreadsheet, AlertCircle, Search, UserCheck, UserX, Users, ClipboardCheck } from "lucide-react";
import { AttendanceRecording } from "@/components/attendance/AttendanceRecording";
import { AttendanceReports } from "@/components/attendance/AttendanceReports";
import { AttendanceStats } from "@/components/attendance/AttendanceStats";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { useAttendanceSummary } from "@/hooks/useAttendance";
import { useStudents } from "@/hooks/useStudents";

const Attendance = () => {
  const [activeTab, setActiveTab] = useState<string>("record");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [schoolId, setSchoolId] = useState("");
  const dateStr = selectedDate?.toISOString().split("T")[0] ?? "";

  const { data: summary } = useAttendanceSummary({
    schoolId: schoolId || undefined,
    attendanceDate: dateStr,
  });

  const { data: students = [] } = useStudents({
    schoolId,
    isActive: true,
  });
  const totalStudents = students.length;
  const numberRecorded = summary?.total ?? 0;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-xl shadow-md border border-blue-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Student Attendance
          </h1>
          <p className="text-white/80 max-w-2xl">
            Track daily attendance, view reports, and monitor attendance patterns across classes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Date Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Selected: <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">School</CardTitle>
              </CardHeader>
              <CardContent>
                <SchoolFilter value={schoolId} onValueChange={setSchoolId} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-700">Present</span>
                  </div>
                  <span className="font-bold">{summary?.present ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                  <div className="flex items-center">
                    <UserX className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-700">Absent</span>
                  </div>
                  <span className="font-bold">{summary?.absent ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-700">Late</span>
                  </div>
                  <span className="font-bold">{summary?.late ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-700">Excused</span>
                  </div>
                  <span className="font-bold">{summary?.excused ?? 0}</span>
                </div>
                <div className="border-t pt-3 mt-3 space-y-2">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-slate-600 mr-2" />
                      <span className="text-slate-700">Total students</span>
                    </div>
                    <span className="font-bold">{totalStudents}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                    <div className="flex items-center">
                      <ClipboardCheck className="h-5 w-5 text-slate-600 mr-2" />
                      <span className="text-slate-700">Recorded</span>
                    </div>
                    <span className="font-bold">{numberRecorded}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Tabs
              defaultValue="record"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="record" className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4" />
                  <span>Record Attendance</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Reports</span>
                </TabsTrigger>
                <TabsTrigger value="statistics" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Statistics</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="record" className="space-y-4">
                <AttendanceRecording selectedDate={selectedDate} schoolId={schoolId} />
              </TabsContent>
              
              <TabsContent value="reports" className="space-y-4">
                <AttendanceReports />
              </TabsContent>
              
              <TabsContent value="statistics" className="space-y-4">
                <AttendanceStats />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
