
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, BookOpen, Glasses, School, Calendar, BarChart, FileText, ArrowRightCircle, Award, Zap, BrainCircuit } from "lucide-react";
import { DashboardStats } from "./DashboardStats";
import { RecentActivities } from "./RecentActivities";
import { QuickActions } from "./QuickActions";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell } from "recharts";

export const OverviewDashboard = () => {
  // Sample stats data
  const statsData = [
    { 
      title: "Total Schools", 
      value: 156, 
      change: "+12%", 
      trend: "up" as const,
      icon: <School className="h-5 w-5 text-primary" />
    },
    { 
      title: "Active Students", 
      value: 8742, 
      change: "+5%", 
      trend: "up" as const,
      icon: <Users className="h-5 w-5 text-blue-500" />
    },
    { 
      title: "Content Items", 
      value: 4235, 
      change: "+23%", 
      trend: "up" as const,
      icon: <BookOpen className="h-5 w-5 text-green-500" />
    },
    { 
      title: "Connected Glasses", 
      value: 1897, 
      change: "+8%", 
      trend: "up" as const,
      icon: <Glasses className="h-5 w-5 text-purple-500" />
    }
  ];

  // Sample usage data for the chart
  const usageData = [
    { name: 'Jan', schools: 120, students: 6500, content: 3200 },
    { name: 'Feb', schools: 130, students: 7000, content: 3400 },
    { name: 'Mar', schools: 140, students: 7300, content: 3600 },
    { name: 'Apr', schools: 145, students: 7800, content: 3800 },
    { name: 'May', schools: 150, students: 8200, content: 4000 },
    { name: 'Jun', schools: 156, students: 8742, content: 4235 },
  ];

  // Sample device distribution data
  const deviceData = [
    { name: 'In Use', value: 1350, color: '#660099' },
    { name: 'Standby', value: 400, color: '#FFCC00' },
    { name: 'Maintenance', value: 147, color: '#FFC6FF' },
  ];

  // Sample learning engagement data
  const engagementData = [
    { name: 'Math', usage: 850 },
    { name: 'Science', usage: 760 },
    { name: 'Languages', usage: 650 },
    { name: 'History', usage: 420 },
    { name: 'Arts', usage: 380 },
    { name: 'Tech', usage: 560 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome section with solid color background */}
      <div className="bg-primary rounded-xl p-6 shadow-md text-white mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <Award className="mr-2 h-6 w-6 text-secondary" /> 
          Welcome to Hodari Admin
        </h2>
        <p className="opacity-90 max-w-2xl mb-4">Manage schools, content, and users for the Hodari education platform from this dashboard.</p>
        <div className="flex flex-wrap gap-4 mt-5">
          <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
            <Calendar className="mr-2 h-4 w-4" />
            Weekly Report
          </Button>
          <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
            <Users className="mr-2 h-4 w-4" />
            User Analytics
          </Button>
          <Button variant="secondary" size="sm" className="bg-primary-yellow hover:bg-primary-yellow/90 text-primary border-none">
            <Zap className="mr-2 h-4 w-4" />
            Quick Tour
          </Button>
        </div>
      </div>

      {/* Quick stats grid with improved spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsData.map((stat, index) => (
          <DashboardStats key={index} {...stat} />
        ))}
      </div>

      {/* Main content area with better spacing and balance between charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Platform usage chart */}
        <Card className="lg:col-span-2 hover:shadow-md transition-shadow border-t-4 border-t-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-medium flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Platform Usage
              </CardTitle>
              <CardDescription>Usage statistics for the last 6 months</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              <ArrowRightCircle className="h-4 w-4" />
              <span className="sr-only">View details</span>
            </Button>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={{
              schools: { color: "#660099" },
              students: { color: "#FFCC00" },
              content: { color: "#A0C4FF" }
            }}>
              <AreaChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorSchools" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#660099" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#660099" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFCC00" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFCC00" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorContent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A0C4FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#A0C4FF" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="schools" stroke="#660099" fillOpacity={1} fill="url(#colorSchools)" />
                <Area type="monotone" dataKey="students" stroke="#FFCC00" fillOpacity={1} fill="url(#colorStudents)" />
                <Area type="monotone" dataKey="content" stroke="#A0C4FF" fillOpacity={1} fill="url(#colorContent)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick actions with improved spacing */}
        <Card className="hover:shadow-md transition-shadow border-t-4 border-t-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium flex items-center">
              <Zap className="mr-2 h-5 w-5 text-secondary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <QuickActions />
          </CardContent>
        </Card>
      </div>

      {/* Second row of charts with better spacing and balance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Learning content engagement section */}
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium flex items-center">
              <BrainCircuit className="mr-2 h-5 w-5 text-green-500" />
              Learning Content Engagement
            </CardTitle>
            <CardDescription>Most accessed subjects</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ChartContainer config={{
              usage: { color: "#22C55E" }
            }}>
              <RechartsBarChart data={engagementData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usage" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Device distribution chart */}
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium flex items-center">
              <Glasses className="mr-2 h-5 w-5 text-purple-500" />
              Glasses Distribution
            </CardTitle>
            <CardDescription>Current usage status</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ChartContainer config={{}}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Last row of cards with better spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent activities */}
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-secondary" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivities />
          </CardContent>
        </Card>

        {/* Reports summary */}
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              Reports Summary
            </CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-muted-foreground text-sm">
              Reports summary will be implemented here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
