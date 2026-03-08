
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Upload, Filter, ArrowDownUp } from "lucide-react";
import TeacherList from "./TeacherList";
import TeacherSubjectsAssignment from "./TeacherSubjectsAssignment";
import TeacherScheduling from "./TeacherScheduling";
import TeacherDocuments from "./TeacherDocuments";

const ManageTeachers: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [openAddTeacher, setOpenAddTeacher] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ArrowDownUp className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm" onClick={() => setOpenAddTeacher(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Teachers</CardTitle>
          <CardDescription>
            Add, edit, or assign teachers to subjects and schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="list">Teacher List</TabsTrigger>
              <TabsTrigger value="subjects">Subject Assignment</TabsTrigger>
              <TabsTrigger value="schedule">Scheduling</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <TeacherList />
            </TabsContent>
            
            <TabsContent value="subjects">
              <TeacherSubjectsAssignment />
            </TabsContent>
            
            <TabsContent value="schedule">
              <TeacherScheduling />
            </TabsContent>
            
            <TabsContent value="documents">
              <TeacherDocuments />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={openAddTeacher} onOpenChange={setOpenAddTeacher}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
            <DialogDescription>
              Enter the details of the new teacher to add them to your school system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter first name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter last name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nationalId">National ID</Label>
              <Input id="nationalId" placeholder="Enter national ID" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employmentDate">Employment Date</Label>
              <Input id="employmentDate" type="date" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="languages">Languages</SelectItem>
                  <SelectItem value="socialStudies">Social Studies</SelectItem>
                  <SelectItem value="arts">Arts</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Employment Status</Label>
              <Select>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fullTime">Full-time</SelectItem>
                  <SelectItem value="partTime">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="probation">Probation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Input id="qualifications" placeholder="e.g., B.Ed, M.Ed, Ph.D" />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Enter address" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddTeacher(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageTeachers;
