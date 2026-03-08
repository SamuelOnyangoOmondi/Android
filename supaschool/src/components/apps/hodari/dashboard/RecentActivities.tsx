
import React from "react";
import { Check, Download, Upload, User, Edit, FileText, Glasses, School, BookOpen } from "lucide-react";

export const RecentActivities = () => {
  const activities = [
    {
      type: "content",
      action: "uploaded",
      subject: "Science Video Tutorial",
      user: "John Doe",
      time: "2 hours ago",
      icon: <Upload className="h-4 w-4 text-blue-500" />,
      bgColor: "bg-blue-500/15",
    },
    {
      type: "user",
      action: "created",
      subject: "New Teacher Account",
      user: "Admin System",
      time: "5 hours ago",
      icon: <User className="h-4 w-4 text-green-500" />,
      bgColor: "bg-green-500/15",
    },
    {
      type: "school",
      action: "updated",
      subject: "Riverside Elementary",
      user: "Jane Smith",
      time: "Yesterday",
      icon: <School className="h-4 w-4 text-primary" />,
      bgColor: "bg-primary/15",
    },
    {
      type: "report",
      action: "generated",
      subject: "Monthly Performance Report",
      user: "System",
      time: "2 days ago",
      icon: <FileText className="h-4 w-4 text-purple-500" />,
      bgColor: "bg-purple-500/15",
    },
    {
      type: "verification",
      action: "verified",
      subject: "5 New Student Accounts",
      user: "Admin",
      time: "3 days ago",
      icon: <Check className="h-4 w-4 text-green-500" />,
      bgColor: "bg-green-500/15",
    },
    {
      type: "glasses",
      action: "registered",
      subject: "15 New Vision Glasses",
      user: "Inventory Manager",
      time: "4 days ago",
      icon: <Glasses className="h-4 w-4 text-purple-500" />,
      bgColor: "bg-purple-500/15",
    },
    {
      type: "content",
      action: "updated",
      subject: "Mathematics Curriculum",
      user: "Content Team",
      time: "1 week ago",
      icon: <BookOpen className="h-4 w-4 text-green-500" />,
      bgColor: "bg-green-500/15",
    },
  ];

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {activities.map((activity, index) => (
        <div 
          key={index} 
          className="flex items-start space-x-3 pb-3 border-b last:border-0 last:pb-0 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <div className={`${activity.bgColor} rounded-full p-2 group-hover:scale-110 transition-transform`}>
            {activity.icon}
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium group-hover:text-primary transition-colors">{activity.subject}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-between">
              <span>{activity.action} by {activity.user}</span>
              <span className="text-xs font-medium text-muted-foreground">{activity.time}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
