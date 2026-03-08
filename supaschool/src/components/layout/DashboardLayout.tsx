
import React, { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { Header } from "./Header";
import { SectionLabels } from "./SectionLabels";
import { SidebarContainer } from "./SidebarContainer";
import { MainContent } from "./MainContent";

// Add debugging
console.log("DashboardLayout module loaded");

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  console.log("DashboardLayout rendering with children:", children);
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const { theme } = useTheme();
  
  // Sample school data (in real app, this would come from context or API)
  const schoolData = {
    name: "Kisumu Primary School",
    logo_url: "/lovable-uploads/a1e16204-bee3-4c31-b4c6-b4499f745422.png",
    secondary_image_url: null,
    primary_color: "#8600cc", // Kytabu Purple
    secondary_color: "#10B981", // Green
    accent_color: "#F59E0B" // Amber
  };
  
  // Apply school color scheme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Set the primary color
    root.style.setProperty('--primary', schoolData.primary_color);
    root.style.setProperty('--secondary', schoolData.secondary_color);
    root.style.setProperty('--accent-yellow', schoolData.accent_color);
    root.style.setProperty('--primary-yellow', schoolData.accent_color);
    
    return () => {
      // Reset to default colors when component unmounts
      root.style.removeProperty('--primary');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--accent-yellow');
      root.style.removeProperty('--primary-yellow');
    };
  }, [schoolData]);
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header schoolData={schoolData} />
      
      <SectionLabels 
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        chatCollapsed={chatCollapsed}
        setChatCollapsed={setChatCollapsed}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <SidebarContainer 
          sidebarCollapsed={sidebarCollapsed}
          chatCollapsed={chatCollapsed}
          setChatCollapsed={setChatCollapsed}
        />
        
        <MainContent>
          {/* Fallback content to test if MainContent renders but not children */}
          <div className="bg-yellow-200 p-4 m-4 rounded-lg">
            <p className="font-bold">MainContent Fallback Test</p>
          </div>
          
          {/* Pass children with explicit check */}
          {children ? children : (
            <div className="bg-red-200 p-4 m-4 rounded-lg">
              <p className="font-bold">No children were passed to DashboardLayout</p>
            </div>
          )}
        </MainContent>
      </div>
    </div>
  );
}
