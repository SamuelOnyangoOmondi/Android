
import React from "react";
import { MinimizeIcon, MaximizeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  isFullHeight: boolean;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
}

export function ChatHeader({ isMinimized, onToggleMinimize, isFullHeight, onToggleCollapse, isCollapsed }: ChatHeaderProps) {
  if (isFullHeight) {
    // Return an empty div with minimal height to maintain spacing
    return (
      <div className="py-2 px-4 flex items-center justify-between relative"></div>
    );
  }

  return (
    <div className="bg-[#660099] text-white rounded-t-2xl py-2 px-4 flex flex-row items-center justify-between cursor-pointer shadow-md" onClick={onToggleMinimize}>
      <span className="font-semibold">FLAMI Assistant</span>
      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-7 w-7" onClick={(e) => {
        e.stopPropagation();
        onToggleMinimize();
      }}>
        {isMinimized ? <MaximizeIcon className="h-4 w-4" /> : <MinimizeIcon className="h-4 w-4" />}
      </Button>
    </div>
  );
}
