
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { BookOpen } from "lucide-react";

interface SubjectDistributionProps {
  data: Array<{
    name: string;
    teachers: number;
  }>;
}

const SubjectDistributionChart: React.FC<SubjectDistributionProps> = ({ data }) => {
  return (
    <Card className="dashboard-card overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="flex items-center text-lg">
          <BookOpen className="mr-2 h-5 w-5 text-primary" />
          Teachers by Subject
        </CardTitle>
        <CardDescription>Distribution across departments</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-80">
          <ChartContainer
            config={{
              teachers: {
                label: "Teachers",
                color: "#8B5CF6",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="teachers" fill="#8B5CF6" name="Teachers" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectDistributionChart;
