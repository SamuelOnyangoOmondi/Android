import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, UserX, AlertCircle, Info, Coffee, UtensilsCrossed, Moon, Cookie } from "lucide-react";
import { format } from "date-fns";
import type { SummaryStatsSnapshot } from "@/components/dashboard/SummaryStats";

interface TodayWidgetsProps {
  snapshot: SummaryStatsSnapshot | null | undefined;
}

export function TodayWidgets({ snapshot }: TodayWidgetsProps) {
  if (!snapshot) return null;

  const { attendance, meals } = snapshot;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Today&apos;s Attendance
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(new Date(snapshot.date), "PPP")} · {attendance.total} recorded
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50">
              <UserCheck className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="text-xs text-green-700 font-medium">Present</p>
                <p className="text-lg font-bold text-green-800">{attendance.present}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50">
              <UserX className="h-5 w-5 text-red-600 shrink-0" />
              <div>
                <p className="text-xs text-red-700 font-medium">Absent</p>
                <p className="text-lg font-bold text-red-800">{attendance.absent}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
              <div>
                <p className="text-xs text-yellow-700 font-medium">Late</p>
                <p className="text-lg font-bold text-yellow-800">{attendance.late}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50">
              <Info className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs text-blue-700 font-medium">Excused</p>
                <p className="text-lg font-bold text-blue-800">{attendance.excused}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-amber-600" />
            Meals Served Today
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(new Date(snapshot.date), "PPP")} · {meals.total} total
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50">
              <Coffee className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs text-amber-700 font-medium">Breakfast</p>
                <p className="text-lg font-bold text-amber-800">{meals.breakfast}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50">
              <UtensilsCrossed className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs text-amber-700 font-medium">Lunch</p>
                <p className="text-lg font-bold text-amber-800">{meals.lunch}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50">
              <Moon className="h-5 w-5 text-slate-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-700 font-medium">Supper</p>
                <p className="text-lg font-bold text-slate-800">{meals.supper}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50">
              <Cookie className="h-5 w-5 text-slate-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-700 font-medium">Snack</p>
                <p className="text-lg font-bold text-slate-800">{meals.snack}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
