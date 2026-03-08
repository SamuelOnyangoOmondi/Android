import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { UtensilsCrossed, History, BarChart3 } from "lucide-react";
import { MealServing } from "@/components/meals/MealServing";
import { MealHistory } from "@/components/meals/MealHistory";
import { MealSummary } from "@/components/meals/MealSummary";
import { SchoolFilter } from "@/components/shared/SchoolFilter";

const Meals = () => {
  const [activeTab, setActiveTab] = useState("serve");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [schoolId, setSchoolId] = useState("");

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-amber-600 to-orange-700 p-6 rounded-xl shadow-md border border-amber-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Meal Management
          </h1>
          <p className="text-white/80 max-w-2xl">
            Record meals served, view history, and monitor feeding coverage. Integrates with Farm to Feed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Date</CardTitle>
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

            <MealSummary
              schoolId={schoolId || undefined}
              mealDate={selectedDate?.toISOString().split("T")[0] ?? ""}
            />
          </div>

          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="serve" className="flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4" />
                  <span>Record Meals</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span>History</span>
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Summary</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="serve" className="space-y-4">
                <MealServing
                  schoolId={schoolId}
                  selectedDate={selectedDate}
                />
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <MealHistory
                  schoolId={schoolId || undefined}
                  mealDate={selectedDate?.toISOString().split("T")[0]}
                />
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <MealSummary
                  schoolId={schoolId || undefined}
                  mealDate={selectedDate?.toISOString().split("T")[0] ?? ""}
                  fullWidth
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Meals;
