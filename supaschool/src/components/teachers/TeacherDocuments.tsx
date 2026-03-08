
import React from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  MoreVertical,
  Filter,
} from "lucide-react";

// Sample document data
const documents = [
  {
    id: "1",
    name: "Physics Lesson Plan - Term 1",
    teacher: "John Smith",
    type: "Lesson Plan",
    subject: "Physics",
    uploadDate: "2023-01-15",
    size: "1.2 MB",
    avatar: "",
  },
  {
    id: "2",
    name: "English Literature Notes",
    teacher: "Mary Johnson",
    type: "Notes",
    subject: "English",
    uploadDate: "2023-02-20",
    size: "3.5 MB",
    avatar: "",
  },
  {
    id: "3",
    name: "History Term 2 Assessment",
    teacher: "David Mwangi",
    type: "Assessment",
    subject: "History",
    uploadDate: "2023-03-05",
    size: "890 KB",
    avatar: "",
  },
  {
    id: "4",
    name: "Chemistry Lab Guide",
    teacher: "Sarah Ochieng",
    type: "Guide",
    subject: "Chemistry",
    uploadDate: "2023-03-18",
    size: "4.1 MB",
    avatar: "",
  },
  {
    id: "5",
    name: "PE Curriculum Planning",
    teacher: "James Kiprop",
    type: "Curriculum",
    subject: "Physical Education",
    uploadDate: "2023-04-02",
    size: "2.6 MB",
    avatar: "",
  },
];

const TeacherDocuments: React.FC = () => {
  const [selectedTeacher, setSelectedTeacher] = React.useState<string | null>(null);
  const [selectedDocType, setSelectedDocType] = React.useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = React.useState<string | null>(null);
  
  const filteredDocuments = documents.filter(doc => {
    if (selectedTeacher && doc.teacher !== selectedTeacher) return false;
    if (selectedDocType && doc.type !== selectedDocType) return false;
    if (selectedSubject && doc.subject !== selectedSubject) return false;
    return true;
  });

  // Extract unique values for filters
  const teachers = [...new Set(documents.map(doc => doc.teacher))];
  const docTypes = [...new Set(documents.map(doc => doc.type))];
  const subjects = [...new Set(documents.map(doc => doc.subject))];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-8 w-full"
          />
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
      
      <div className="flex gap-3 mb-4">
        <Select value={selectedTeacher || ""} onValueChange={setSelectedTeacher}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Teachers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Teachers</SelectItem>
            {teachers.map(teacher => (
              <SelectItem key={teacher} value={teacher}>
                {teacher}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedDocType || ""} onValueChange={setSelectedDocType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Document Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Document Types</SelectItem>
            {docTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedSubject || ""} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Subjects</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Teacher Documents</CardTitle>
          <CardDescription>
            Manage and access teacher lesson plans, notes, and assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={doc.avatar} />
                          <AvatarFallback>
                            {doc.teacher
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{doc.teacher}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.type}</Badge>
                    </TableCell>
                    <TableCell>{doc.subject}</TableCell>
                    <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Replace File
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredDocuments.length} of {documents.length} documents
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TeacherDocuments;
