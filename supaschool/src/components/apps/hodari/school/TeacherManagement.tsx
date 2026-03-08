
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Filter, Edit, Mail, BookOpen, Calendar } from "lucide-react";

export const TeacherManagement = () => {
  // Sample teachers data
  const teachers = [
    {
      id: "1",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      school: "Riverside Elementary",
      subject: "Mathematics",
      students: 87,
      status: "active",
      joined: "Jan 15, 2023"
    },
    {
      id: "2",
      name: "Michael Johnson",
      email: "michael@example.com",
      school: "Riverside Elementary",
      subject: "Science",
      students: 92,
      status: "active",
      joined: "Mar 22, 2022"
    },
    {
      id: "3",
      name: "Sarah Williams",
      email: "sarah@example.com",
      school: "Highland Secondary School",
      subject: "English",
      students: 105,
      status: "active",
      joined: "Sep 5, 2023"
    },
    {
      id: "4",
      name: "Robert Davis",
      email: "robert@example.com",
      school: "Valley Middle School",
      subject: "History",
      students: 76,
      status: "inactive",
      joined: "Aug 10, 2022"
    },
    {
      id: "5",
      name: "Elizabeth Brown",
      email: "elizabeth@example.com",
      school: "Mountain View Academy",
      subject: "Geography",
      students: 88,
      status: "active",
      joined: "Jan 8, 2023"
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search teachers..." 
              className="pl-10 pr-4 py-2 text-sm rounded-md w-full border border-input bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.school}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.students}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      teacher.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{teacher.joined}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" title="Edit Teacher">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Send Email">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Manage Classes">
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="View Schedule">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
