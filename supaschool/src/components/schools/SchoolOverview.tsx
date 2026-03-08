
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SchoolInfo } from "@/components/dashboard/SchoolInfo";
import { Facilities } from "@/components/dashboard/Facilities";
import { Announcements } from "@/components/dashboard/Announcements";
import { School } from "@/types/database";

interface SchoolOverviewProps {
  school: Partial<School>;
  onEditProfile: () => void;
}

export function SchoolOverview({ school, onEditProfile }: SchoolOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <Card className="shadow-soft hover:shadow-hover transition-all duration-300 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <CardContent className="p-6">
            <SchoolInfo 
              name={school.name || ""}
              county={school.county || ""}
              totalStudents={school.total_enrollment || 0}
              teacherCount={12}
              classCount={6}
              location={school.location || ""}
              phone={[school.phone || ""]}
              email={school.email || ""}
              website="kisumuprimary.ac.ke"
              onEdit={onEditProfile}
            />
          </CardContent>
        </Card>
        
        <Card className="shadow-soft hover:shadow-hover transition-all duration-300 rounded-lg border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <Facilities />
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-1">
        <Card className="shadow-soft hover:shadow-hover transition-all duration-300 h-full rounded-lg border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <Announcements />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
