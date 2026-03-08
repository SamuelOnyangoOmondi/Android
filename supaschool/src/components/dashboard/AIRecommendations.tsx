
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, AlertCircle, TrendingUp, BookOpen } from "lucide-react";

const Recommendation = ({ icon, title, description, type }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  type: "alert" | "insight" | "suggestion"
}) => {
  const getBgColor = () => {
    switch (type) {
      case "alert": return "bg-red-100 dark:bg-red-900/20";
      case "insight": return "bg-accent-soft-yellow dark:bg-yellow-900/20";
      case "suggestion": return "bg-accent-green/20 dark:bg-green-900/20";
      default: return "bg-gray-100 dark:bg-gray-800";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "alert": return "text-red-500";
      case "insight": return "text-yellow-500";
      case "suggestion": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "alert": return "border-red-200 dark:border-red-800";
      case "insight": return "border-yellow-200 dark:border-yellow-800";
      case "suggestion": return "border-green-200 dark:border-green-800";
      default: return "border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className={`flex items-start space-x-4 p-3 rounded-lg ${getBgColor()} border ${getBorderColor()} shadow-sm hover:shadow-md cursor-pointer transition-shadow`}>
      <div className={`${getIconColor()}`}>
        {icon}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export function AIRecommendations() {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Bot className="mr-2 h-5 w-5 text-primary" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Recommendation 
          icon={<AlertCircle className="h-5 w-5" />}
          title="Attendance Alert" 
          description="Class 8A has a 15% drop in attendance this week. Check absences."
          type="alert"
        />
        <Recommendation 
          icon={<TrendingUp className="h-5 w-5" />}
          title="Performance Insight" 
          description="Math test scores improved by 12% after the new teaching method."
          type="insight"
        />
        <Recommendation 
          icon={<BookOpen className="h-5 w-5" />}
          title="Lesson Plan Suggestion" 
          description="Try visual learning for Class 7B based on their engagement patterns."
          type="suggestion"
        />
      </CardContent>
    </Card>
  );
}
