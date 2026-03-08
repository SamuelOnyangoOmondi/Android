
import React from "react";
import { GlobalSearchBar } from "@/components/header/GlobalSearchBar";
import { NotificationsPanel } from "@/components/header/NotificationsPanel";
import { MessagesPanel } from "@/components/header/MessagesPanel";
import { ProfileDropdown } from "@/components/header/ProfileDropdown";

interface SchoolData {
  name: string;
  logo_url: string | null;
  secondary_image_url: string | null;
}

export function Header({ schoolData }: { schoolData: SchoolData }) {
  return (
    <>
      {/* Main Header - full width with gradient background */}
      <div className="w-full bg-gradient-primary px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/a1e16204-bee3-4c31-b4c6-b4499f745422.png" 
            alt="SupaSchool Logo" 
            className="h-10"
          />
        </div>
        
        {/* Center area for school logos */}
        <div className="flex items-center gap-3">
          {schoolData.logo_url && (
            <img 
              src={schoolData.logo_url}
              alt="School Logo" 
              className="h-12 w-12 object-contain bg-white/90 p-1 rounded-full shadow-md border border-white/20"
            />
          )}
          {schoolData.secondary_image_url && (
            <img 
              src={schoolData.secondary_image_url}
              alt="School Secondary Image" 
              className="h-12 max-w-[120px] object-contain bg-white/90 p-1 rounded-md shadow-md border border-white/20"
            />
          )}
          <span className="text-white font-medium hidden md:block text-shadow">
            {schoolData.name}
          </span>
        </div>
        
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/b7cdbc7b-13aa-4fef-b599-9827f14c19fe.png" 
            alt="Kytabu Logo" 
            className="h-10"
          />
        </div>
      </div>
      
      {/* Dashboard header with search and profile */}
      <header className="bg-background border-b border-border py-3 px-6 shadow-sm">
        <div className="flex items-center justify-between">
          <GlobalSearchBar />
          <div className="flex items-center gap-1">
            <NotificationsPanel />
            <MessagesPanel />
            <ProfileDropdown />
          </div>
        </div>
      </header>
    </>
  );
}
