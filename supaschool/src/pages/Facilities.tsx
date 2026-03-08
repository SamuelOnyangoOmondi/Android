import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Building2,
  Wifi,
  Droplets,
  Zap,
  Plus,
  Settings,
  BarChart3,
} from "lucide-react";

const demoFacilities = [
  { id: "1", name: "Classrooms", count: 24, status: "ok", utilization: "92%" },
  { id: "2", name: "Toilets (Boys)", count: 12, status: "ok", utilization: "—" },
  { id: "3", name: "Toilets (Girls)", count: 12, status: "maintenance", utilization: "—" },
  { id: "4", name: "Library", count: 1, status: "ok", utilization: "45%" },
  { id: "5", name: "Computer Lab", count: 1, status: "ok", utilization: "78%" },
  { id: "6", name: "Science Lab", count: 1, status: "ok", utilization: "60%" },
];

const demoMaintenance = [
  { id: "1", item: "Block B - Roof leak", priority: "High", status: "In progress", date: "2026-03-01" },
  { id: "2", item: "Girls toilet - Pipe repair", priority: "High", status: "Scheduled", date: "2026-03-08" },
  { id: "3", item: "Fence - Section replacement", priority: "Medium", status: "Pending", date: "—" },
];

export default function FacilitiesPage() {
  const [schoolId, setSchoolId] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-stone-600 to-amber-800 p-6 rounded-xl shadow-md border border-stone-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">Facilities</h1>
          <p className="text-white/80 max-w-2xl">
            Manage buildings, utilities, and infrastructure. Track utilization and maintenance requests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">School</CardTitle>
              </CardHeader>
              <CardContent>
                <SchoolFilter value={schoolId} onValueChange={setSchoolId} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" disabled={!schoolId}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add facility
                </Button>
                <Button variant="outline" className="w-full" disabled={!schoolId}>
                  <Settings className="h-4 w-4 mr-2" />
                  Log maintenance
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Utilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium">Power</span>
                  </div>
                  <Badge variant="secondary">OK</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Water</span>
                  </div>
                  <Badge variant="secondary">OK</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium">Internet</span>
                  </div>
                  <Badge variant="secondary">OK</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {!schoolId ? (
              <EmptyState
                icon={Building2}
                title="Select a school"
                description="Choose a school to view and manage facilities."
              />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="inventory" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Inventory</span>
                  </TabsTrigger>
                  <TabsTrigger value="maintenance" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Maintenance</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Total Classrooms</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">24</div>
                        <p className="text-sm text-muted-foreground mt-1">Across all blocks</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Utilization</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">92%</div>
                        <p className="text-sm text-muted-foreground mt-1">Average this term</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Open Requests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">3</div>
                        <p className="text-sm text-muted-foreground mt-1">Maintenance pending</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Facility summary</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Add Supabase tables for facilities, rooms, and maintenance logs to persist data.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border p-4 bg-muted/30">
                        <p className="text-sm">
                          Recommended schema: <code className="text-xs bg-muted px-1 rounded">facilities</code>,{" "}
                          <code className="text-xs bg-muted px-1 rounded">rooms</code>,{" "}
                          <code className="text-xs bg-muted px-1 rounded">maintenance_requests</code>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Facility inventory</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Sample data. Connect to Supabase when ready.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Facility</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Count</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Utilization</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {demoFacilities.map((f) => (
                              <tr key={f.id} className="bg-white">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{f.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{f.count}</td>
                                <td className="px-4 py-3">
                                  <Badge variant={f.status === "ok" ? "secondary" : "outline"}>
                                    {f.status}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">{f.utilization}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="maintenance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Maintenance requests</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Track repairs and scheduled maintenance.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Item</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Priority</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {demoMaintenance.map((m) => (
                              <tr key={m.id} className="bg-white">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.item}</td>
                                <td className="px-4 py-3">
                                  <Badge variant={m.priority === "High" ? "destructive" : "secondary"}>
                                    {m.priority}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">{m.status}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{m.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
