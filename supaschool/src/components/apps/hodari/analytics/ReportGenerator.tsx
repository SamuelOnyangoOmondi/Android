
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const ReportGenerator = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Report Generator Interface</h3>
            <p className="text-muted-foreground">Create and export custom reports from platform data</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
