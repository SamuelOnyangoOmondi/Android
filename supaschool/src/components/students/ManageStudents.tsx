import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import StudentForm from "./StudentForm";
import StudentTable from "./StudentTable";
import ImportStudents, { type ImportStudentRow } from "./ImportStudents";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import { useStudents, useCreateStudent, useCreateStudentsBulk, useUpdateStudent, useArchiveStudent } from "@/hooks/useStudents";
import { useClasses } from "@/hooks/useClasses";
import type { Tables } from "@/integrations/supabase/types";
import { Users } from "lucide-react";

type DbStudent = Tables<"students">;

const ManageStudents = () => {
  const [schoolId, setSchoolId] = useState("");
  const [classId, setClassId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [currentStudent, setCurrentStudent] = useState<DbStudent | null>(null);
  const { toast } = useToast();

  const { data: students = [], isLoading } = useStudents({
    schoolId,
    classId: classId || undefined,
    search: searchTerm || undefined,
    isActive: true,
  });

  const createMutation = useCreateStudent();
  const createBulkMutation = useCreateStudentsBulk();
  const updateMutation = useUpdateStudent();
  const archiveMutation = useArchiveStudent();
  const { data: classes = [] } = useClasses(schoolId || undefined);

  const resetForm = () => {
    setFormMode(null);
    setCurrentStudent(null);
  };

  const handleEditStudent = (student: DbStudent) => {
    setCurrentStudent(student);
    setFormMode("edit");
  };

  const handleArchiveStudent = async (id: string) => {
    try {
      await archiveMutation.mutateAsync(id);
      toast({
        title: "Student archived",
        description: "Student has been archived successfully",
      });
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to archive student",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (payload: {
    first_name: string;
    last_name: string;
    admission_number: string;
    nemis_id?: string | null;
    gender?: string | null;
    date_of_birth?: string | null;
    guardian_name?: string | null;
    guardian_phone?: string | null;
    class_id?: string | null;
  }) => {
    if (!schoolId) {
      toast({
        title: "Select a school",
        description: "Please select a school first",
        variant: "destructive",
      });
      return;
    }

    try {
      if (formMode === "add") {
        await createMutation.mutateAsync({
          school_id: schoolId,
          first_name: payload.first_name,
          last_name: payload.last_name,
          admission_number: payload.admission_number,
          nemis_id: payload.nemis_id ?? null,
          gender: payload.gender || null,
          date_of_birth: payload.date_of_birth || null,
          guardian_name: payload.guardian_name || null,
          guardian_phone: payload.guardian_phone || null,
          class_id: payload.class_id || null,
        });
        toast({
          title: "Student added",
          description: "Student has been added successfully",
        });
      } else if (formMode === "edit" && currentStudent) {
        await updateMutation.mutateAsync({
          id: currentStudent.id,
          payload: {
            first_name: payload.first_name,
            last_name: payload.last_name,
            admission_number: payload.admission_number,
            nemis_id: payload.nemis_id ?? null,
            gender: payload.gender ?? null,
            date_of_birth: payload.date_of_birth ?? null,
            guardian_name: payload.guardian_name ?? null,
            guardian_phone: payload.guardian_phone ?? null,
            class_id: payload.class_id ?? null,
          },
        });
        toast({
          title: "Student updated",
          description: "Student has been updated successfully",
        });
      }
      resetForm();
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save student",
        variant: "destructive",
      });
    }
  };

  const handleImportStudents = async (imported: ImportStudentRow[]) => {
    if (!schoolId) {
      toast({
        title: "Select a school",
        description: "Please select a school first",
        variant: "destructive",
      });
      return;
    }

    const classByName = new Map(
      classes.map((c) => [c.name.trim().toLowerCase(), c.id])
    );

    const payloads = imported.map((s) => {
      const rawClass = (s.class_name ?? s.className ?? "").toString().trim();
      const classId = rawClass
        ? classByName.get(rawClass.toLowerCase()) ?? null
        : null;
      const first = (s.first_name ?? s.firstName ?? "").toString().trim();
      const last = (s.last_name ?? s.lastName ?? "").toString().trim();
      const adm = (s.admission_number ?? s.admissionNumber ?? "").toString().trim();
      return {
        school_id: schoolId,
        first_name: first || "",
        last_name: last || "",
        admission_number: adm || "",
        nemis_id: (s.nemis_id ?? s.nemisId ?? "").toString().trim() || null,
        gender: (s.gender ?? "").toString().trim() || null,
        date_of_birth: (s.date_of_birth ?? s.dateOfBirth ?? "").toString().trim() || null,
        guardian_name: (s.guardian_name ?? s.guardianName ?? "").toString().trim() || null,
        guardian_phone: (s.guardian_phone ?? s.guardianPhone ?? "").toString().trim() || null,
        class_id: classId,
      };
    });

    const invalidClassNames = [
      ...new Set(
        imported
          .map((s) => (s.class_name ?? s.className ?? "").toString().trim())
          .filter(Boolean)
          .filter((name) => !classByName.get(name.toLowerCase()))
      ),
    ];
    if (invalidClassNames.length > 0) {
      toast({
        title: "Some classes not found",
        description: `No matching class for: ${invalidClassNames.join(", ")}. Those students were imported without a class.`,
        variant: "default",
      });
    }

    try {
      await createBulkMutation.mutateAsync(payloads);
      toast({
        title: "Students imported",
        description: `Successfully imported ${imported.length} students`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof (err as { message?: string })?.message === "string"
            ? (err as { message: string }).message
            : typeof (err as { error_description?: string })?.error_description === "string"
              ? (err as { error_description: string }).error_description
              : typeof (err as { details?: string })?.details === "string"
                ? (err as { details: string }).details
                : "Failed to import students";
      toast({
        title: "Failed to import students",
        description: msg,
        variant: "destructive",
      });
    }
  };

  if (!schoolId) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Manage Students</h2>
        <div className="space-y-2">
          <label className="text-sm font-medium">Select school</label>
          <SchoolFilter value={schoolId} onValueChange={setSchoolId} />
        </div>
        <EmptyState
          icon={Users}
          title="Select a school"
          description="Choose a school to view and manage students"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <h2 className="text-xl font-semibold">Manage Students</h2>
          <SchoolFilter value={schoolId} onValueChange={setSchoolId} />
        </div>
        {!formMode && (
          <Button onClick={() => setFormMode("add")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Student
          </Button>
        )}
      </div>

      {formMode ? (
        <StudentForm
          formMode={formMode}
          currentStudent={currentStudent}
          schoolId={schoolId}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      ) : (
        <>
          <StudentTable
            students={students}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEditStudent={handleEditStudent}
            onArchiveStudent={handleArchiveStudent}
            isLoading={isLoading}
          />
          <ImportStudents
            schoolId={schoolId}
            onImportStudents={handleImportStudents}
          />
        </>
      )}
    </div>
  );
};

export default ManageStudents;
