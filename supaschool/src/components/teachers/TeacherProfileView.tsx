
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  FileText,
  ArrowLeft,
  Send,
} from "lucide-react";

interface TeacherProfileViewProps {
  teacher: {
    id: string;
    name: string;
    email: string;
    phone: string;
    subjects: string[];
    department: string;
    employmentDate: string;
    qualifications: string;
    status: string;
    performance: number;
    avatar: string;
  };
  onClose: () => void;
}

// Sample data for teacher details
const teacherDetails = {
  address: "123 Education Lane, Nairobi",
  dateOfBirth: "1985-07-15",
  nationalId: "12345678",
  bio: "Dedicated educator with over 10 years of experience in teaching sciences. Passionate about inspiring students to explore and understand the world through scientific inquiry.",
  classes: [
    { name: "Grade 10A", subject: "Physics", students: 35, schedule: "Mon, Wed 10:00-11:30" },
    { name: "Grade 11B", subject: "Physics", students: 28, schedule: "Tue, Thu 08:30-10:00" },
    { name: "Grade 9C", subject: "Mathematics", students: 32, schedule: "Mon, Wed, Fri 14:00-15:00" },
  ],
  attendance: 95,
  lessonsCompleted: 92,
  certifications: [
    { name: "Advanced STEM Teaching Certificate", year: 2020, issuer: "National Education Board" },
    { name: "Educational Technology Integration", year: 2021, issuer: "Digital Learning Institute" },
  ],
  trainingHistory: [
    { name: "Inquiry-Based Learning Workshop", date: "2022-03-15", duration: "2 days" },
    { name: "Assessment for Learning Conference", date: "2021-08-10", duration: "3 days" },
    { name: "Digital Tools for Education", date: "2020-05-20", duration: "1 week" },
  ],
  performanceMetrics: {
    studentFeedback: 88,
    peerReview: 92,
    lessonDelivery: 85,
    classroomManagement: 90,
    studentAchievement: 86,
  },
};

const TeacherProfileView: React.FC<TeacherProfileViewProps> = ({ teacher, onClose }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onClose} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Teachers List
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={teacher.avatar} />
              <AvatarFallback className="text-xl">
                {teacher.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">{teacher.name}</CardTitle>
            <CardDescription>{teacher.department} Department</CardDescription>
            <div className="flex justify-center mt-2">
              <Badge className="mx-1">{teacher.status}</Badge>
              {teacher.subjects.map((subject, idx) => (
                <Badge key={idx} variant="outline" className="mx-1">
                  {subject}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{teacher.phone}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>ID: {teacherDetails.nationalId}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Joined: {formatDate(teacher.employmentDate)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{teacherDetails.address}</span>
              </div>
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{teacher.qualifications}</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Performance Summary</h4>
              <Progress value={teacher.performance} className="h-2 mb-1" />
              <p className="text-xs text-right text-muted-foreground">{teacher.performance}%</p>
            </div>

            <div className="mt-6 flex space-x-2">
              <Button className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="development">Development</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Bio</h3>
                <p className="text-muted-foreground mt-1">{teacherDetails.bio}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Attendance Rate</span>
                      <Badge variant="outline">{teacherDetails.attendance}%</Badge>
                    </div>
                    <Progress value={teacherDetails.attendance} className="h-2" />
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Lessons Completed</span>
                      <Badge variant="outline">{teacherDetails.lessonsCompleted}%</Badge>
                    </div>
                    <Progress value={teacherDetails.lessonsCompleted} className="h-2" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Qualifications</h3>
                <ul className="list-disc list-inside mt-1 text-muted-foreground">
                  {teacher.qualifications.split(", ").map((qual, idx) => (
                    <li key={idx}>{qual}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="classes">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Assigned Classes</h3>
                <div className="border rounded-md divide-y">
                  {teacherDetails.classes.map((cls, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{cls.name} - {cls.subject}</h4>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {cls.schedule}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {cls.students} students
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Performance Metrics</h3>
                
                <div className="space-y-3">
                  {Object.entries(teacherDetails.performanceMetrics).map(([key, value], idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-sm font-medium">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Full Performance Report
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="development">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Certifications</h3>
                  <div className="mt-2 space-y-2">
                    {teacherDetails.certifications.map((cert, idx) => (
                      <div key={idx} className="border rounded-md p-3">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="font-medium">{cert.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {cert.issuer} • {cert.year}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Training History</h3>
                  <div className="mt-2 space-y-2">
                    {teacherDetails.trainingHistory.map((training, idx) => (
                      <div key={idx} className="border rounded-md p-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="font-medium">{training.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {formatDate(training.date)}
                          <Clock className="h-3 w-3 ml-2" />
                          {training.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Recommend Training
                  </Button>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherProfileView;
