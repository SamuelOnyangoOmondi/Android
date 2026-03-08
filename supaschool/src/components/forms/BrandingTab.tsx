
import React from "react";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "./ImageUploadField";
import { ColorPickerField } from "./ColorPickerField";

interface BrandingTabProps {
  logoPreview: string | null;
  secondaryImagePreview: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSecondaryImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPrimaryColor: (value: string) => void;
  setSecondaryColor: (value: string) => void;
  setAccentColor: (value: string) => void;
}

export function BrandingTab({
  logoPreview,
  secondaryImagePreview,
  primaryColor,
  secondaryColor,
  accentColor,
  handleLogoChange,
  handleSecondaryImageChange,
  setPrimaryColor,
  setSecondaryColor,
  setAccentColor
}: BrandingTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploadField
          id="logo"
          label="School Logo (Square 1:1 Ratio)"
          description="Recommended: Square image (1:1 ratio), PNG or JPG format"
          preview={logoPreview}
          onChange={handleLogoChange}
          aspectRatio="square"
        />
        
        <ImageUploadField
          id="secondary-image"
          label="Secondary School Image (Any Shape)"
          description="Any aspect ratio, PNG or JPG format"
          preview={secondaryImagePreview}
          onChange={handleSecondaryImageChange}
          aspectRatio="landscape"
        />
      </div>
      
      <div className="mt-6">
        <Label htmlFor="colors">School Colors</Label>
        <div className="mt-2 space-y-4">
          <ColorPickerField
            label="Primary Color"
            color={primaryColor}
            onChange={setPrimaryColor}
          />
          
          <ColorPickerField
            label="Secondary Color"
            color={secondaryColor}
            onChange={setSecondaryColor}
          />
          
          <ColorPickerField
            label="Accent Color"
            color={accentColor}
            onChange={setAccentColor}
          />
        </div>
      </div>
    </div>
  );
}
