
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Award } from "lucide-react";

interface PerformanceTrendsProps {
  data: Array<{
    month: string;
    score: number;
  }>;
}

const PerformanceTrendsChart: React.FC<PerformanceTrendsProps> = ({ data }) => {
  return (
    <Card className="dashboard-card overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="flex items-center text-lg">
          <Award className="mr-2 h-5 w-5 text-primary" />
          Performance Trends
        </CardTitle>
        <CardDescription>Average monthly assessment scores</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-80">
          <ChartContainer
            config={{
              score: {
                label: "Score",
                color: "#F59E0B",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis domain={[70, 90]} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ r: 6, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 8 }} 
                  name="Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceTrendsChart;
