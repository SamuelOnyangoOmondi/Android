
import React from "react";
import { Sidebar } from "./Sidebar";
import { AIChatInterface } from "@/components/dashboard/AIChatInterface";

interface SidebarContainerProps {
  sidebarCollapsed: boolean;
  chatCollapsed: boolean;
  setChatCollapsed: (collapsed: boolean) => void;
}

export function SidebarContainer({ 
  sidebarCollapsed, 
  chatCollapsed, 
  setChatCollapsed 
}: SidebarContainerProps) {
  return (
    <>
      {/* Sidebar - conditionally collapsed */}
      <div className={`${sidebarCollapsed ? 'w-24' : 'w-44'} transition-all duration-300 relative overflow-hidden bg-gradient-to-b from-primary to-secondary rounded-br-3xl shadow-lg`}>
        <Sidebar collapsed={sidebarCollapsed} />
      </div>
      
      {/* FLAMI Chat Interface - increased spacing with margin-left */}
      <div className={`${chatCollapsed ? 'w-24' : 'w-96'} border-r border-gray-200 dark:border-gray-700 transition-all duration-300 relative overflow-hidden ml-4 ${chatCollapsed ? 'bg-primary-yellow' : 'bg-white dark:bg-gray-800'} rounded-r-3xl shadow-md mr-6`}>
        {chatCollapsed ? (
          <div 
            className="h-full w-24 bg-primary-yellow cursor-pointer flex flex-col items-center rounded-r-3xl"
            onClick={() => setChatCollapsed(false)}
          >
            <div className="w-1 h-20 bg-primary/30 rounded-full mt-20"></div>
          </div>
        ) : (
          <AIChatInterface 
            fullHeight={true} 
            onToggleCollapse={() => setChatCollapsed(!chatCollapsed)}
            isCollapsed={chatCollapsed}
          />
        )}
      </div>
    </>
  );
}
