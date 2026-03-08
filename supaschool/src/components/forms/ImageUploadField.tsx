
import React from "react";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface ImageUploadFieldProps {
  id: string;
  label: string;
  description: string;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  aspectRatio?: "square" | "landscape";
}

export function ImageUploadField({ 
  id, 
  label, 
  description, 
  preview, 
  onChange, 
  aspectRatio = "square" 
}: ImageUploadFieldProps) {
  const containerClassName = aspectRatio === "square" ? "h-24 w-24" : "h-24 w-36";
  
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2 flex items-center gap-4">
        <div className={`${containerClassName} rounded-md border border-dashed border-gray-300 flex items-center justify-center overflow-hidden`}>
          {preview ? (
            <img 
              src={preview} 
              alt={label} 
              className="max-h-full max-w-full p-1 object-contain" 
            />
          ) : (
            <span className="text-gray-400 text-sm">No image</span>
          )}
        </div>
        <div>
          <Label htmlFor={`${id}-upload`} className="cursor-pointer">
            <div className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md">
              <Upload size={16} />
              Upload Image
            </div>
            <input
              id={`${id}-upload`}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onChange}
            />
          </Label>
          <p className="text-xs text-gray-500 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
