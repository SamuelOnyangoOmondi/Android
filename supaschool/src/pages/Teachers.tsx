
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeachersDashboard from "@/components/teachers/TeachersDashboard";
import TeacherProfiles from "@/components/teachers/TeacherProfiles";
import ManageTeachers from "@/components/teachers/ManageTeachers";
import TeacherScheduling from "@/components/teachers/TeacherScheduling";
import { GraduationCap, BarChart3, Users, Settings, Calendar } from "lucide-react";

const Teachers = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-primary p-6 rounded-xl shadow-sm border border-primary/10">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Teachers Management
          </h1>
          <p className="text-white/80 max-w-2xl">
            Manage teacher profiles, track workload, assign subjects, and monitor performance metrics
            for your school's teaching staff.
          </p>
        </div>

        <Tabs
          defaultValue="dashboard"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl p-1 border border-gray-100 dark:border-gray-700">
            <TabsTrigger 
              value="dashboard"
              className="tab-button data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profiles"
              className="tab-button data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Teacher Profiles</span>
            </TabsTrigger>
            <TabsTrigger 
              value="schedule" 
              className="tab-button data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger 
              value="manage" 
              className="tab-button data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Manage</span>
            </TabsTrigger>
          </TabsList>

          <div className="animate-fade-in">
            <TabsContent value="dashboard" className="space-y-6 mt-2">
              <TeachersDashboard />
            </TabsContent>
            
            <TabsContent value="profiles" className="space-y-6 mt-2">
              <TeacherProfiles />
            </TabsContent>
            
            <TabsContent value="schedule" className="space-y-6 mt-2">
              <TeacherScheduling />
            </TabsContent>
            
            <TabsContent value="manage" className="space-y-6 mt-2">
              <ManageTeachers />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Teachers;
