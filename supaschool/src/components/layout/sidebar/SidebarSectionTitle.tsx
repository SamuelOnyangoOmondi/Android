
import React from "react";

interface SidebarSectionTitleProps {
  title: string;
  collapsed?: boolean;
}

export function SidebarSectionTitle({ title, collapsed }: SidebarSectionTitleProps) {
  if (collapsed) {
    return (
      <div className="h-6 border-b border-primary-foreground/10 mx-2 mb-2"></div>
    );
  }

  return (
    <h3 className="text-xs uppercase font-medium text-white/70 px-4 mb-2">
      {title}
    </h3>
  );
}
