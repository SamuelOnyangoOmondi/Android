
import React from "react";
import { Settings, HelpCircle, Moon, Sun } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface SidebarFooterSectionProps {
  path: string;
  collapsed?: boolean;
}

export const SidebarFooterSection = ({ path, collapsed }: SidebarFooterSectionProps) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className={cn("mt-4 border-t border-white/20 pt-4", collapsed && "w-full")}>
      <SidebarItem
        icon={<Settings size={16} />}
        label="Settings"
        path="/settings"
        active={path === "/settings"}
        collapsed={collapsed}
      />
      <SidebarItem
        icon={<HelpCircle size={16} />}
        label="Support"
        path="/support"
        active={path === "/support"}
        collapsed={collapsed}
      />
      <button 
        className={cn(
          "flex items-center gap-2 px-3 py-3 text-white/80 hover:bg-white/20 transition-colors rounded-md my-1 w-full",
          collapsed && "justify-center px-2"
        )}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        title={collapsed ? (theme === "dark" ? "Light Mode" : "Dark Mode") : undefined}
      >
        <div className="w-5 h-5">
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </div>
        {!collapsed && (
          <span className="text-sm font-medium">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        )}
      </button>
    </div>
  );
};
