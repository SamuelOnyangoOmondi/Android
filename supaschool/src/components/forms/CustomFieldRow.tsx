
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CustomField = {
  id: string;
  label: string;
  value: string;
  type: string;
};

interface CustomFieldRowProps {
  field: CustomField;
  fieldTypeOptions: string[];
  onUpdate: (id: string, field: Partial<CustomField>) => void;
  onRemove: (id: string) => void;
}

export function CustomFieldRow({ 
  field, 
  fieldTypeOptions, 
  onUpdate, 
  onRemove 
}: CustomFieldRowProps) {
  return (
    <div className="grid grid-cols-8 gap-2 items-start">
      <div className="col-span-2">
        <Select
          value={field.type}
          onValueChange={(value) => onUpdate(field.id, { type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Field type" />
          </SelectTrigger>
          <SelectContent>
            {fieldTypeOptions.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-2">
        <Input
          placeholder="Label"
          value={field.label}
          onChange={(e) => onUpdate(field.id, { label: e.target.value })}
        />
      </div>
      
      <div className="col-span-3">
        <Input
          placeholder="Value"
          value={field.value}
          onChange={(e) => onUpdate(field.id, { value: e.target.value })}
        />
      </div>
      
      <div className="col-span-1 flex justify-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(field.id)}
          className="h-10 w-10 text-red-500"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
}
