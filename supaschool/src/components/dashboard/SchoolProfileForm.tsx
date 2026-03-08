
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { School } from "@/types/database";
import { GeneralInfoTab } from "@/components/forms/GeneralInfoTab";
import { ContactDetailsTab } from "@/components/forms/ContactDetailsTab";
import { BrandingTab } from "@/components/forms/BrandingTab";
import { CustomFieldsTab } from "@/components/forms/CustomFieldsTab";
import { CustomField, ProfileFormValues, profileFormSchema } from "@/components/forms/types";

const fieldTypeOptions = [
  "Phone Number",
  "Email",
  "Website",
  "Social Media",
  "Fax",
  "Address",
  "Other"
];

export function SchoolProfileForm({ school, onSave }: { school: Partial<School>, onSave: (values: ProfileFormValues) => void }) {
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(school.logo_url || null);
  const [secondaryImage, setSecondaryImage] = useState<File | null>(null);
  const [secondaryImagePreview, setSecondaryImagePreview] = useState<string | null>(school.secondary_image_url || null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [primaryColor, setPrimaryColor] = useState<string>(school.primary_color || "#660099");
  const [secondaryColor, setSecondaryColor] = useState<string>(school.secondary_color || "#85379E");
  const [accentColor, setAccentColor] = useState<string>(school.accent_color || "#FFCC33");
  
  // Default form values
  const defaultValues: Partial<ProfileFormValues> = {
    name: school.name || "",
    motto: school.motto || "",
    website: school.website || "",
    email: school.email || "",
    phone: school.phone || "",
    location: school.location || "",
    level_of_education: school.level_of_education || "",
    school_status: school.school_status || "",
    customFields: []
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  function onSubmit(data: ProfileFormValues) {
    // Add custom fields to the submission data
    const formData = {
      ...data,
      customFields,
      logo_url: logoPreview, // Keep existing logo URL if no new upload
      secondary_image_url: secondaryImagePreview,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      accent_color: accentColor
    };
    onSave(formData);
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSecondaryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSecondaryImage(file);
      setSecondaryImagePreview(URL.createObjectURL(file));
    }
  };

  const addCustomField = () => {
    const newField = {
      id: `field-${Date.now()}`,
      label: "",
      value: "",
      type: "Other"
    };
    setCustomFields([...customFields, newField]);
  };

  const updateCustomField = (id: string, field: Partial<CustomField>) => {
    setCustomFields(
      customFields.map(item => 
        item.id === id ? { ...item, ...field } : item
      )
    );
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">School Profile</h2>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="custom">Custom Fields</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TabsContent value="general" className="space-y-4">
              <GeneralInfoTab form={form} />
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <ContactDetailsTab form={form} />
            </TabsContent>
            
            <TabsContent value="branding" className="space-y-6">
              <BrandingTab
                logoPreview={logoPreview}
                secondaryImagePreview={secondaryImagePreview}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                accentColor={accentColor}
                handleLogoChange={handleLogoChange}
                handleSecondaryImageChange={handleSecondaryImageChange}
                setPrimaryColor={setPrimaryColor}
                setSecondaryColor={setSecondaryColor}
                setAccentColor={setAccentColor}
              />
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <CustomFieldsTab
                customFields={customFields}
                addCustomField={addCustomField}
                updateCustomField={updateCustomField}
                removeCustomField={removeCustomField}
                fieldTypeOptions={fieldTypeOptions}
              />
            </TabsContent>
            
            <div className="pt-4 flex justify-end border-t">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
