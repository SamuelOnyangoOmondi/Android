import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { useDashboardSnapshot } from "@/hooks/useDashboard";
import { UserCheck, UserX, UtensilsCrossed, Users } from "lucide-react";

const Analytics = () => {
  const [schoolId, setSchoolId] = useState("");
  const date = new Date().toISOString().split("T")[0];

  const { data: snapshot, isLoading } = useDashboardSnapshot({
    schoolId: schoolId || undefined,
    date,
  });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-violet-600 to-purple-700 p-6 rounded-xl shadow-md border border-violet-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Analytics
          </h1>
          <p className="text-white/80 max-w-2xl">
            Live attendance and meal KPIs. Data updates as Farm to Feed and SupaSchool record events.
          </p>
        </div>

        <div className="space-y-4">
          <SchoolFilter value={schoolId} onValueChange={setSchoolId} />
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-8 bg-muted animate-pulse rounded" />
                  <div className="mt-2 h-10 bg-muted animate-pulse rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{snapshot?.activeStudents ?? 0}</div>
                <p className="text-xs text-muted-foreground">In selected scope</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{snapshot?.attendance?.present ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  {snapshot?.attendanceCoverage ?? 0}% coverage
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
                <UserX className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{snapshot?.attendance?.absent ?? 0}</div>
                <p className="text-xs text-muted-foreground">Recorded absences</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Meals Served Today</CardTitle>
                <UtensilsCrossed className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{snapshot?.meals?.total ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  {snapshot?.mealCoverage ?? 0}% coverage
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Attendance Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">
              {snapshot?.date ? new Date(snapshot.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : ""}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                <span className="text-green-700">Present</span>
                <span className="font-bold">{snapshot?.attendance?.present ?? 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-50">
                <span className="text-red-700">Absent</span>
                <span className="font-bold">{snapshot?.attendance?.absent ?? 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50">
                <span className="text-yellow-700">Late</span>
                <span className="font-bold">{snapshot?.attendance?.late ?? 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50">
                <span className="text-blue-700">Excused</span>
                <span className="font-bold">{snapshot?.attendance?.excused ?? 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
