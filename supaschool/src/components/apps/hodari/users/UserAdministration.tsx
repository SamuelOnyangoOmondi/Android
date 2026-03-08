
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersList } from "./UsersList";
import { AddUserForm } from "./AddUserForm";
import { UserRoles } from "./UserRoles";
import { PermissionsManagement } from "./PermissionsManagement";
import { VerificationQueue } from "./VerificationQueue";

export const UserAdministration = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Administration</h2>
      <p className="text-muted-foreground">Manage users, roles, and permissions for the Hodari platform.</p>
      
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="add">Add User</TabsTrigger>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="verification">Verification Queue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <UsersList />
        </TabsContent>
        
        <TabsContent value="add" className="space-y-4">
          <AddUserForm />
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <UserRoles />
        </TabsContent>
        
        <TabsContent value="permissions" className="space-y-4">
          <PermissionsManagement />
        </TabsContent>
        
        <TabsContent value="verification" className="space-y-4">
          <VerificationQueue />
        </TabsContent>
      </Tabs>
    </div>
  );
};
