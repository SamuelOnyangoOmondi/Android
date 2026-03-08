
import React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, School } from "lucide-react";
import { SidebarItem } from "./sidebar/SidebarItem";
import { SidebarAcademicSection } from "./sidebar/SidebarAcademicSection";
import { SidebarAdminSection } from "./sidebar/SidebarAdminSection";
import { SidebarServicesSection } from "./sidebar/SidebarServicesSection";
import { SidebarAppsSection } from "./sidebar/SidebarAppsSection";
import { SidebarIntegrationsSection } from "./sidebar/SidebarIntegrationsSection";
import { SidebarFooterSection } from "./sidebar/SidebarFooterSection";
import { SidebarFlamiSection } from "./sidebar/SidebarFlamiSection";

export function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className={cn("w-full bg-primary h-screen flex flex-col overflow-hidden", 
      collapsed ? "items-center" : "")}>
      {/* Navigation */}
      <div className="flex-1 py-3 px-2 overflow-y-auto w-full">
        <SidebarItem
          icon={<LayoutDashboard size={16} />}
          label="Dashboard"
          path="/"
          active={path === "/"}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<School size={16} />}
          label="My School"
          path="/schools"
          active={path === "/schools"}
          collapsed={collapsed}
        />
        
        {/* Academic Management */}
        <SidebarAcademicSection path={path} collapsed={collapsed} />
        
        {/* Administration */}
        <SidebarAdminSection path={path} collapsed={collapsed} />
        
        {/* Services */}
        <SidebarServicesSection path={path} collapsed={collapsed} />

        {/* Flami AI Section */}
        <SidebarFlamiSection path={path} collapsed={collapsed} />

        {/* Apps */}
        <SidebarAppsSection path={path} collapsed={collapsed} />

        {/* Integrations */}
        <SidebarIntegrationsSection path={path} collapsed={collapsed} />

        {/* Footer with settings, support, and theme toggle */}
        <SidebarFooterSection path={path} collapsed={collapsed} />
      </div>
    </div>
  );
}
