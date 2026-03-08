
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { studentsByGradeData, attendanceData, performanceData, behaviorData } from "./dashboardData";

const StudentsDashboard = () => {
  // Colors for the charts
  const pieColors = ["#660099", "#FFCC00", "#CAFFBF", "#A0C4FF"];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Students by Grade Chart */}
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Students by Grade</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ChartContainer
              config={{
                male: {
                  label: "Male",
                  color: "#660099",
                },
                female: {
                  label: "Female",
                  color: "#FFCC00",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentsByGradeData} barGap={10}>
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="male" fill="#660099" name="Male" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="female" fill="#FFCC00" name="Female" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Attendance Tracking Chart */}
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Attendance Tracking</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ChartContainer
              config={{
                present: {
                  label: "Present",
                  color: "#CAFFBF",
                },
                absent: {
                  label: "Absent",
                  color: "#FFADAD",
                },
                late: {
                  label: "Late",
                  color: "#FFD6A5",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="present"
                    stroke="#CAFFBF"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="absent"
                    stroke="#FFADAD"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="late"
                    stroke="#FFD6A5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Academic Performance Heatmap */}
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Academic Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ChartContainer
              config={{
                aboveAverage: {
                  label: "Above Average",
                  color: "#CAFFBF",
                },
                average: {
                  label: "Average",
                  color: "#FDFFB6",
                },
                belowAverage: {
                  label: "Below Average",
                  color: "#FFADAD",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} barGap={2}>
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="aboveAverage"
                    fill="#CAFFBF"
                    name="Above Average"
                    stackId="a"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="average"
                    fill="#FDFFB6"
                    name="Average"
                    stackId="a"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="belowAverage"
                    fill="#FFADAD"
                    name="Below Average"
                    stackId="a"
                    radius={[0, 0, 4, 4]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Behavior Tracking Insights */}
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Behavior Tracking</CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={behaviorData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {behaviorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentsDashboard;
