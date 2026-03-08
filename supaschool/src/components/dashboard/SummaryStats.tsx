
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { School, Users, GraduationCap, Calendar } from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  data?: any[];
  chartType?: "bar" | "pie" | "none";
}

const StatCard = ({ title, value, icon, color, data = [], chartType = "none" }: StatCardProps) => {
  const colorMap: Record<string, string> = {
    "bg-primary": "#8600cc",
    "bg-secondary": "#10B981",
    "bg-accent-yellow": "#F59E0B",
    "bg-blue-500": "#3B82F6",
    "bg-green-500": "#10B981",
    "bg-amber-500": "#F59E0B",
    "bg-red-500": "#EF4444"
  };
  
  const barColors = ["#8600cc", "#10B981", "#F59E0B", "#EF4444"];
  
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden rounded-xl bg-white">
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color} shadow-sm`}>
              {icon}
            </div>
          </div>
          
          {chartType === "bar" && data.length > 0 && (
            <div className="h-20 w-full mt-auto border-t border-gray-100 dark:border-gray-800">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="flex flex-col">
                              <span className="font-bold">{payload[0].payload.name}</span>
                              <span>{payload[0].value}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {chartType === "pie" && data.length > 0 && (
            <div className="h-20 w-full mt-auto flex justify-center border-t border-gray-100 dark:border-gray-800">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={35}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="flex flex-col">
                              <span className="font-bold">{payload[0].payload.name}</span>
                              <span>{payload[0].value}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export type SummaryStatsSnapshot = {
  date: string;
  attendance: { present: number; absent: number; late: number; excused: number; total: number };
  meals: { breakfast: number; lunch: number; supper: number; snack: number; total: number };
  activeStudents: number;
  attendanceCoverage: number;
  mealCoverage: number;
};

interface SummaryStatsProps {
  /** When provided, dashboard cards show real data from getDashboardSnapshot */
  snapshot?: SummaryStatsSnapshot | null;
  /** When provided, Total Schools uses this (e.g. from useSchools().data?.length) */
  schoolCount?: number | null;
}

export function SummaryStats({ snapshot, schoolCount }: SummaryStatsProps = {}) {
  const schoolsData = [
    { name: "Primary", value: 22 },
    { name: "Secondary", value: 15 },
    { name: "Special", value: 5 }
  ];

  const attendanceData = snapshot
    ? [
        { name: "Present", value: snapshot.attendance.present },
        { name: "Absent", value: snapshot.attendance.absent },
        { name: "Late", value: snapshot.attendance.late },
        { name: "Excused", value: snapshot.attendance.excused },
      ]
    : [];

  const mealsData = snapshot
    ? [
        { name: "Breakfast", value: snapshot.meals.breakfast },
        { name: "Lunch", value: snapshot.meals.lunch },
        { name: "Supper", value: snapshot.meals.supper },
        { name: "Snack", value: snapshot.meals.snack },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Schools" 
        value={schoolCount ?? 42} 
        icon={<School className="h-6 w-6 text-white" />} 
        color="bg-primary"
        data={schoolsData}
        chartType="bar"
      />
      <StatCard 
        title="Today's Attendance" 
        value={snapshot?.attendance.total ?? "—"} 
        icon={<Users className="h-6 w-6 text-white" />} 
        color="bg-secondary"
        data={attendanceData}
        chartType="pie"
      />
      <StatCard 
        title="Today's Meals" 
        value={snapshot?.meals.total ?? "—"} 
        icon={<GraduationCap className="h-6 w-6 text-white" />} 
        color="bg-accent-yellow"
        data={mealsData}
        chartType="pie"
      />
      <StatCard 
        title="Active Students" 
        value={snapshot?.activeStudents ?? "—"} 
        icon={<Calendar className="h-6 w-6 text-white" />} 
        color="bg-blue-500"
        data={[]}
        chartType="none"
      />
    </div>
  );
}
