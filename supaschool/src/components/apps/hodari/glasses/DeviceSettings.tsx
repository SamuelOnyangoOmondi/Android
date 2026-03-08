
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const DeviceSettings = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Privacy Settings Interface</h3>
            <p className="text-muted-foreground">Configure privacy and recording settings for Vision Glasses</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
