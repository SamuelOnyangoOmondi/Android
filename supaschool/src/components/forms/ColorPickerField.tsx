
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerFieldProps {
  label: string;
  color: string;
  onChange: (value: string) => void;
}

export function ColorPickerField({ label, color, onChange }: ColorPickerFieldProps) {
  return (
    <div className="flex gap-2 items-center">
      <div 
        className="w-8 h-8 rounded-full" 
        style={{ backgroundColor: color }}
        title={label}
      ></div>
      <Label className="mr-2 w-32">{label}</Label>
      <Input 
        type="color" 
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-16 h-8 p-1 cursor-pointer" 
      />
      <Input 
        type="text" 
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-28 ml-2" 
      />
    </div>
  );
}
