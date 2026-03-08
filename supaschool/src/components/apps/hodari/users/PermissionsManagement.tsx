
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const PermissionsManagement = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Permissions Management Interface</h3>
            <p className="text-muted-foreground">Configure detailed permissions for different user roles</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
