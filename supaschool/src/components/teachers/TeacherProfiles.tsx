
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MoreVertical, Filter, Eye, FileEdit, Mail, Phone } from "lucide-react";
import TeacherProfileView from "./TeacherProfileView";

// Sample data for the table
const teachers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@supaschool.com",
    phone: "+254 712 345 678",
    subjects: ["Mathematics", "Physics"],
    department: "Science",
    employmentDate: "2018-09-01",
    qualifications: "M.Ed, B.Sc",
    status: "Full-time",
    performance: 87,
    avatar: "",
  },
  {
    id: "2",
    name: "Mary Johnson",
    email: "mary.johnson@supaschool.com",
    phone: "+254 723 456 789",
    subjects: ["English", "Literature"],
    department: "Languages",
    employmentDate: "2019-01-15",
    qualifications: "B.Ed, M.A",
    status: "Full-time",
    performance: 92,
    avatar: "",
  },
  {
    id: "3",
    name: "David Mwangi",
    email: "david.mwangi@supaschool.com",
    phone: "+254 734 567 890",
    subjects: ["History", "Geography"],
    department: "Social Studies",
    employmentDate: "2020-05-10",
    qualifications: "B.Ed",
    status: "Part-time",
    performance: 78,
    avatar: "",
  },
  {
    id: "4",
    name: "Sarah Ochieng",
    email: "sarah.ochieng@supaschool.com",
    phone: "+254 745 678 901",
    subjects: ["Biology", "Chemistry"],
    department: "Science",
    employmentDate: "2017-08-22",
    qualifications: "Ph.D, M.Sc, B.Sc",
    status: "Full-time",
    performance: 95,
    avatar: "",
  },
  {
    id: "5",
    name: "James Kiprop",
    email: "james.kiprop@supaschool.com",
    phone: "+254 756 789 012",
    subjects: ["Physical Education"],
    department: "Sports",
    employmentDate: "2021-01-05",
    qualifications: "B.Ed",
    status: "Full-time",
    performance: 81,
    avatar: "",
  },
];

const TeacherProfiles: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<typeof teachers[0] | null>(null);
  const [viewProfile, setViewProfile] = useState(false);

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subjects.some(subject => 
      subject.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleViewProfile = (teacher: typeof teachers[0]) => {
    setSelectedTeacher(teacher);
    setViewProfile(true);
  };

  const closeProfile = () => {
    setViewProfile(false);
    setSelectedTeacher(null);
  };

  const getPerformanceBadgeColor = (performance: number) => {
    if (performance >= 90) return "bg-green-500 hover:bg-green-600";
    if (performance >= 80) return "bg-blue-500 hover:bg-blue-600";
    if (performance >= 70) return "bg-yellow-500 hover:bg-yellow-600";
    return "bg-red-500 hover:bg-red-600";
  };

  return (
    <>
      {viewProfile && selectedTeacher ? (
        <TeacherProfileView teacher={selectedTeacher} onClose={closeProfile} />
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Teacher Profiles</CardTitle>
              <CardDescription>
                View detailed information about teachers in your school
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search teachers..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={teacher.avatar} />
                              <AvatarFallback>
                                {teacher.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{teacher.name}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {teacher.email}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {teacher.phone}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{teacher.department}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {teacher.subjects.map((subject, idx) => (
                              <Badge key={idx} variant="outline">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{teacher.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPerformanceBadgeColor(teacher.performance)}>
                            {teacher.performance}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewProfile(teacher)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileEdit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuItem>View Schedule</DropdownMenuItem>
                              <DropdownMenuItem>Performance Report</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">Next</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default TeacherProfiles;
