import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { UserPen, UserMinus, Search, HelpCircle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type DbStudent = Tables<"students">;

interface StudentTableProps {
  students: DbStudent[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEditStudent: (student: DbStudent) => void;
  onArchiveStudent: (id: string) => void;
  isLoading?: boolean;
}

const StudentTable = ({
  students,
  searchTerm,
  onSearchChange,
  onEditStudent,
  onArchiveStudent,
  isLoading,
}: StudentTableProps) => {
  const filteredStudents = students.filter(
    (student) =>
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.nemis_id?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      student.admission_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Student Records</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No students found. Add students or adjust your search.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Admission #</TableHead>
                <TableHead>NEMIS ID</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Guardian</TableHead>
                <TableHead>
                  <span className="inline-flex items-center gap-1">
                    Actions
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                            aria-label="Actions help"
                          >
                            <HelpCircle className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-[220px]">
                          <p className="font-medium mb-1">Actions</p>
                          <p className="text-xs text-muted-foreground">
                            Pencil: edit student details. Minus: archive student (remove from active list).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.first_name} {student.last_name}
                  </TableCell>
                  <TableCell>{student.admission_number}</TableCell>
                  <TableCell>{student.nemis_id ?? "—"}</TableCell>
                  <TableCell>
                    {student.gender
                      ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
                      : "—"}
                  </TableCell>
                  <TableCell>{student.guardian_name ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEditStudent(student)}
                              aria-label="Edit student"
                            >
                              <UserPen className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit student</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onArchiveStudent(student.id)}
                              aria-label="Archive student"
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Archive student (remove from active list)</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentTable;
