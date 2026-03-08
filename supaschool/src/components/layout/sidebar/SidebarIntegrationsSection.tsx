
import React, { useState, useEffect, useRef } from "react";
import { 
  Link,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./SidebarItem";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const INTEGRATIONS_PATHS = ["/nemis"];

interface SidebarIntegrationsSectionProps {
  path: string;
  collapsed?: boolean;
}

export const SidebarIntegrationsSection = ({ path, collapsed }: SidebarIntegrationsSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const prevPathRef = useRef("");
  const isActiveSection = INTEGRATIONS_PATHS.some((p) => path === p || path.startsWith(p + "/"));

  useEffect(() => {
    const wasInSection = INTEGRATIONS_PATHS.some((p) => prevPathRef.current === p || prevPathRef.current.startsWith(p + "/"));
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
              Integrations
            </span>
            <CollapsibleTrigger asChild>
              <button className="h-5 w-5 rounded-md text-white/70 hover:bg-white/20 flex items-center justify-center">
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <SidebarItem
              icon={<Link size={16} />}
              label="NEMIS"
              path="/nemis"
              active={path === "/nemis"}
              collapsed={collapsed}
            />
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="mt-4 mb-1 w-full border-t border-white/20"></div>
      )}
      {collapsed && (
        <SidebarItem
          icon={<Link size={16} />}
          label="NEMIS"
          path="/nemis"
          active={path === "/nemis"}
          collapsed={collapsed}
        />
      )}
    </>
  );
};
