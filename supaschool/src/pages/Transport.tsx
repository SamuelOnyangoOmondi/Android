import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Bus,
  MapPin,
  Users,
  Plus,
  Route,
  ClipboardList,
} from "lucide-react";

const demoRoutes = [
  { id: "1", name: "Route A - North", stops: 8, students: 45, status: "active" },
  { id: "2", name: "Route B - South", stops: 6, students: 32, status: "active" },
  { id: "3", name: "Route C - East", stops: 5, students: 28, status: "maintenance" },
];

const demoVehicles = [
  { id: "1", plate: "KCA 123A", capacity: 30, route: "Route A", status: "operational" },
  { id: "2", plate: "KCB 456B", capacity: 25, route: "Route B", status: "operational" },
  { id: "3", plate: "KCC 789C", capacity: 35, route: "Route C", status: "servicing" },
];

export default function TransportPage() {
  const [schoolId, setSchoolId] = useState("");
  const [activeTab, setActiveTab] = useState("routes");

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-orange-600 to-amber-700 p-6 rounded-xl shadow-md border border-orange-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">Transport</h1>
          <p className="text-white/80 max-w-2xl">
            Manage bus routes, vehicles, and student transport assignments. Track pickups and drop-offs.
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
                  Add route
                </Button>
                <Button variant="outline" className="w-full" disabled={!schoolId}>
                  <Bus className="h-4 w-4 mr-2" />
                  Register vehicle
                </Button>
                <Button variant="outline" className="w-full" disabled={!schoolId}>
                  <Users className="h-4 w-4 mr-2" />
                  Assign students
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Routes</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vehicles</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Students</span>
                  <span className="font-medium">105</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {!schoolId ? (
              <EmptyState
                icon={Bus}
                title="Select a school"
                description="Choose a school to view and manage transport."
              />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="routes" className="flex items-center gap-2">
                    <Route className="h-4 w-4" />
                    <span>Routes</span>
                  </TabsTrigger>
                  <TabsTrigger value="vehicles" className="flex items-center gap-2">
                    <Bus className="h-4 w-4" />
                    <span>Vehicles</span>
                  </TabsTrigger>
                  <TabsTrigger value="assignments" className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    <span>Assignments</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="routes" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bus routes</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Sample data. Add Supabase tables for routes and stops when ready.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Route</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Stops</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Students</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {demoRoutes.map((r) => (
                              <tr key={r.id} className="bg-white">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{r.stops}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{r.students}</td>
                                <td className="px-4 py-3">
                                  <Badge variant={r.status === "active" ? "secondary" : "outline"}>
                                    {r.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vehicles" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fleet</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Registered vehicles and their current assignments.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plate</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Capacity</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Route</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {demoVehicles.map((v) => (
                              <tr key={v.id} className="bg-white">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{v.plate}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{v.capacity}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">{v.route}</td>
                                <td className="px-4 py-3">
                                  <Badge variant={v.status === "operational" ? "secondary" : "outline"}>
                                    {v.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="assignments" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Student assignments</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Assign students to routes and pickup points.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <EmptyState
                        icon={MapPin}
                        title="Assignments coming soon"
                        description="Assign students to routes and stops. Requires transport routes and student records in Supabase."
                        action={
                          <Button variant="outline" disabled>
                            Bulk assign
                          </Button>
                        }
                      />
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
