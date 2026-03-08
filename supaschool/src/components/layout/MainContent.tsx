
import React, { useEffect } from "react";

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  useEffect(() => {
    // Debug log to check if component is rendering
    console.log("MainContent component rendered");
    
    // Additional debugging to check what children contains
    console.log("MainContent children:", children);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {children ? (
          <>{children}</>
        ) : (
          <div className="p-6 text-red-500">No content provided to MainContent</div>
        )}
      </main>
    </div>
  );
}
