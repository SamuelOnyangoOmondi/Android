
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, BookOpen, Award, School, Calendar } from "lucide-react";

const HodariDashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-40">
      <div className="flex flex-col gap-2 bg-gradient-to-r from-[#8600cc] to-[#660099] p-6 rounded-lg shadow-soft border border-primary/10">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Hodari Dashboard
        </h1>
        <p className="text-white/80 max-w-2xl">
          Manage assessments, view student progress, and analyze performance data.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Performance Overview
                </CardTitle>
                <CardDescription>School progress at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average School Score</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: "67%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Target Achieved</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Assessments */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-primary" />
                  Recent Assessments
                </CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Mathematics Term 2", date: "June 15, 2023", participants: 124 },
                    { name: "English Composition", date: "June 10, 2023", participants: 118 },
                    { name: "Science Quiz", date: "June 5, 2023", participants: 130 },
                  ].map((assessment, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{assessment.name}</p>
                        <p className="text-sm text-muted-foreground">{assessment.date}</p>
                      </div>
                      <div className="text-sm bg-muted px-2 py-1 rounded">
                        {assessment.participants} students
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Award className="mr-2 h-5 w-5 text-primary" />
                  Top Performers
                </CardTitle>
                <CardDescription>Leading classes and students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Top Classes</h4>
                    <div className="space-y-2">
                      {[
                        { name: "Grade 8A", score: 78 },
                        { name: "Grade 7B", score: 74 },
                        { name: "Grade 6C", score: 72 },
                      ].map((cls, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm">{cls.name}</span>
                          <span className="font-medium text-sm">{cls.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Top Students</h4>
                    <div className="space-y-2">
                      {[
                        { name: "John Doe", grade: "8A", score: 92 },
                        { name: "Jane Smith", grade: "7B", score: 90 },
                        { name: "Tom Wilson", grade: "8A", score: 89 },
                      ].map((student, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="text-sm">
                            {student.name} <span className="text-muted-foreground">({student.grade})</span>
                          </div>
                          <span className="font-medium text-sm">{student.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Assessments */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Upcoming Assessments
                </CardTitle>
                <CardDescription>Next 14 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "End of Term Exams", date: "July 15, 2023", classes: "All Grades" },
                    { name: "Science Practical", date: "July 5, 2023", classes: "Grade 7 & 8" },
                    { name: "Mathematics Quiz", date: "June 28, 2023", classes: "Grade 6" },
                    { name: "Language Assessment", date: "June 25, 2023", classes: "All Grades" },
                  ].map((assessment, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{assessment.name}</p>
                        <p className="text-sm text-muted-foreground">{assessment.date}</p>
                      </div>
                      <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        {assessment.classes}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance by Subject */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <School className="mr-2 h-5 w-5 text-primary" />
                  Performance by Subject
                </CardTitle>
                <CardDescription>Average scores by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { subject: "Mathematics", score: 65, trend: "up", change: "+3%" },
                    { subject: "English Language", score: 72, trend: "up", change: "+5%" },
                    { subject: "Science", score: 68, trend: "down", change: "-2%" },
                    { subject: "Social Studies", score: 70, trend: "neutral", change: "0%" },
                    { subject: "Kiswahili", score: 75, trend: "up", change: "+1%" },
                  ].map((subject, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm">{subject.subject}</span>
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              subject.score >= 70 
                                ? "bg-green-500" 
                                : subject.score >= 60 
                                  ? "bg-amber-500" 
                                  : "bg-red-500"
                            }`} 
                            style={{ width: `${subject.score}%` }}
                          ></div>
                        </div>
                        <span className="font-medium text-sm">{subject.score}%</span>
                        <span className={`text-xs ${
                          subject.trend === "up" 
                            ? "text-green-500" 
                            : subject.trend === "down" 
                              ? "text-red-500" 
                              : "text-gray-500"
                        }`}>
                          {subject.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessments" className="h-96 flex items-center justify-center border rounded-md">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">Assessments Content</h3>
            <p className="text-muted-foreground">Assessment management interface will be available here</p>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="h-96 flex items-center justify-center border rounded-md">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">Reports Content</h3>
            <p className="text-muted-foreground">Detailed reports and analytics will be available here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HodariDashboard;
