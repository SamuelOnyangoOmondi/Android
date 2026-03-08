
import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Brain,
  Database,
  Book,
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./SidebarItem";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const FLAMI_PATHS = ["/flami", "/flami/knowledge", "/flami/curriculum", "/flami/models", "/flami/search"];

interface SidebarFlamiSectionProps {
  path: string;
  collapsed?: boolean;
}

export const SidebarFlamiSection = ({ path, collapsed }: SidebarFlamiSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const prevPathRef = useRef("");
  const isActiveSection = FLAMI_PATHS.some((p) => path === p || path.startsWith(p + "/"));

  useEffect(() => {
    const wasInSection = FLAMI_PATHS.some((p) => prevPathRef.current === p || prevPathRef.current.startsWith(p + "/"));
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
              FLAMI (My AI)
            </span>
            <CollapsibleTrigger asChild>
              <button className="h-5 w-5 rounded-md text-white/70 hover:bg-white/20 flex items-center justify-center">
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <SidebarItem
              icon={<Bot size={16} />}
              label="AI Assistant"
              path="/flami"
              active={path === "/flami"}
              collapsed={collapsed}
            />
            <SidebarItem
              icon={<Database size={16} />}
              label="Knowledge Base"
              path="/flami/knowledge"
              active={path === "/flami/knowledge"}
              collapsed={collapsed}
            />
            <SidebarItem
              icon={<Book size={16} />}
              label="Curriculum Data"
              path="/flami/curriculum"
              active={path === "/flami/curriculum"}
              collapsed={collapsed}
            />
            <SidebarItem
              icon={<Brain size={16} />}
              label="Learning Models"
              path="/flami/models"
              active={path === "/flami/models"}
              collapsed={collapsed}
            />
            <SidebarItem
              icon={<Search size={16} />}
              label="School Search"
              path="/flami/search"
              active={path === "/flami/search"}
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
            icon={<Bot size={16} />}
            label="AI Assistant"
            path="/flami"
            active={path === "/flami"}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Database size={16} />}
            label="Knowledge Base"
            path="/flami/knowledge"
            active={path === "/flami/knowledge"}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Book size={16} />}
            label="Curriculum Data"
            path="/flami/curriculum"
            active={path === "/flami/curriculum"}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Brain size={16} />}
            label="Learning Models"
            path="/flami/models"
            active={path === "/flami/models"}
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Search size={16} />}
            label="School Search"
            path="/flami/search"
            active={path === "/flami/search"}
            collapsed={collapsed}
          />
        </>
      )}
    </>
  );
};
