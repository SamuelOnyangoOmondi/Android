
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { AttendanceTracking } from "./AttendanceTracking";
import { SystemUsage } from "./SystemUsage";
import { ReportGenerator } from "./ReportGenerator";

export const Analytics = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics & Reporting</h2>
      <p className="text-muted-foreground">View performance metrics, track attendance, and generate reports.</p>
      
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Tracking</TabsTrigger>
          <TabsTrigger value="system">System Usage</TabsTrigger>
          <TabsTrigger value="reports">Report Generator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetrics />
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-4">
          <AttendanceTracking />
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <SystemUsage />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <ReportGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};
