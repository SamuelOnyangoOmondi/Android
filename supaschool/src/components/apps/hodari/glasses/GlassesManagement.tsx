
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectedDevices } from "./ConnectedDevices";
import { DeviceSettings } from "./DeviceSettings";
import { SoftwareUpdates } from "./SoftwareUpdates";
import { UsageAnalytics } from "./UsageAnalytics";

export const GlassesManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hodari Vision Glasses Management</h2>
      <p className="text-muted-foreground">Monitor and manage connected AR glasses and view usage statistics.</p>
      
      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="devices">Connected Devices</TabsTrigger>
          <TabsTrigger value="settings">Privacy Settings</TabsTrigger>
          <TabsTrigger value="updates">Software Updates</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices" className="space-y-4">
          <ConnectedDevices />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <DeviceSettings />
        </TabsContent>
        
        <TabsContent value="updates" className="space-y-4">
          <SoftwareUpdates />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <UsageAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
