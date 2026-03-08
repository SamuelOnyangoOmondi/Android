import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  MessageSquare,
  Send,
  Users,
  Bell,
  Hash,
  Plus,
  Search,
} from "lucide-react";

const demoChannels = [
  { id: "1", name: "General", unread: 3, last: "School reopening tomorrow" },
  { id: "2", name: "Staff", unread: 0, last: "Meeting at 3pm" },
  { id: "3", name: "Parents", unread: 1, last: "Fee payment reminder" },
  { id: "4", name: "Class 5A", unread: 0, last: "Homework due Friday" },
];

const demoMessages = [
  { id: "1", name: "Admin", text: "Welcome to the new Chat Board. Announcements will appear here.", time: "10:00 AM" },
  { id: "2", name: "Principal", text: "Reminder: All teachers report back by 8am Monday.", time: "10:15 AM" },
  { id: "3", name: "Admin", text: "PTA meeting scheduled for next Thursday at 4pm.", time: "11:30 AM" },
];

export default function MessagesPage() {
  const [schoolId, setSchoolId] = useState("");
  const [activeTab, setActiveTab] = useState("channels");
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-xl shadow-md border border-blue-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">Chat Board</h1>
          <p className="text-white/80 max-w-2xl">
            Announcements, group channels, and direct messages. Connect with staff, parents, and students.
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
                  New channel
                </Button>
                <Button variant="outline" className="w-full" disabled={!schoolId}>
                  <Bell className="h-4 w-4 mr-2" />
                  New announcement
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search messages..."
                    className="pl-10"
                    disabled={!schoolId}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {!schoolId ? (
              <EmptyState
                icon={MessageSquare}
                title="Select a school"
                description="Choose a school to view and manage the chat board."
              />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="channels" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span>Channels</span>
                  </TabsTrigger>
                  <TabsTrigger value="announcements" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Announcements</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="channels" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Channels</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Sample data. Add Supabase tables for channels and messages when ready.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {demoChannels.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Hash className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{c.name}</p>
                                <p className="text-sm text-muted-foreground">{c.last}</p>
                              </div>
                            </div>
                            {c.unread > 0 && (
                              <Badge variant="default">{c.unread}</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>General</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Recent messages in #general
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {demoMessages.map((m) => (
                          <div key={m.id} className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                              <Users className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{m.name}</span>
                                <span className="text-xs text-muted-foreground">{m.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-0.5">{m.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-4 border-t">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          disabled
                        />
                        <Button disabled>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="announcements" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Announcements</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Broadcast messages to staff, parents, or students.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <EmptyState
                        icon={Bell}
                        title="No announcements yet"
                        description="Create announcements to notify staff and parents. Requires messaging and notification tables in Supabase."
                        action={
                          <Button disabled>
                            <Bell className="h-4 w-4 mr-2" />
                            Create announcement
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
