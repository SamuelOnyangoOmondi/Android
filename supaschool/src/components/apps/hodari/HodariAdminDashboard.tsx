
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewDashboard } from "./dashboard/OverviewDashboard";
import { MediaManagement } from "./media/MediaManagement";
import { SchoolManagement } from "./school/SchoolManagement";
import { GlassesManagement } from "./glasses/GlassesManagement";
import { UserAdministration } from "./users/UserAdministration";
import { Analytics } from "./analytics/Analytics";
import { LayoutDashboard, Film, School, Glasses, Users, BarChart } from "lucide-react";

const HodariAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Define tabs with icons for better navigation
  const tabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "media", label: "Media", icon: <Film className="h-4 w-4" /> },
    { id: "schools", label: "Schools", icon: <School className="h-4 w-4" /> },
    { id: "glasses", label: "Vision Glasses", icon: <Glasses className="h-4 w-4" /> },
    { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-40">
      <div className="flex flex-col gap-2 bg-gradient-to-r from-[#7e22ce] to-[#5b0e9d] p-8 rounded-lg shadow-md border border-primary/10">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Hodari Admin Dashboard
        </h1>
        <p className="text-white/80 max-w-2xl">
          Manage schools, content, users, and view analytics for the Hodari education platform.
        </p>
      </div>

      <Tabs 
        defaultValue="overview" 
        className="space-y-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="bg-white rounded-lg p-1 shadow-sm border">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 p-1">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex items-center gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {tab.icon}
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-6">
          <OverviewDashboard />
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <MediaManagement />
        </TabsContent>

        <TabsContent value="schools" className="mt-6">
          <SchoolManagement />
        </TabsContent>

        <TabsContent value="glasses" className="mt-6">
          <GlassesManagement />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserAdministration />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HodariAdminDashboard;
