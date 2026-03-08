
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const AttendanceStats = () => {
  // Sample data for charts
  const weeklyData = [
    { name: 'Monday', present: 95, absent: 5 },
    { name: 'Tuesday', present: 92, absent: 8 },
    { name: 'Wednesday', present: 88, absent: 12 },
    { name: 'Thursday', present: 90, absent: 10 },
    { name: 'Friday', present: 85, absent: 15 },
  ];

  const monthlyData = [
    { name: 'Week 1', present: 92, absent: 8 },
    { name: 'Week 2', present: 88, absent: 12 },
    { name: 'Week 3', present: 90, absent: 10 },
    { name: 'Week 4', present: 86, absent: 14 },
  ];

  const classData = [
    { name: 'Class 1', value: 95 },
    { name: 'Class 2', value: 88 },
    { name: 'Class 3', value: 92 },
    { name: 'Class 4', value: 85 },
    { name: 'Class 5', value: 90 },
  ];

  const attendanceTypeData = [
    { name: 'Present', value: 86 },
    { name: 'Absent', value: 8 },
    { name: 'Late', value: 4 },
    { name: 'Excused', value: 2 },
  ];

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weekly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" stackId="a" fill="#10B981" name="Present %" />
                <Bar dataKey="absent" stackId="a" fill="#EF4444" name="Absent %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" stackId="a" fill="#10B981" name="Present %" />
                <Bar dataKey="absent" stackId="a" fill="#EF4444" name="Absent %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Attendance by Class</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Attendance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {attendanceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
