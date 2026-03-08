
import React, { useState, useEffect, useRef } from "react";
import { 
  Building, 
  DollarSign, 
  FileText, 
  BarChart2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./SidebarItem";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ADMIN_PATHS = ["/facilities", "/finance", "/reports", "/analytics"];

interface SidebarAdminSectionProps {
  path: string;
  collapsed?: boolean;
}

export const SidebarAdminSection = ({ path, collapsed }: SidebarAdminSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const prevPathRef = useRef("");
  const isActiveSection = ADMIN_PATHS.some((p) => path === p || path.startsWith(p + "/"));

  useEffect(() => {
    const wasInSection = ADMIN_PATHS.some((p) => prevPathRef.current === p || prevPathRef.current.startsWith(p + "/"));
    prevPathRef.current = path;
    if (isActiveSection && !wasInSection) setIsOpen(true);
  }, [path, isActiveSection]);

  return (
    <>
      {!collapsed ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <div
            className={cn(
              "mt-4 mb-1 px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors",
              isActiveSection && "bg-white/10"
            )}
          >
            <span className={cn("text-xs font-semibold uppercase", isActiveSection ? "text-white" : "text-white/70")}>
              Administration
            </span>
            <CollapsibleTrigger asChild>
              <button className="h-5 w-5 rounded-md text-white/70 hover:bg-white/20 flex items-center justify-center">
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <SidebarItem
              icon={<Building size={16} />}
              label="Facilities"
              path="/facilities"
              active={path === "/facilities"}
              collapsed={collapsed}
            />
            <SidebarItem
              icon={<DollarSign size={16} />}
              label="Finance"
              path="/finance"
              active={path === "/finance"}
              collapsed={collapsed}
            />
            <SidebarItem
              icon={<FileText size={16} />}
              label="Reports"
              path="/reports"
              active={path === "/reports"}
              collapsed={collapsed}
            />
            <SidebarItem
              icon={<BarChart2 size={16} />}
              label="Analytics"
              path="/analytics"
              active={path === "/analytics"}
              collapsed={collapsed}
            />
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="mt-4 mb-1 w-full border-t border-white/20"></div>
      )}
      {collapsed && (
        <>
          <SidebarItem
            icon={<Building size={16} />}
            label="Facilities"
            path="/facilities"
            active={path === "/facilities"}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<DollarSign size={16} />}
            label="Finance"
            path="/finance"
            active={path === "/finance"}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<FileText size={16} />}
            label="Reports"
            path="/reports"
            active={path === "/reports"}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<BarChart2 size={16} />}
            label="Analytics"
            path="/analytics"
            active={path === "/analytics"}
            collapsed={collapsed}
          />
        </>
      )}
    </>
  );
};
