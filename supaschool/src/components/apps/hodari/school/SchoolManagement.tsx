
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchoolsList } from "./SchoolsList";
import { AddSchoolForm } from "./AddSchoolForm";
import { TeacherManagement } from "./TeacherManagement";
import { SchoolMetrics } from "./SchoolMetrics";

export const SchoolManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">School Management</h2>
      <p className="text-muted-foreground">Add, edit, and manage schools and teaching staff.</p>
      
      <Tabs defaultValue="schools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schools">All Schools</TabsTrigger>
          <TabsTrigger value="add">Add School</TabsTrigger>
          <TabsTrigger value="teachers">Manage Teachers</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schools" className="space-y-4">
          <SchoolsList />
        </TabsContent>
        
        <TabsContent value="add" className="space-y-4">
          <AddSchoolForm />
        </TabsContent>
        
        <TabsContent value="teachers" className="space-y-4">
          <TeacherManagement />
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <SchoolMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
