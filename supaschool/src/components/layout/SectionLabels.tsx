
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionLabelsProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  chatCollapsed: boolean;
  setChatCollapsed: (collapsed: boolean) => void;
}

export function SectionLabels({ 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  chatCollapsed, 
  setChatCollapsed 
}: SectionLabelsProps) {
  return (
    <div className="flex w-full bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md">
      <div className={`${sidebarCollapsed ? 'w-24' : 'w-44'} transition-all duration-300 py-2 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border-r border-gray-300 dark:border-gray-600`}>
        <div className="flex items-center justify-center">
          <span className="font-medium text-primary dark:text-white">Menu</span>
          <button 
            className="ml-1 cursor-pointer p-1 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 rounded transition-colors shadow-sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? 
              <ChevronRight className="h-4 w-4 text-primary dark:text-white" /> : 
              <ChevronLeft className="h-4 w-4 text-primary dark:text-white" />
            }
          </button>
        </div>
      </div>
      <div className={`${chatCollapsed ? 'w-24' : 'w-96'} transition-all duration-300 py-2 bg-gradient-to-r from-primary-yellow to-accent-soft-peach ml-0 border-r border-secondary/30`}>
        <div className="flex items-center justify-center">
          <span className="font-medium text-primary">Flami</span>
          <button 
            className="ml-1 cursor-pointer p-1 hover:bg-accent-soft-yellow/30 rounded transition-colors shadow-sm"
            onClick={() => setChatCollapsed(!chatCollapsed)}
          >
            {chatCollapsed ? 
              <ChevronRight className="h-4 w-4 text-primary" /> : 
              <ChevronLeft className="h-4 w-4 text-primary" />
            }
          </button>
        </div>
      </div>
      <div className="flex-1 px-6 py-2 font-medium text-primary dark:text-white bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        Dashboard
      </div>
    </div>
  );
}
