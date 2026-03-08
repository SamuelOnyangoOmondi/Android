
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search, Check } from "lucide-react";

export const MediaAssignment = () => {
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  // Sample data
  const mediaItems = [
    { id: "1", title: "Introduction to Algebra", type: "video" },
    { id: "2", title: "Cell Structure Diagram", type: "image" },
    { id: "3", title: "World History Timeline", type: "document" },
    { id: "4", title: "Chemistry Experiment Guide", type: "document" },
    { id: "5", title: "Physics Motion Demonstration", type: "video" },
  ];

  const schools = [
    { id: "1", name: "Riverside Elementary" },
    { id: "2", name: "Highland Secondary School" },
    { id: "3", name: "Valley Middle School" },
    { id: "4", name: "Mountain View Academy" },
  ];

  const classes = [
    { id: "1", name: "Grade 3A", school: "1" },
    { id: "2", name: "Grade 4B", school: "1" },
    { id: "3", name: "Grade 9 Science", school: "2" },
    { id: "4", name: "Grade 8 Math", school: "2" },
    { id: "5", name: "Grade 6C", school: "3" },
    { id: "6", name: "Grade 7A", school: "3" },
    { id: "7", name: "Year 10 Physics", school: "4" },
  ];

  // Toggle selection of media items
  const toggleMediaSelection = (id: string) => {
    setSelectedMedia(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Toggle selection of schools
  const toggleSchoolSelection = (id: string) => {
    setSelectedSchools(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Toggle selection of classes
  const toggleClassSelection = (id: string) => {
    setSelectedClasses(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Media selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Content</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="search" 
                placeholder="Search content..." 
                className="pl-10 pr-4 py-2 text-sm rounded-md w-full border border-input bg-transparent"
              />
            </div>
            <div className="border rounded-md divide-y max-h-80 overflow-y-auto">
              {mediaItems.map(item => (
                <div 
                  key={item.id} 
                  className="p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleMediaSelection(item.id)}
                >
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                  </div>
                  {selectedMedia.includes(item.id) && (
                    <div className="bg-primary text-white p-1 rounded-full">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* School selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Schools</h3>
            <div className="border rounded-md divide-y max-h-80 overflow-y-auto">
              {schools.map(school => (
                <div 
                  key={school.id} 
                  className="p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleSchoolSelection(school.id)}
                >
                  <p className="text-sm font-medium">{school.name}</p>
                  {selectedSchools.includes(school.id) && (
                    <div className="bg-primary text-white p-1 rounded-full">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Class selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Classes</h3>
            <div className="border rounded-md divide-y max-h-80 overflow-y-auto">
              {classes
                .filter(cls => selectedSchools.length === 0 || selectedSchools.includes(cls.school))
                .map(cls => (
                  <div 
                    key={cls.id} 
                    className="p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleClassSelection(cls.id)}
                  >
                    <div>
                      <p className="text-sm font-medium">{cls.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {schools.find(s => s.id === cls.school)?.name}
                      </p>
                    </div>
                    {selectedClasses.includes(cls.id) && (
                      <div className="bg-primary text-white p-1 rounded-full">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* Assignment actions */}
        <div className="mt-6 border-t pt-6 flex justify-between">
          <div>
            <p className="text-sm font-medium">
              Assigning {selectedMedia.length} content items to {selectedClasses.length} classes
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button 
              disabled={selectedMedia.length === 0 || selectedClasses.length === 0}
            >
              Assign Content
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
