import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSpreadsheet, UtensilsCrossed } from "lucide-react";
import { AttendanceReports } from "@/components/attendance/AttendanceReports";
import { MealHistory } from "@/components/meals/MealHistory";
import { SchoolFilter } from "@/components/shared/SchoolFilter";

const Reports = () => {
  const [schoolId, setSchoolId] = useState("");
  const [mealDate, setMealDate] = useState(new Date().toISOString().split("T")[0]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-slate-600 to-slate-700 p-6 rounded-xl shadow-md border border-slate-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Reports
          </h1>
          <p className="text-white/80 max-w-2xl">
            Export attendance and meal reports for selected date ranges and schools.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <SchoolFilter value={schoolId} onValueChange={setSchoolId} />
          </div>

          <Tabs defaultValue="attendance" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="attendance" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Attendance
              </TabsTrigger>
              <TabsTrigger value="meals" className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                Meals
              </TabsTrigger>
            </TabsList>
            <TabsContent value="attendance" className="mt-6">
              <AttendanceReports />
            </TabsContent>
            <TabsContent value="meals" className="mt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <input
                    type="date"
                    value={mealDate}
                    onChange={(e) => setMealDate(e.target.value)}
                    className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <MealHistory schoolId={schoolId || undefined} mealDate={mealDate} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
