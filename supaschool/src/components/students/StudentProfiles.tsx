
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, User, Calendar, BookOpen, Award } from "lucide-react";
import { mockStudents } from "./dashboardData";
import StudentProfileView from "./StudentProfileView";

const StudentProfiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  
  const filteredStudents = mockStudents.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nemisId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {selectedStudent ? (
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedStudent(null)}
            className="mb-4"
          >
            ← Back to Student List
          </Button>
          <StudentProfileView 
            studentId={selectedStudent} 
            students={mockStudents} 
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Student Profiles</h2>
            <div className="relative w-72">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Student Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Admission #</TableHead>
                    <TableHead>NEMIS ID</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell>{student.admissionNumber}</TableCell>
                        <TableCell>{student.nemisId}</TableCell>
                        <TableCell>Grade {student.gradeLevel}</TableCell>
                        <TableCell>{student.className}</TableCell>
                        <TableCell>
                          {student.gender.charAt(0).toUpperCase() + student.gender.slice(1)}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedStudent(student.id)}
                          >
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No students found matching "{searchTerm}"
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default StudentProfiles;
