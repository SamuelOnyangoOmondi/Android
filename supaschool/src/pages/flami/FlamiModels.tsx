import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Activity,
  UtensilsCrossed,
  Users,
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  BarChart3,
} from "lucide-react";

type Model = {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  accuracy: number;
  precision: number;
  recall: number;
  trainingSize: number;
  icon: React.ElementType;
};

const DEMO_MODELS: Model[] = [
  {
    id: "attendance",
    name: "Attendance prediction",
    description: "Predicts which students may drop out or have attendance risks.",
    status: "active",
    accuracy: 0.87,
    precision: 0.82,
    recall: 0.79,
    trainingSize: 12500,
    icon: Activity,
  },
  {
    id: "meal",
    name: "Meal demand prediction",
    description: "Predicts food demand per school, weekly consumption, and budget planning.",
    status: "active",
    accuracy: 0.91,
    precision: 0.88,
    recall: 0.85,
    trainingSize: 8200,
    icon: UtensilsCrossed,
  },
  {
    id: "nutrition",
    name: "Nutrition impact model",
    description: "Predicts relationship between feeding, academic performance, and attendance.",
    status: "active",
    accuracy: 0.78,
    precision: 0.75,
    recall: 0.72,
    trainingSize: 5600,
    icon: UtensilsCrossed,
  },
  {
    id: "risk",
    name: "Student risk detection",
    description: "Detects malnutrition risk, chronic absenteeism, and academic decline.",
    status: "active",
    accuracy: 0.84,
    precision: 0.81,
    recall: 0.77,
    trainingSize: 9400,
    icon: AlertTriangle,
  },
];

export default function FlamiModelsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-violet-600 to-purple-800 p-6 rounded-xl shadow-md border border-violet-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">Learning Models</h1>
          <p className="text-white/80 max-w-2xl">
            AI and machine learning models used in the system. The engine room for predictions and insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {DEMO_MODELS.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-violet-600" />
                      <CardTitle className="text-lg">{m.name}</CardTitle>
                    </div>
                    <Badge variant={m.status === "active" ? "default" : "secondary"}>
                      {m.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Accuracy</span>
                      <span>{(m.accuracy * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={m.accuracy * 100} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Precision</span>
                      <p className="font-medium">{(m.precision * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recall</span>
                      <p className="font-medium">{(m.recall * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Training size</span>
                      <p className="font-medium">{m.trainingSize.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" disabled>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retrain
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      {m.status === "active" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-violet-500" />
              Model outputs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <p className="font-medium text-sm">Attendance prediction</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Example: Student risk score 0.83 — High likelihood of absenteeism
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="font-medium text-sm">Meal demand</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Example: Expected meals next week: 2,450
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="font-medium text-sm">Student risk</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Example: 15 students show high absenteeism and low meal participation
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="font-medium text-sm">Nutrition impact</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Example: Correlation between feeding and math performance by grade
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
