
import React, { useState, useEffect, useRef } from "react";
import { 
  Bus, 
  Utensils, 
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./SidebarItem";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const SERVICES_PATHS = ["/transport", "/meals", "/messages"];

interface SidebarServicesSectionProps {
  path: string;
  collapsed?: boolean;
}

export const SidebarServicesSection = ({ path, collapsed }: SidebarServicesSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const prevPathRef = useRef("");
  const isActiveSection = SERVICES_PATHS.some((p) => path === p || path.startsWith(p + "/"));

  useEffect(() => {
    const wasInSection = SERVICES_PATHS.some((p) => prevPathRef.current === p || prevPathRef.current.startsWith(p + "/"));
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
              Services
            </span>
            <CollapsibleTrigger asChild>
              <button className="h-5 w-5 rounded-md text-white/70 hover:bg-white/20 flex items-center justify-center">
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <SidebarItem
              icon={<Bus size={16} />}
              label="Transport"
              path="/transport"
              active={path === "/transport"}
              collapsed={collapsed}
            />
            <SidebarItem
              icon={<Utensils size={16} />}
              label="Meals"
              path="/meals"
              active={path === "/meals"}
              collapsed={collapsed}
            />
            <SidebarItem
              icon={<MessageSquare size={16} />}
              label="Chat Board"
              path="/messages"
              active={path === "/messages"}
              notification={true}
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
            icon={<Bus size={16} />}
            label="Transport"
            path="/transport"
            active={path === "/transport"}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Utensils size={16} />}
            label="Meals"
            path="/meals"
            active={path === "/meals"}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<MessageSquare size={16} />}
            label="Chat Board"
            path="/messages"
            active={path === "/messages"}
            notification={true}
            collapsed={collapsed}
          />
        </>
      )}
    </>
  );
};
