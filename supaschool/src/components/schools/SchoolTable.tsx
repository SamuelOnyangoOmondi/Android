
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School } from "@/types/database";

interface SchoolTableProps {
  schools: School[];
}

export function SchoolTable({ schools }: SchoolTableProps) {
  if (!schools?.length) {
    return (
      <Card className="shadow-md rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle>No Schools Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Upload a CSV file to import schools. The CSV should include columns for school details including name, location, education level, and various statistics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-medium">Name</TableHead>
            <TableHead className="font-medium">Location</TableHead>
            <TableHead className="font-medium">Level</TableHead>
            <TableHead className="font-medium">Total Students</TableHead>
            <TableHead className="font-medium">Total Teachers</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schools.map((school) => (
            <TableRow key={school.id} className="hover:bg-muted/20">
              <TableCell className="font-medium">{school.name}</TableCell>
              <TableCell className="text-muted-foreground">{`${school.county || ''}, ${school.constituency || ''}`}</TableCell>
              <TableCell>{school.level_of_education}</TableCell>
              <TableCell>{school.total_enrollment}</TableCell>
              <TableCell>
                {(school.gok_tsc_male || 0) + 
                 (school.gok_tsc_female || 0) + 
                 (school.local_authority_male || 0) + 
                 (school.local_authority_female || 0) + 
                 (school.pta_bog_male || 0) + 
                 (school.pta_bog_female || 0) + 
                 (school.others_male || 0) + 
                 (school.others_female || 0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
