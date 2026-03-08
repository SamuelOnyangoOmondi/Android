
import React from "react";
import { FacilityCard, FacilityData } from "./FacilityCard";

interface FacilitiesGridProps {
  facilities: FacilityData[];
  isEditing: boolean;
  onUpdateFacility: (index: number, count: string, max: number, label: string) => void;
}

export function FacilitiesGrid({ 
  facilities, 
  isEditing,
  onUpdateFacility 
}: FacilitiesGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {facilities.map((facility, index) => (
        <FacilityCard
          key={index}
          icon={facility.icon}
          count={facility.count}
          label={facility.label}
          color={facility.color}
          max={facility.max}
          isEditing={isEditing}
          onChange={(count, max, label) => onUpdateFacility(index, count, max, label)}
        />
      ))}
    </div>
  );
}
