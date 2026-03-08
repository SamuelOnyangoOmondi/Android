
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchoolOverview } from "./SchoolOverview";
import { SchoolProfileTab } from "./SchoolProfileTab";
import { FacilitiesTab } from "./FacilitiesTab";
import { CommunicationSettings } from "@/components/dashboard/CommunicationSettings";
import { School } from "@/types/database";

interface SchoolTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  school: Partial<School>;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  handleSaveProfile: (values: any) => void;
  onOpenProfileModal: () => void;
}

export function SchoolTabs({
  activeTab,
  setActiveTab,
  school,
  editMode,
  setEditMode,
  handleSaveProfile,
  onOpenProfileModal
}: SchoolTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="bg-white/50 backdrop-blur-sm p-1 rounded-lg shadow-sm inline-block">
        <TabsList className="grid grid-cols-4 bg-gradient-to-r from-gray-50 to-gray-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">School Profile</TabsTrigger>
          <TabsTrigger value="facilities" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">Facilities & Infrastructure</TabsTrigger>
          <TabsTrigger value="communication" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">Communication</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="overview" className="space-y-4">
        <SchoolOverview school={school} onEditProfile={() => setActiveTab("profile")} />
      </TabsContent>
      
      <TabsContent value="profile">
        <SchoolProfileTab 
          school={school} 
          editMode={editMode} 
          onSave={handleSaveProfile} 
          onEdit={() => setEditMode(true)} 
        />
      </TabsContent>
      
      <TabsContent value="facilities">
        <FacilitiesTab school={school} />
      </TabsContent>
      
      <TabsContent value="communication">
        <CommunicationSettings />
      </TabsContent>
    </Tabs>
  );
}
