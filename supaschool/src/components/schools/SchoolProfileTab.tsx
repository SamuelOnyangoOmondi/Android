
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SchoolProfileForm } from "@/components/dashboard/SchoolProfileForm";
import { School } from "@/types/database";

interface SchoolProfileTabProps {
  school: Partial<School>;
  editMode: boolean;
  onSave: (values: any) => void;
  onEdit: () => void;
}

export function SchoolProfileTab({ 
  school, 
  editMode, 
  onSave, 
  onEdit 
}: SchoolProfileTabProps) {
  return (
    <>
      {editMode ? (
        <Card className="shadow-md bg-gradient-to-br from-white to-gray-100 border-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
          <CardContent className="p-6 pt-8">
            <SchoolProfileForm school={school} onSave={onSave} />
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-md bg-gradient-to-br from-white to-gray-100 border-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
          <CardContent className="p-6 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">School Profile</h2>
              <button 
                onClick={onEdit}
                className="text-sm bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity shadow-sm"
              >
                Edit Profile
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/50 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium mb-4 text-primary">General Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">School Name</p>
                    <p className="font-medium">{school.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Level of Education</p>
                    <p>{school.level_of_education}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">School Status</p>
                    <p>{school.school_status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">County</p>
                    <p>{school.county}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/50 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium mb-4 text-secondary">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p>{school.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{school.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{school.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p>kisumuprimary.ac.ke</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
