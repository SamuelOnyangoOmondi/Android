
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { WifiOff, Wifi, Battery, RefreshCw, Settings, Power, BookOpen } from "lucide-react";

export const ConnectedDevices = () => {
  // Sample devices data
  const devices = [
    {
      id: "HV-1001",
      name: "Hodari Glass #1001",
      school: "Riverside Elementary",
      lastActive: "10 minutes ago",
      batteryLevel: 85,
      onlineStatus: "online",
      firmwareVersion: "2.4.1"
    },
    {
      id: "HV-1002",
      name: "Hodari Glass #1002",
      school: "Riverside Elementary",
      lastActive: "3 hours ago",
      batteryLevel: 62,
      onlineStatus: "offline",
      firmwareVersion: "2.4.1"
    },
    {
      id: "HV-1003",
      name: "Hodari Glass #1003",
      school: "Highland Secondary School",
      lastActive: "5 minutes ago",
      batteryLevel: 93,
      onlineStatus: "online",
      firmwareVersion: "2.4.0"
    },
    {
      id: "HV-1004",
      name: "Hodari Glass #1004",
      school: "Valley Middle School",
      lastActive: "2 days ago",
      batteryLevel: 15,
      onlineStatus: "offline",
      firmwareVersion: "2.3.8"
    },
    {
      id: "HV-1005",
      name: "Hodari Glass #1005",
      school: "Mountain View Academy",
      lastActive: "Just now",
      batteryLevel: 76,
      onlineStatus: "online",
      firmwareVersion: "2.4.1"
    },
  ];

  // Function to get battery status icon and color
  const getBatteryStatus = (level: number) => {
    let color = "text-green-500";
    if (level < 20) {
      color = "text-red-500";
    } else if (level < 50) {
      color = "text-amber-500";
    }
    return <div className="flex items-center gap-1">
      <Battery className={`h-4 w-4 ${color}`} />
      <span className={color}>{level}%</span>
    </div>;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium">Connected Devices</h3>
            <p className="text-sm text-muted-foreground">
              Showing {devices.filter(d => d.onlineStatus === "online").length} online 
              out of {devices.length} registered devices
            </p>
          </div>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Battery</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Firmware</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.id}</TableCell>
                  <TableCell>{device.name}</TableCell>
                  <TableCell>{device.school}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {device.onlineStatus === "online" ? (
                        <>
                          <Wifi className="h-4 w-4 text-green-500" />
                          <span className="text-green-500">Online</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-4 w-4 text-red-500" />
                          <span className="text-red-500">Offline</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getBatteryStatus(device.batteryLevel)}</TableCell>
                  <TableCell>{device.lastActive}</TableCell>
                  <TableCell>{device.firmwareVersion}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" title="Device Settings">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Power Management">
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="View Content">
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
