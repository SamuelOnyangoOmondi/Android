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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { FileEdit, Trash2, MoreVertical, Search, UserPlus } from "lucide-react";

const teachers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@supaschool.com",
    department: "Science",
    subjects: ["Mathematics", "Physics"],
    status: "Full-time",
    joined: "Sep 2018",
    avatar: "",
  },
  {
    id: "2",
    name: "Mary Johnson",
    email: "mary.johnson@supaschool.com",
    department: "Languages",
    subjects: ["English", "Literature"],
    status: "Full-time",
    joined: "Jan 2019",
    avatar: "",
  },
  {
    id: "3",
    name: "David Mwangi",
    email: "david.mwangi@supaschool.com",
    department: "Social Studies",
    subjects: ["History", "Geography"],
    status: "Part-time",
    joined: "May 2020",
    avatar: "",
  },
  {
    id: "4",
    name: "Sarah Ochieng",
    email: "sarah.ochieng@supaschool.com",
    department: "Science",
    subjects: ["Biology", "Chemistry"],
    status: "Full-time",
    joined: "Aug 2017",
    avatar: "",
  },
  {
    id: "5",
    name: "James Kiprop",
    email: "james.kiprop@supaschool.com",
    department: "Sports",
    subjects: ["Physical Education"],
    status: "Full-time",
    joined: "Jan 2021",
    avatar: "",
  },
];

const TeacherList: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search teachers..."
            className="pl-10 w-full"
          />
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>
      
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Department</TableHead>
              <TableHead className="font-medium">Subjects</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Joined</TableHead>
              <TableHead className="font-medium w-[80px]">Actions</TableHead>
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
                    <div>
                      <div className="font-medium">{teacher.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {teacher.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{teacher.department}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map((subject, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    teacher.status === "Full-time" 
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }>
                    {teacher.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{teacher.joined}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem className="cursor-pointer">
                        <FileEdit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeacherList;
