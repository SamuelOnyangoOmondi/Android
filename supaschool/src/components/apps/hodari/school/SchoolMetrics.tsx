
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, BarChart2 } from "lucide-react";

export const SchoolMetrics = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">School Performance Metrics</h3>
          <p className="text-sm text-muted-foreground">Analytics and statistics for all schools</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            This Academic Year
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.7%</div>
            <p className="text-xs text-green-500">+2.1% from last year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Student-Teacher Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1:18</div>
            <p className="text-xs text-amber-500">National avg: 1:22</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Graduation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.3%</div>
            <p className="text-xs text-green-500">+3.5% from last year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resource Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.4%</div>
            <p className="text-xs text-green-500">+5.3% from last year</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg font-medium">
            <BarChart2 className="h-5 w-5 mr-2 text-primary" />
            School Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-muted-foreground text-sm">
              School performance comparison chart will be displayed here
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Top Performing Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Highland Secondary School", score: 92, change: "+4%" },
                { name: "Riverside Elementary", score: 89, change: "+2%" },
                { name: "Mountain View Academy", score: 87, change: "+5%" },
                { name: "Lakeview Primary", score: 85, change: "-1%" },
                { name: "Valley Middle School", score: 83, change: "+3%" },
              ].map((school, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mr-3">
                      {i+1}
                    </div>
                    <span className="text-sm font-medium">{school.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-sm mr-2">{school.score}%</span>
                    <span className={`text-xs ${
                      school.change.startsWith('+') 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>{school.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "Facilities Utilization", schools: 4, priority: "High" },
                { category: "Teacher Development", schools: 3, priority: "Medium" },
                { category: "Technology Integration", schools: 5, priority: "High" },
                { category: "Parent Engagement", schools: 2, priority: "Low" },
                { category: "Curriculum Alignment", schools: 3, priority: "Medium" },
              ].map((area, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{area.category}</p>
                    <p className="text-xs text-muted-foreground">{area.schools} schools affected</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    area.priority === 'High' 
                      ? 'bg-red-100 text-red-800' 
                      : area.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {area.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
