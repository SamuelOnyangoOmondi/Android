
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUpload } from "./MediaUpload";
import { MediaLibrary } from "./MediaLibrary";
import { MediaAssignment } from "./MediaAssignment";

export const MediaManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Media Management</h2>
      <p className="text-muted-foreground">Upload, organize, and assign educational content to schools and students.</p>
      
      <Tabs defaultValue="library" className="space-y-4">
        <TabsList>
          <TabsTrigger value="library">Content Library</TabsTrigger>
          <TabsTrigger value="upload">Upload Content</TabsTrigger>
          <TabsTrigger value="assign">Assign Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="library" className="space-y-4">
          <MediaLibrary />
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          <MediaUpload />
        </TabsContent>
        
        <TabsContent value="assign" className="space-y-4">
          <MediaAssignment />
        </TabsContent>
      </Tabs>
    </div>
  );
};
