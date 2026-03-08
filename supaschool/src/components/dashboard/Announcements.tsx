
import React, { useState } from "react";
import { MoreVertical } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
}

export function Announcements() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  
  const announcements: Announcement[] = [
    {
      id: "1",
      title: "Conference",
      date: "April 5th, 2023",
      time: "00:00 AM",
      description: "Parent-teacher conference scheduled for Thursday, April 8th, from 2:00pm to 6:00pm."
    },
    {
      id: "2",
      title: "Announcement",
      date: "",
      time: "00:00 AM",
      description: "A sentence of words with a brief description of the announcement"
    },
    {
      id: "3",
      title: "Announcement",
      date: "",
      time: "00:00 AM",
      description: "A sentence of words with a brief description of the announcement"
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Announcement</h2>
        <div className="flex gap-2">
          <button 
            className={`text-sm ${filter === "all" ? "text-black font-medium" : "text-gray-500"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <span className="text-gray-300">|</span>
          <button 
            className={`text-sm ${filter === "unread" ? "text-black font-medium" : "text-gray-500"}`}
            onClick={() => setFilter("unread")}
          >
            Unread
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{announcement.title}</div>
                {announcement.date && (
                  <div className="text-sm text-gray-500">{announcement.date}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-400">{announcement.time}</div>
                <button className="text-gray-400">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{announcement.description}</p>
          </div>
        ))}
      </div>
      
      <button className="mt-4 flex items-center text-blue-600 text-sm font-medium">
        View All
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 ml-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </button>
    </div>
  );
}
