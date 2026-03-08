
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Clock } from "lucide-react";

interface WeeklyWorkloadProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const WeeklyWorkloadChart: React.FC<WeeklyWorkloadProps> = ({ data }) => {
  return (
    <Card className="dashboard-card overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="flex items-center text-lg">
          <Clock className="mr-2 h-5 w-5 text-primary" />
          Weekly Workload
        </CardTitle>
        <CardDescription>Teaching hours distribution</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={40}
                paddingAngle={2}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} teachers`, 'Count']} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyWorkloadChart;
