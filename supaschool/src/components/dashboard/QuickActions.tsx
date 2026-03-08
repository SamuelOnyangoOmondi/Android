
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, BarChart2 } from "lucide-react";

export function QuickActions() {
  return (
    <Card className="border border-accent-soft-peach/30 shadow-sm overflow-hidden rounded-xl">
      <CardHeader className="pb-2 bg-white dark:bg-gray-800 border-b border-accent-soft-yellow/20 dark:border-accent-soft-lavender/20">
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 p-4">
        <Button className="justify-start bg-primary hover:bg-primary-light text-white shadow-sm hover:shadow-md border-none transition-all duration-300 rounded-lg">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Student
        </Button>
        <Button className="justify-start bg-secondary hover:bg-secondary-light text-black shadow-sm hover:shadow-md border-none transition-all duration-300 rounded-lg">
          <BookOpen className="mr-2 h-4 w-4" />
          Assign Lesson Plan
        </Button>
        <Button className="justify-start bg-accent-soft-peach hover:bg-accent-soft-peach/80 text-black shadow-sm hover:shadow-md border-none transition-all duration-300 rounded-lg">
          <BarChart2 className="mr-2 h-4 w-4" />
          View AI Insights
        </Button>
      </CardContent>
    </Card>
  );
}
