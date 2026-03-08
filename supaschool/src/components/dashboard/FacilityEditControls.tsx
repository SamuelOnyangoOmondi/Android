
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

interface FacilityEditControlsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export function FacilityEditControls({ 
  isEditing, 
  onSave, 
  onCancel, 
  onEdit 
}: FacilityEditControlsProps) {
  return (
    <>
      {isEditing ? (
        <div className="flex gap-2">
          <Button 
            onClick={onSave} 
            variant="default" 
            size="sm" 
            className="flex items-center gap-1 bg-primary hover:bg-primary/90"
          >
            <Save size={14} />
            Save
          </Button>
          <Button 
            onClick={onCancel} 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <X size={14} />
            Cancel
          </Button>
        </div>
      ) : (
        <Button 
          onClick={onEdit} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all border-gray-300"
        >
          <Edit size={14} />
          Edit
        </Button>
      )}
    </>
  );
}
