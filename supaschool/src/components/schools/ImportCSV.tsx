import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import Papa from 'papaparse';
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ImportCSV() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const importMutation = useMutation({
    mutationFn: async (schools: any[]) => {
      console.log('Importing schools:', schools[0]); // Log first school for debugging
      const { data, error } = await supabase
        .from('schools')
        .insert(schools.map(school => ({
          name: school['Name of School'],
          level_of_education: school['Level of Education'],
          school_status: school['Status of School'],
          sponsor: school['Sponsor of School'],
          institution_type_1: school['School Institution Type_1'],
          institution_type_2: school['School Institution Type_2'],
          institution_type_3: school['School Institution Type_3'],
          province: school['Province'],
          county: school['County'],
          district: school['District'],
          division: school['Division'],
          location: school['Location'],
          constituency: school['Costituency'],
          pupil_teacher_ratio: school['Pupil Teacher Ratio'],
          pupil_classroom_ratio: school['Pupil Classroom Ratio'],
          pupil_toilet_ratio: school['Pupil Toilet Ratio'],
          total_classrooms: school['Total Number of Classrooms'],
          boys_toilets: school['Boys Toilets'],
          girls_toilets: school['Girls Toilets'],
          total_toilets: school['Total Toilets'],
          teachers_toilets: school['Teachers Toilets'],
          total_boys: school['Total Boys'],
          total_girls: school['Total Girls'],
          total_enrollment: school['Total Enrolment'],
          gok_tsc_male: school['GOK TSC Male'],
          gok_tsc_female: school['GOK TSC Female'],
          local_authority_male: school['Local Authority Male'],
          local_authority_female: school['Local Authority Female'],
          pta_bog_male: school['PTA BOG Male'],
          pta_bog_female: school['PTA BOG Female'],
          others_male: school['Others Male'],
          others_female: school['Others Female'],
          non_teaching_staff_male: school['Non-Teaching Staff Male'],
          non_teaching_staff_female: school['Non-Teaching Staff Female'],
          geolocation: school['Geolocation']
        })));
      
      if (error) {
        console.error('Error importing schools:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast({
        title: "Success",
        description: "Schools imported successfully",
      });
      setIsUploading(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to import schools: " + error.message,
        variant: "destructive",
      });
      console.error('Import error:', error);
      setIsUploading(false);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        console.log('CSV Parse Results:', results.data[0]); // Log first row for debugging
        importMutation.mutate(results.data);
      },
      error: (error) => {
        console.error('CSV Parse Error:', error);
        toast({
          title: "Error",
          description: "Failed to parse CSV file: " + error.message,
          variant: "destructive",
        });
        setIsUploading(false);
      }
    });
  };

  return (
    <div className="flex gap-4">
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="max-w-xs"
        disabled={isUploading}
      />
      <Button disabled={isUploading}>
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </>
        )}
      </Button>
    </div>
  );
}