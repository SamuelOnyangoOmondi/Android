
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const UserRoles = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">User Roles Interface</h3>
            <p className="text-muted-foreground">Manage and configure user roles and responsibilities</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
