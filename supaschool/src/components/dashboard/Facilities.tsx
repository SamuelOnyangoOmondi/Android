
import React, { useState } from "react";
import { Monitor, Beaker, BookOpen, Dumbbell, Ruler, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FacilityData } from "./FacilityCard";
import { FacilitiesGrid } from "./FacilitiesGrid";
import { FacilityEditControls } from "./FacilityEditControls";
import { Button } from "@/components/ui/button";

const iconOptions = [
  { icon: <Monitor size={22} />, name: "Monitor" },
  { icon: <Beaker size={22} />, name: "Beaker" },
  { icon: <BookOpen size={22} />, name: "BookOpen" },
  { icon: <Dumbbell size={22} />, name: "Dumbbell" },
  { icon: <Ruler size={22} />, name: "Ruler" }
];

const colorOptions = ["purple", "blue", "green", "pink", "orange", "yellow"];

export function Facilities() {
  const [isEditing, setIsEditing] = useState(false);
  const [facilities, setFacilities] = useState<FacilityData[]>([
    {
      icon: <Monitor size={22} />,
      count: "25",
      label: "Classrooms",
      color: "purple",
      max: 30
    },
    {
      icon: <Monitor size={22} />,
      count: "01",
      label: "Computer laboratory",
      color: "blue",
      max: 3
    },
    {
      icon: <Beaker size={22} />,
      count: "01",
      label: "Science laboratory",
      color: "green",
      max: 2
    },
    {
      icon: <BookOpen size={22} />,
      count: "01",
      label: "School Library",
      color: "pink",
      max: 1
    },
    {
      icon: <Dumbbell size={22} />,
      count: "00",
      label: "Gymnasium",
      color: "orange",
      max: 1
    },
    {
      icon: <Ruler size={22} />,
      count: "01",
      label: "Sports fields",
      color: "yellow",
      max: 2
    }
  ]);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Facility information updated successfully");
    // In a real app, you would save to database here
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    toast.info("Editing cancelled");
  };

  const updateFacility = (index: number, count: string, max: number, label: string) => {
    setFacilities(prev => {
      const newFacilities = [...prev];
      newFacilities[index] = {
        ...newFacilities[index],
        count,
        max,
        label
      };
      return newFacilities;
    });
  };

  const addFacility = () => {
    // Select a random icon and color for the new facility
    const randomIcon = iconOptions[Math.floor(Math.random() * iconOptions.length)];
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    
    const newFacility: FacilityData = {
      icon: randomIcon.icon,
      count: "0",
      label: "New Facility",
      color: randomColor,
      max: 10
    };
    
    setFacilities(prev => [...prev, newFacility]);
    toast.success("New facility added");
  };

  const removeFacility = (index: number) => {
    setFacilities(prev => prev.filter((_, i) => i !== index));
    toast.success("Facility removed");
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Facilities</h2>
        <div className="flex gap-2">
          {isEditing && (
            <Button 
              onClick={addFacility} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
            >
              <Plus size={14} />
              Add
            </Button>
          )}
          <FacilityEditControls 
            isEditing={isEditing}
            onSave={handleSave}
            onCancel={handleCancel}
            onEdit={() => setIsEditing(true)}
          />
        </div>
      </div>

      <FacilitiesGrid 
        facilities={facilities}
        isEditing={isEditing}
        onUpdateFacility={updateFacility}
      />

      {isEditing && facilities.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Remove Facilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {facilities.map((facility, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="text-sm truncate">{facility.label}</span>
                <Button 
                  onClick={() => removeFacility(index)} 
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
