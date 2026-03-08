import React, { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIChatInterface } from "@/components/dashboard/AIChatInterface";
import { useDashboardSnapshot } from "@/hooks/useDashboard";
import {
  BarChart3,
  UtensilsCrossed,
  UserX,
  FileSpreadsheet,
  DollarSign,
  Building2,
  Database,
  Users,
  CalendarCheck,
  BookOpen,
  Download,
  Mail,
  AlertTriangle,
} from "lucide-react";

const QUICK_ACTIONS = [
  { id: "attendance", label: "Attendance summary", icon: BarChart3 },
  { id: "meals", label: "Meal distribution today", icon: UtensilsCrossed },
  { id: "absent", label: "Absent students", icon: UserX },
  { id: "feeding", label: "Weekly feeding report", icon: FileSpreadsheet },
  { id: "budget", label: "Budget consumption", icon: DollarSign },
  { id: "compare", label: "School comparison", icon: Building2 },
];

const DATA_SOURCES = [
  { name: "Students", icon: Users, connected: true },
  { name: "Attendance", icon: CalendarCheck, connected: true },
  { name: "Meal records", icon: UtensilsCrossed, connected: true },
  { name: "Schools", icon: Building2, connected: true },
  { name: "Curriculum", icon: BookOpen, connected: true },
  { name: "Knowledge base", icon: Database, connected: true },
];

export default function FlamiAssistantPage() {
  const [schoolId, setSchoolId] = useState("");
  const [prefillPrompt, setPrefillPrompt] = useState("");
  const clearPrefill = useCallback(() => setPrefillPrompt(""), []);
  const { data: snapshot } = useDashboardSnapshot({
    schoolId: schoolId || undefined,
    date: new Date().toISOString().split("T")[0],
  });

  const handleQuickAction = (id: string) => {
    const prompts: Record<string, string> = {
      attendance: "Show me today's attendance summary. How many students are present, absent, late, or excused?",
      meals: "How many meals were served today? Break down by breakfast, lunch, supper, and snack.",
      absent: "List students who are absent today.",
      feeding: "Generate a weekly feeding report for this week.",
      budget: "Show budget consumption and remaining balance.",
      compare: "Compare attendance and meal coverage across schools.",
    };
    const prompt = prompts[id];
    if (prompt) setPrefillPrompt(prompt);
  };

  const sampleInsight = snapshot && (snapshot.attendance?.absent ?? 0) > 0 && (
    <div className="flex gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50">
      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-amber-900">Attendance alert</p>
        <p className="text-sm text-amber-800 mt-1">
          {snapshot.attendance.absent} students absent today. Coverage: {snapshot.attendanceCoverage}%.
        </p>
        <p className="text-xs text-amber-700 mt-2">
          Recommendation: Check meal inventory and follow up with guardians.
        </p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-violet-600 to-purple-800 p-6 rounded-xl shadow-md border border-violet-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">FLAMI AI Assistant</h1>
          <p className="text-white/80 max-w-2xl">
            The intelligence layer of the platform. Ask questions in natural language and get insights from students, meals, attendance, and reports.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          <div className="lg:col-span-1 space-y-6 overflow-y-auto">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {QUICK_ACTIONS.map((a) => {
                  const Icon = a.icon;
                  return (
                    <Button
                      key={a.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleQuickAction(a.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {a.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Data sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {DATA_SOURCES.map((d) => (
                  <div key={d.name} className="flex items-center justify-between rounded-lg border p-2">
                    <div className="flex items-center gap-2">
                      <d.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{d.name}</span>
                    </div>
                    <Badge variant={d.connected ? "secondary" : "outline"} className="text-xs">
                      {d.connected ? "Connected" : "—"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Export & actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Export report
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Mail className="h-4 w-4 mr-2" />
                  Email school report
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Ask FLAMI to &quot;export attendance report&quot; or &quot;email summary to principal&quot;.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 flex flex-col min-h-0 gap-4">
            {sampleInsight && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Smart insight</CardTitle>
                </CardHeader>
                <CardContent>{sampleInsight}</CardContent>
              </Card>
            )}

            <Card className="flex-1 flex flex-col min-h-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Chat with FLAMI</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Try: &quot;How many students ate lunch today?&quot; or &quot;Which schools have the lowest attendance?&quot;
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col min-h-0 p-0">
                <AIChatInterface
                  fullHeight
                  onToggleCollapse={() => {}}
                  isCollapsed={false}
                  prefillPrompt={prefillPrompt}
                  onPrefillUsed={clearPrefill}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
