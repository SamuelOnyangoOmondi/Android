
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
import { Users } from "lucide-react";

interface TeacherStudentRatioProps {
  data: Array<{
    name: string;
    ratio: number;
  }>;
}

const TeacherStudentRatioChart: React.FC<TeacherStudentRatioProps> = ({ data }) => {
  return (
    <Card className="dashboard-card overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="flex items-center text-lg">
          <Users className="mr-2 h-5 w-5 text-primary" />
          Teacher-Student Ratio
        </CardTitle>
        <CardDescription>Average ratio by grade level</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-80">
          <ChartContainer
            config={{
              ratio: {
                label: "Ratio (1:x)",
                color: "#60A5FA",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="ratio" fill="#60A5FA" name="Ratio (1:x)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherStudentRatioChart;
