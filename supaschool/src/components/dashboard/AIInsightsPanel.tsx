
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  TrendingUp, 
  Users, 
  BookOpen,
  Calendar,
  BarChart as BarChartIcon
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Sample data for attendance chart
const attendanceData = [
  { name: 'Mon', attendance: 88 },
  { name: 'Tue', attendance: 92 },
  { name: 'Wed', attendance: 85 },
  { name: 'Thu', attendance: 90 },
  { name: 'Fri', attendance: 95 },
];

// Sample data for engagement chart
const engagementData = [
  { name: 'Jan', engagement: 65 },
  { name: 'Feb', engagement: 59 },
  { name: 'Mar', engagement: 70 },
  { name: 'Apr', engagement: 76 },
  { name: 'May', engagement: 78 },
];

// Sample data for curriculum progress
const curriculumData = [
  { subject: 'Math', completed: 75, target: 90 },
  { subject: 'Science', completed: 62, target: 85 },
  { subject: 'English', completed: 80, target: 88 },
  { subject: 'History', completed: 55, target: 80 },
];

export function AIInsightsPanel() {
  return (
    <Card className="shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <TrendingUp className="h-5 w-5" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <Card className="p-4 rounded-xl shadow-sm border-none bg-gradient-to-br from-white to-sky-50">
            <div className="text-sm font-medium mb-2 flex justify-between items-center">
              <h3 className="flex items-center gap-1">
                <Users className="h-4 w-4 text-accent-green" />
                Daily Attendance
              </h3>
              <span className="text-xs text-green-600 font-medium">↑ 3%</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6ce096" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6ce096" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '10px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#6ce096" 
                    fillOpacity={1} 
                    fill="url(#colorAttendance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Engagement Chart */}
          <Card className="p-4 rounded-xl shadow-sm border-none bg-gradient-to-br from-white to-purple-50">
            <div className="text-sm font-medium mb-2 flex justify-between items-center">
              <h3 className="flex items-center gap-1">
                <BarChartIcon className="h-4 w-4 text-primary" />
                Student Engagement
              </h3>
              <span className="text-xs text-green-600 font-medium">↑ 12%</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '10px', 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#660099" 
                    strokeWidth={2}
                    dot={{ stroke: '#660099', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#660099', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        {/* Curriculum Progress Chart */}
        <Card className="p-4 rounded-xl shadow-sm border-none bg-gradient-to-br from-white to-amber-50">
          <div className="text-sm font-medium mb-2 flex justify-between items-center">
            <h3 className="flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-accent-yellow" />
              Curriculum Progress By Subject
            </h3>
            <span className="text-xs text-amber-600 font-medium">→ On track</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={curriculumData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '10px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Legend />
                <Bar 
                  dataKey="completed" 
                  fill="#FFCC33" 
                  name="Completed" 
                />
                <Bar 
                  dataKey="target" 
                  fill="#85379E" 
                  name="Target"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* At-Risk Students */}
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-700">Students at Risk</h3>
            <p className="text-xs text-red-600 mt-1">
              5 students showing declining performance in Math. 
              <a href="#" className="font-medium underline ml-1">View intervention plan</a>
            </p>
          </div>
        </div>
        
        {/* Reminders */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            AI-Generated Reminders
          </h3>
          <ul className="space-y-3">
            <li className="text-xs flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
              <span className="h-2 w-2 rounded-full bg-accent-yellow mt-1.5"></span>
              <span>Parent-teacher conference tomorrow at 3:00 PM</span>
            </li>
            <li className="text-xs flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
              <span className="h-2 w-2 rounded-full bg-accent-pink mt-1.5"></span>
              <span>Grade 6 science projects due next Monday</span>
            </li>
            <li className="text-xs flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
              <span className="h-2 w-2 rounded-full bg-accent-green mt-1.5"></span>
              <span>School board meeting scheduled for Friday</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
