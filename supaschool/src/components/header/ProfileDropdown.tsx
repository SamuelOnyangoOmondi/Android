import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Building2,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const DEMO_USER = {
  name: "Olivia Kamau",
  role: "Head Teacher",
  avatar: "https://github.com/shadcn.png",
  school: "Kisumu Primary School",
};

export function ProfileDropdown() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app: clear session, redirect to login
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5 hover:bg-muted/50 transition-colors"
          aria-label="Account menu"
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={DEMO_USER.avatar} alt={DEMO_USER.name} />
            <AvatarFallback className="text-xs">
              {DEMO_USER.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium leading-tight">{DEMO_USER.name}</div>
            <div className="text-xs text-muted-foreground leading-tight">{DEMO_USER.role}</div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{DEMO_USER.name}</p>
            <p className="text-xs text-muted-foreground">{DEMO_USER.role}</p>
            <p className="text-xs text-muted-foreground">{DEMO_USER.school}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <User className="mr-2 h-4 w-4" />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/schools")}>
          <Building2 className="mr-2 h-4 w-4" />
          My School
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Shield className="mr-2 h-4 w-4" />
          Role & Permissions
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/support")}>
          <HelpCircle className="mr-2 h-4 w-4" />
          Help / Support
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
