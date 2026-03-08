
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { School } from "@/types/database";
import { toast } from "sonner";
import { EditSchoolProfileModal } from "@/components/dashboard/EditSchoolProfileModal";
import { SchoolTabs } from "@/components/schools/SchoolTabs";

// Sample school data (would come from API in production)
const sampleSchool: Partial<School> = {
  id: "1",
  name: "Kisumu Primary School",
  county: "Kisumu County",
  level_of_education: "Primary",
  school_status: "Public",
  address: "P.O Box 123, Kisumu",
  email: "info@kisumuprimary.ac.ke",
  phone: "+254 700 123456",
  location: "Milimani Estate, Kisumu City",
  total_enrollment: 850,
  total_boys: 420,
  total_girls: 430,
  total_classrooms: 25,
  pupil_teacher_ratio: 30,
  pupil_classroom_ratio: 34,
  logo_url: "/lovable-uploads/a1e16204-bee3-4c31-b4c6-b4499f745422.png",
  primary_color: "#8B5CF6", // More vibrant purple
  secondary_color: "#D946EF", // Vibrant magenta
  accent_color: "#F97316" // Bright orange
}

export default function Schools() {
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [school, setSchool] = useState<Partial<School>>(sampleSchool);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleSaveProfile = (values: any) => {
    // In a real app, this would send data to the backend
    setSchool({ ...school, ...values });
    toast.success("School profile updated successfully");
    setEditMode(false);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-purple p-6 rounded-xl shadow-md border border-primary/30">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            My School
          </h1>
          <p className="text-white/80 max-w-2xl">
            Manage your school's profile, facilities, and settings. Keep your school information up to date.
          </p>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-md border border-primary/25 hover:shadow-lg"
          >
            Edit School Profile
          </button>
        </div>
        
        <SchoolTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          school={school}
          editMode={editMode}
          setEditMode={setEditMode}
          handleSaveProfile={handleSaveProfile}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
        />
      </div>
      
      {/* Edit Profile Modal */}
      <EditSchoolProfileModal 
        school={school}
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        onSave={handleSaveProfile}
      />
    </DashboardLayout>
  );
}
