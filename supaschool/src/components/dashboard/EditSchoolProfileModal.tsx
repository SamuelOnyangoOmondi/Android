
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SchoolProfileForm } from "./SchoolProfileForm";
import { School } from "@/types/database";

interface EditSchoolProfileModalProps {
  school: Partial<School>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: any) => void;
}

export function EditSchoolProfileModal({ 
  school, 
  open, 
  onOpenChange, 
  onSave 
}: EditSchoolProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit School Profile</DialogTitle>
        </DialogHeader>
        <SchoolProfileForm 
          school={school} 
          onSave={(values) => {
            onSave(values);
            onOpenChange(false);
          }} 
        />
      </DialogContent>
    </Dialog>
  );
}
