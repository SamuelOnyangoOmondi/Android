
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload, UserPlus, Download, RefreshCcw } from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      label: "Add School",
      icon: <Plus className="h-4 w-4" />,
      action: () => console.log("Add School clicked"),
      variant: "outline" as const,
    },
    {
      label: "Upload Content",
      icon: <Upload className="h-4 w-4" />,
      action: () => console.log("Upload Content clicked"),
      variant: "outline" as const,
    },
    {
      label: "Add User",
      icon: <UserPlus className="h-4 w-4" />,
      action: () => console.log("Add User clicked"),
      variant: "outline" as const,
    },
    {
      label: "Generate Report",
      icon: <Download className="h-4 w-4" />,
      action: () => console.log("Generate Report clicked"),
      variant: "default" as const,
    },
    {
      label: "Update Devices",
      icon: <RefreshCcw className="h-4 w-4" />,
      action: () => console.log("Update Devices clicked"),
      variant: "outline" as const,
    }
  ];

  return (
    <div className="space-y-3">
      {actions.map((action, index) => (
        <Button 
          key={index}
          variant={action.variant}
          className="w-full justify-start hover:translate-x-1 transition-transform"
          onClick={action.action}
        >
          <span className="bg-primary/10 p-1 rounded mr-2 flex items-center justify-center">
            {action.icon}
          </span>
          <span>{action.label}</span>
        </Button>
      ))}
    </div>
  );
};
