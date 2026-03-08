
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const AddUserForm = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Add User Form</h3>
            <p className="text-muted-foreground">Form for adding new users to the platform</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
