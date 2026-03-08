import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MessagePreview = {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  timestamp: string;
  isUnread: boolean;
};

const DEMO_MESSAGES: MessagePreview[] = [
  {
    id: "1",
    sender: "Admin",
    subject: "Attendance reminder",
    snippet: "Please ensure Grade 5 Blue attendance is submitted by end of day.",
    timestamp: "2 hours ago",
    isUnread: true,
  },
  {
    id: "2",
    sender: "Finance Team",
    subject: "Budget clarification",
    snippet: "The Q1 feeding budget has been approved. See attached breakdown.",
    timestamp: "Yesterday",
    isUnread: true,
  },
  {
    id: "3",
    sender: "Support",
    subject: "Sync issue resolved",
    snippet: "The Farm to Feed sync has been fixed. Data should now be up to date.",
    timestamp: "2 days ago",
    isUnread: false,
  },
];

export function MessagesPanel() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MessagePreview[]>(DEMO_MESSAGES);
  const unreadCount = messages.filter((m) => m.isUnread).length;

  const markAsRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isUnread: false } : m)));
  };

  const handleMessageClick = (m: MessagePreview) => {
    markAsRead(m.id);
    navigate("/messages");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-muted transition-colors"
          aria-label={`Messages${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Mail className="h-5 w-5 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Messages</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate("/messages")}>
            View all
          </Button>
        </div>
        <div className="max-h-[360px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No messages</div>
          ) : (
            messages.map((m) => (
              <button
                key={m.id}
                className={cn(
                  "w-full text-left px-4 py-3 border-b last:border-b-0 transition-colors hover:bg-muted/50",
                  m.isUnread && "bg-primary/5"
                )}
                onClick={() => handleMessageClick(m)}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("font-medium text-sm truncate", m.isUnread && "font-semibold")}>{m.sender}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{m.timestamp}</span>
                </div>
                <p className="text-sm font-medium text-foreground mt-0.5 truncate">{m.subject}</p>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{m.snippet}</p>
                {m.isUnread && <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2" />}
              </button>
            ))
          )}
        </div>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/messages")}>
            Open inbox
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
