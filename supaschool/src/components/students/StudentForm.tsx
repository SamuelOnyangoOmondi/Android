import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClasses } from "@/hooks/useClasses";
import type { Tables } from "@/integrations/supabase/types";

type DbStudent = Tables<"students">;

interface StudentFormProps {
  formMode: "add" | "edit";
  currentStudent: DbStudent | null;
  schoolId: string;
  onSubmit: (payload: {
    first_name: string;
    last_name: string;
    admission_number: string;
    nemis_id?: string | null;
    gender?: string | null;
    date_of_birth?: string | null;
    guardian_name?: string | null;
    guardian_phone?: string | null;
    class_id?: string | null;
  }) => void;
  onCancel: () => void;
}

const StudentForm = ({ formMode, currentStudent, schoolId, onSubmit, onCancel }: StudentFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nemisId, setNemisId] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [gender, setGender] = useState<string>("");
  const [classId, setClassId] = useState<string>("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  const { data: classes } = useClasses(schoolId);

  useEffect(() => {
    if (formMode === "edit" && currentStudent) {
      setFirstName(currentStudent.first_name);
      setLastName(currentStudent.last_name);
      setDateOfBirth(currentStudent.date_of_birth ?? "");
      setNemisId(currentStudent.nemis_id ?? "");
      setAdmissionNumber(currentStudent.admission_number);
      setGender(currentStudent.gender ?? "");
      setClassId(currentStudent.class_id ?? "");
      setGuardianName(currentStudent.guardian_name ?? "");
      setGuardianPhone(currentStudent.guardian_phone ?? "");
    }
  }, [formMode, currentStudent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      first_name: firstName,
      last_name: lastName,
      admission_number: admissionNumber,
      nemis_id: nemisId || null,
      gender: gender || null,
      date_of_birth: dateOfBirth || null,
      guardian_name: guardianName || null,
      guardian_phone: guardianPhone || null,
      class_id: classId || null,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {formMode === "add" ? "Add New Student" : "Edit Student"}
        </CardTitle>
        <CardDescription>
          {formMode === "add"
            ? "Fill in the details to add a new student"
            : "Update the student information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender || undefined} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="admissionNumber">Admission Number</Label>
                <Input
                  id="admissionNumber"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nemisId">NEMIS ID</Label>
                <Input
                  id="nemisId"
                  value={nemisId}
                  onChange={(e) => setNemisId(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="class">Class</Label>
                <Select value={classId || undefined} onValueChange={setClassId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="guardianPhone">Guardian Phone</Label>
                <Input
                  id="guardianPhone"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {formMode === "add" ? "Add Student" : "Update Student"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
