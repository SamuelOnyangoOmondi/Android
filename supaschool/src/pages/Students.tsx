
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentsDashboard from "@/components/students/StudentsDashboard";
import StudentProfiles from "@/components/students/StudentProfiles";
import ManageStudents from "@/components/students/ManageStudents";
import { UsersIcon, UserIcon, UserPlusIcon } from "lucide-react";

const Students = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Students Management</h1>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="profiles" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>Student Profiles</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <UserPlusIcon className="h-4 w-4" />
              <span>Manage Students</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <StudentsDashboard />
          </TabsContent>
          
          <TabsContent value="profiles">
            <StudentProfiles />
          </TabsContent>
          
          <TabsContent value="manage">
            <ManageStudents />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Students;
