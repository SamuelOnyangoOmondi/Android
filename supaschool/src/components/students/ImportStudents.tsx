import React, { useState, useCallback, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Papa from "papaparse";

export type ImportStudentRow = {
  first_name?: string;
  lastName?: string;
  firstName?: string;
  last_name?: string;
  admission_number?: string;
  admissionNumber?: string;
  nemis_id?: string;
  nemisId?: string;
  gender?: string;
  guardian_name?: string;
  guardianName?: string;
  guardian_phone?: string;
  guardianPhone?: string;
  date_of_birth?: string;
  dateOfBirth?: string;
  class_name?: string;
  className?: string;
};

interface ImportStudentsProps {
  schoolId: string;
  onImportStudents: (students: ImportStudentRow[]) => void;
}

const ImportStudents = ({ schoolId, onImportStudents }: ImportStudentsProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ImportStudentRow[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const normalize = (row: Record<string, unknown>): ImportStudentRow => ({
    first_name: (row.first_name ?? row.firstName ?? row["First Name"]) as string,
    last_name: (row.last_name ?? row.lastName ?? row["Last Name"]) as string,
    admission_number: (row.admission_number ?? row.admissionNumber ?? row["Admission Number"]) as string,
    nemis_id: (row.nemis_id ?? row.nemisId ?? row["NEMIS ID"]) as string,
    gender: (row.gender ?? row["Gender"]) as string,
    guardian_name: (row.guardian_name ?? row.guardianName ?? row["Guardian Name"]) as string,
    guardian_phone: (row.guardian_phone ?? row.guardianPhone ?? row["Guardian Phone"]) as string,
    date_of_birth: (row.date_of_birth ?? row.dateOfBirth ?? row["Date of Birth"]) as string,
    class_name: (row.class_name ?? row.className ?? row["Class"] ?? row["Grade"]) as string,
  });

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) {
        const file = e.dataTransfer.files[0];
        if (file.type === "text/csv") handleFile(file);
        else {
          setParseError("Please upload a CSV file");
          toast({ title: "Invalid file type", description: "Please upload a CSV file", variant: "destructive" });
        }
      }
    },
    [toast]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === "text/csv") handleFile(file);
    else {
      setParseError("Please upload a CSV file");
      toast({ title: "Invalid file type", description: "Please upload a CSV file", variant: "destructive" });
    }
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setParseError(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setParseError(`Error parsing CSV: ${results.errors[0].message}`);
          toast({
            title: "CSV parsing error",
            description: results.errors[0].message,
            variant: "destructive",
          });
          return;
        }
        const required = ["first_name", "firstName", "First Name", "last_name", "lastName", "Last Name", "admission_number", "admissionNumber", "Admission Number"];
        const hasRequired = results.meta.fields?.some((f) =>
          required.some((r) => r.toLowerCase() === String(f).toLowerCase())
        );
        if (!hasRequired || !results.data?.length) {
          setParseError("CSV must contain first name, last name, and admission number columns");
          toast({
            title: "Invalid CSV format",
            description: "Required: first name, last name, admission number",
            variant: "destructive",
          });
          return;
        }
        const students = (results.data as Record<string, unknown>[]).map(normalize);
        setParsedData(students);
        toast({ title: "CSV parsed", description: `Found ${students.length} student records` });
      },
    });
  };

  const handleImport = () => {
    if (parsedData?.length) {
      onImportStudents(parsedData);
      setSelectedFile(null);
      setParsedData(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Students</CardTitle>
        <CardDescription>
          Upload a CSV with columns: first_name, last_name, admission_number. Optional: class_name (or Class), nemis_id, gender, guardian_name, guardian_phone, date_of_birth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`flex items-center justify-center p-6 border-2 border-dashed rounded-lg ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"} ${parseError ? "border-destructive/50 bg-destructive/10" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            {selectedFile ? (
              <>
                <FileText className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-medium mb-2">File Selected</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Upload Student Records</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop a CSV file or click to browse
                </p>
              </>
            )}
            {parseError && (
              <div className="flex items-center justify-center mb-4 p-2 bg-destructive/10 text-destructive rounded">
                <AlertCircle className="h-4 w-4 mr-2" />
                <p className="text-sm">{parseError}</p>
              </div>
            )}
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              {selectedFile ? "Change File" : "Select File"}
            </Button>
          </div>
        </div>
        {parsedData && parsedData.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Preview:</h4>
              <span className="text-sm text-muted-foreground">{parsedData.length} records found</span>
            </div>
            <div className="border rounded overflow-auto max-h-48">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Admission #</th>
                    <th className="p-2 text-left">Class</th>
                    <th className="p-2 text-left">NEMIS ID</th>
                    <th className="p-2 text-left">Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 5).map((student, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">
                        {student.first_name ?? student.firstName} {student.last_name ?? student.lastName}
                      </td>
                      <td className="p-2">{student.admission_number ?? student.admissionNumber}</td>
                      <td className="p-2">{student.class_name ?? student.className ?? "—"}</td>
                      <td className="p-2">{student.nemis_id ?? student.nemisId}</td>
                      <td className="p-2">{student.gender}</td>
                    </tr>
                  ))}
                  {parsedData.length > 5 && (
                    <tr className="border-t">
                      <td colSpan={5} className="p-2 text-center text-muted-foreground">
                        + {parsedData.length - 5} more records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
      {parsedData && parsedData.length > 0 && (
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedFile(null);
              setParsedData(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleImport}>Import {parsedData.length} Students</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ImportStudents;
