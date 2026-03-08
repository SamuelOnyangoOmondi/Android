
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
  notification?: boolean;
  collapsed?: boolean;
}

export const SidebarItem = ({ icon, label, path, active, notification, collapsed }: SidebarItemProps) => {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center justify-between rounded-lg py-2.5 px-3 my-1 transition-all",
        active 
          ? "bg-white/15 text-white" 
          : "text-white/85 hover:bg-white/10 hover:text-white",
        active && !collapsed && "border-l-2 border-white/80 -ml-0.5 pl-3.5",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? label : undefined}
    >
      <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
        <div className="w-5 h-5">{icon}</div>
        {!collapsed && <span className="text-sm font-medium">{label}</span>}
      </div>
      {notification && !collapsed && (
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      )}
      {notification && collapsed && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
      )}
    </Link>
  );
};
