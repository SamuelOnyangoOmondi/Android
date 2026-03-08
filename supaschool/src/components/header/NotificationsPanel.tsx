import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck, AlertTriangle, Info, AlertCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NotificationPriority = "info" | "warning" | "critical";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: NotificationPriority;
  actionUrl?: string;
  category: string;
};

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Attendance pending",
    message: "Grade 5 Blue attendance has not been submitted today.",
    timestamp: "10 mins ago",
    isRead: false,
    priority: "warning",
    actionUrl: "/attendance",
    category: "Attendance",
  },
  {
    id: "2",
    title: "Low meal stock",
    message: "Rice inventory for School A is below threshold.",
    timestamp: "1 hour ago",
    isRead: false,
    priority: "warning",
    actionUrl: "/meals",
    category: "Meals",
  },
  {
    id: "3",
    title: "Report ready",
    message: "Weekly feeding report is ready for download.",
    timestamp: "Today, 8:10 AM",
    isRead: true,
    priority: "info",
    actionUrl: "/reports",
    category: "Reports",
  },
  {
    id: "4",
    title: "New student added",
    message: "Amina Hassan was added to Grade 6 Blue.",
    timestamp: "Yesterday",
    isRead: true,
    priority: "info",
    actionUrl: "/students",
    category: "Operational",
  },
];

const PRIORITY_ICONS: Record<NotificationPriority, React.ElementType> = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertCircle,
};

export function NotificationsPanel() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (n: Notification) => {
    markAsRead(n.id);
    if (n.actionUrl) navigate(n.actionUrl);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-muted transition-colors"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="h-5 w-5 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No notifications</div>
          ) : (
            notifications.map((n) => {
              const Icon = PRIORITY_ICONS[n.priority];
              return (
                <button
                  key={n.id}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b last:border-b-0 transition-colors hover:bg-muted/50",
                    !n.isRead && "bg-primary/5"
                  )}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        "shrink-0 mt-0.5",
                        n.priority === "critical" && "text-red-500",
                        n.priority === "warning" && "text-amber-500",
                        n.priority === "info" && "text-blue-500"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("font-medium text-sm", !n.isRead && "font-semibold")}>{n.title}</p>
                        {!n.isRead && <span className="shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n.timestamp}</p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/reports")}>
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
