
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CustomField, CustomFieldRow } from "./CustomFieldRow";

interface CustomFieldsTabProps {
  customFields: CustomField[];
  addCustomField: () => void;
  updateCustomField: (id: string, field: Partial<CustomField>) => void;
  removeCustomField: (id: string) => void;
  fieldTypeOptions: string[];
}

export function CustomFieldsTab({
  customFields,
  addCustomField,
  updateCustomField,
  removeCustomField,
  fieldTypeOptions
}: CustomFieldsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium">Additional Information</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addCustomField}
          className="flex items-center gap-1"
        >
          <PlusCircle size={16} />
          Add Field
        </Button>
      </div>
      
      {customFields.length === 0 ? (
        <div className="p-6 border border-dashed rounded-md text-center text-gray-500">
          No custom fields added yet. Click "Add Field" to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {customFields.map((field) => (
            <CustomFieldRow
              key={field.id}
              field={field}
              fieldTypeOptions={fieldTypeOptions}
              onUpdate={updateCustomField}
              onRemove={removeCustomField}
            />
          ))}
        </div>
      )}
    </div>
  );
}
