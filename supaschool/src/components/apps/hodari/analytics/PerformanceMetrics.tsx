
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  BarChart,
  Calendar, 
  Download,
  Filter
} from "lucide-react";

export const PerformanceMetrics = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Student Performance Dashboard</h3>
          <p className="text-sm text-muted-foreground">View academic performance metrics and trends</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Score</span>
                <span className="font-medium">74%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: "74%" }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm">Passing Rate</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: "85%" }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm">Excellence Rate</span>
                <span className="font-medium">32%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: "32%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-primary" />
              Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-muted-foreground text-sm">
                Score distribution chart will be displayed here
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Performance by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { subject: "Mathematics", score: 71, trend: "+3%" },
              { subject: "Science", score: 68, trend: "-1%" },
              { subject: "English", score: 82, trend: "+5%" },
              { subject: "History", score: 74, trend: "+2%" },
              { subject: "Geography", score: 77, trend: "0%" },
            ].map((subject, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-32 font-medium text-sm">{subject.subject}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{subject.score}%</span>
                    <span className={`text-xs ${
                      subject.trend.startsWith('+') 
                        ? 'text-green-500' 
                        : subject.trend.startsWith('-') 
                          ? 'text-red-500' 
                          : 'text-gray-500'
                    }`}>{subject.trend}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        subject.score >= 80 
                          ? 'bg-green-500' 
                          : subject.score >= 70 
                            ? 'bg-blue-500' 
                            : subject.score >= 60 
                              ? 'bg-amber-500' 
                              : 'bg-red-500'
                      }`} 
                      style={{ width: `${subject.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
