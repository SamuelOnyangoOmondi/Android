
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Student } from "@/types/student";
import { 
  User, 
  Calendar, 
  BookOpen, 
  Award, 
  Clock, 
  Phone, 
  Mail, 
  Home, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle 
} from "lucide-react";
import { mockAttendanceRecords, mockAcademicRecords } from "./dashboardData";

interface StudentProfileViewProps {
  studentId: string;
  students: Student[];
}

const StudentProfileView: React.FC<StudentProfileViewProps> = ({ studentId, students }) => {
  const student = students.find(s => s.id === studentId);
  
  if (!student) {
    return <div>Student not found</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card className="dashboard-card">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <img
                src={student.profileImageUrl || "/placeholder.svg"}
                alt={`${student.firstName} ${student.lastName}`}
              />
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {student.firstName} {student.lastName}
              </CardTitle>
              <CardDescription>
                Grade {student.gradeLevel} | Class {student.className} | {student.admissionNumber}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Personal Info</span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Attendance</span>
              </TabsTrigger>
              <TabsTrigger value="academics" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Academics</span>
              </TabsTrigger>
              <TabsTrigger value="extracurricular" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Extracurricular</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Personal Information Tab */}
            <TabsContent value="info" className="pt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Student Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-32">Full Name:</span>
                        <span>{student.firstName} {student.lastName}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-32">Date of Birth:</span>
                        <span>{new Date(student.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-32">NEMIS ID:</span>
                        <span>{student.nemisId}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-32">Admission #:</span>
                        <span>{student.admissionNumber}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-32">Enrollment Date:</span>
                        <span>{new Date(student.enrollmentDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-32">Email:</span>
                        <span>{student.contactInfo.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-32">Phone:</span>
                        <span>{student.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-32">Address:</span>
                        <span>{student.contactInfo.address}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Guardian Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-32">Name:</span>
                        <span>{student.guardianInfo.name}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-32">Relationship:</span>
                        <span>{student.guardianInfo.relationship}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-32">Email:</span>
                        <span>{student.guardianInfo.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-32">Phone:</span>
                        <span>{student.guardianInfo.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground w-32">Address:</span>
                        <span>{student.guardianInfo.address}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Attendance Tab */}
            <TabsContent value="attendance" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Attendance Record</CardTitle>
                  <CardDescription>Recent attendance history</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAttendanceRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {record.status === "present" && (
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                <span>Present</span>
                              </div>
                            )}
                            {record.status === "absent" && (
                              <div className="flex items-center">
                                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                <span>Absent</span>
                              </div>
                            )}
                            {record.status === "late" && (
                              <div className="flex items-center">
                                <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                                <span>Late</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{record.note || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Academics Tab */}
            <TabsContent value="academics" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Academic Performance</CardTitle>
                  <CardDescription>Term 1, 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Teacher Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAcademicRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.subject}</TableCell>
                          <TableCell>{record.score}/100</TableCell>
                          <TableCell>
                            <span className={`font-bold ${
                              record.grade.startsWith('A') ? 'text-green-500' : 
                              record.grade.startsWith('B') ? 'text-blue-500' : 
                              record.grade.startsWith('C') ? 'text-yellow-500' : 
                              record.grade.startsWith('D') ? 'text-orange-500' : 'text-red-500'
                            }`}>
                              {record.grade}
                            </span>
                          </TableCell>
                          <TableCell>{record.teacherRemarks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Extracurricular Tab */}
            <TabsContent value="extracurricular" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Extracurricular Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No extracurricular activities recorded yet.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfileView;
