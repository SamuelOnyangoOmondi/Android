
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DashboardStatsProps {
  title: string;
  value: number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

export const DashboardStats = ({ title, value, change, trend, icon }: DashboardStatsProps) => {
  // Dynamic border color based on title
  const getBorderColor = () => {
    if (title.includes("School")) return "border-b-primary";
    if (title.includes("Student")) return "border-b-accent-soft-blue";
    if (title.includes("Content")) return "border-b-accent-soft-green";
    if (title.includes("Glasses")) return "border-b-accent-soft-lavender";
    return "border-b-primary";
  };

  // Solid background color for icon with opacity
  const getIconBgColor = () => {
    if (title.includes("School")) return "bg-primary/20";
    if (title.includes("Student")) return "bg-blue-500/20";
    if (title.includes("Content")) return "bg-green-500/20";
    if (title.includes("Glasses")) return "bg-purple-500/20";
    return "bg-primary/20";
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-all duration-300 border-b-4 ${getBorderColor()} transform hover:-translate-y-1`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
          </div>
          <div className={`${getIconBgColor()} p-3 rounded-full`}>
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {trend === "up" ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : trend === "down" ? (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          ) : (
            <Minus className="h-4 w-4 text-yellow-500 mr-1" />
          )}
          <span 
            className={
              trend === "up" 
                ? "text-green-500 text-sm font-medium" 
                : trend === "down" 
                  ? "text-red-500 text-sm font-medium" 
                  : "text-yellow-500 text-sm font-medium"
            }
          >
            {change}
          </span>
          <span className="text-xs text-muted-foreground ml-1">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
};
