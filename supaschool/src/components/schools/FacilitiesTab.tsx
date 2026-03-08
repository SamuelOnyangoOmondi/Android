
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Facilities } from "@/components/dashboard/Facilities";
import { School } from "@/types/database";

interface FacilitiesTabProps {
  school: Partial<School>;
}

export function FacilitiesTab({ school }: FacilitiesTabProps) {
  return (
    <Card className="shadow-md bg-gradient-to-br from-white to-gray-100 border-none overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
      <CardContent className="p-6 pt-8">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">Facilities & Infrastructure</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/50 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium mb-4 text-primary">Classrooms & Capacity</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Classrooms:</span>
                <span className="font-medium">{school.total_classrooms}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Student-Teacher Ratio:</span>
                <span className="font-medium">{school.pupil_teacher_ratio}:1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Student-Classroom Ratio:</span>
                <span className="font-medium">{school.pupil_classroom_ratio}:1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Computer Labs:</span>
                <span className="font-medium">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Science Labs:</span>
                <span className="font-medium">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Library:</span>
                <span className="font-medium">1</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/50 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium mb-4 text-secondary">Sanitation Facilities</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Boys' Toilets:</span>
                <span className="font-medium">{school.boys_toilets || 10}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Girls' Toilets:</span>
                <span className="font-medium">{school.girls_toilets || 12}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Teachers' Toilets:</span>
                <span className="font-medium">{school.teachers_toilets || 4}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Toilets:</span>
                <span className="font-medium">{school.total_toilets || 26}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Student-Toilet Ratio:</span>
                <span className="font-medium">{school.pupil_toilet_ratio || 38}:1</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Facilities />
        </div>
      </CardContent>
    </Card>
  );
}
