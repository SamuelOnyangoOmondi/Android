
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Save } from "lucide-react";

// Sample data for the table
const teachers = [
  {
    id: "1",
    name: "John Smith",
    department: "Science",
    subjects: ["Mathematics", "Physics"],
    capacity: "Full",
    avatar: "",
  },
  {
    id: "2",
    name: "Mary Johnson",
    department: "Languages",
    subjects: ["English", "Literature"],
    capacity: "Available",
    avatar: "",
  },
  {
    id: "3",
    name: "David Mwangi",
    department: "Social Studies",
    subjects: ["History", "Geography"],
    capacity: "Limited",
    avatar: "",
  },
  {
    id: "4",
    name: "Sarah Ochieng",
    department: "Science",
    subjects: ["Biology", "Chemistry"],
    capacity: "Full",
    avatar: "",
  },
  {
    id: "5",
    name: "James Kiprop",
    department: "Sports",
    subjects: ["Physical Education"],
    capacity: "Available",
    avatar: "",
  },
];

// Sample subjects for selection
const availableSubjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", 
  "English", "Literature", "Kiswahili",
  "History", "Geography", "Religious Studies",
  "Computer Studies", "Business Studies", "Agriculture",
  "Art & Design", "Music", "Physical Education"
];

const TeacherSubjectsAssignment: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search teachers or subjects..."
            className="pl-10 w-full"
          />
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Save Assignments
        </Button>
      </div>
      
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-medium">Teacher</TableHead>
              <TableHead className="font-medium">Department</TableHead>
              <TableHead className="font-medium">Current Subjects</TableHead>
              <TableHead className="font-medium">Add Subject</TableHead>
              <TableHead className="font-medium">Workload Capacity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id} className="hover:bg-muted/20">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-muted">
                      <AvatarImage src={teacher.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {teacher.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{teacher.name}</div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{teacher.department}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects.map((subject, idx) => (
                      <Badge key={idx} variant="outline" className="py-1 px-2">
                        {subject}
                        <button className="ml-2 hover:text-red-500">×</button>
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubjects
                          .filter(subject => !teacher.subjects.includes(subject))
                          .map(subject => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="hover:bg-primary/10">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      teacher.capacity === "Full" 
                        ? "bg-red-500 hover:bg-red-600" 
                        : teacher.capacity === "Limited" 
                          ? "bg-yellow-500 hover:bg-yellow-600" 
                          : "bg-green-500 hover:bg-green-600"
                    }
                  >
                    {teacher.capacity}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeacherSubjectsAssignment;
