
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const AddSchoolForm = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Add New School</h3>
        
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="schoolName" className="text-sm font-medium">
                School Name
              </label>
              <input
                id="schoolName"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter school name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="schoolType" className="text-sm font-medium">
                School Type
              </label>
              <select
                id="schoolType"
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select school type</option>
                <option value="primary">Primary</option>
                <option value="middle">Middle</option>
                <option value="secondary">Secondary</option>
                <option value="combined">Combined</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <input
                id="location"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="City, Country"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <input
                id="address"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter full address"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contactPerson" className="text-sm font-medium">
                Contact Person
              </label>
              <input
                id="contactPerson"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Full name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contactEmail" className="text-sm font-medium">
                Contact Email
              </label>
              <input
                id="contactEmail"
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="email@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contactPhone" className="text-sm font-medium">
                Contact Phone
              </label>
              <input
                id="contactPhone"
                type="tel"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="+254 XXX XXX XXX"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="capacity" className="text-sm font-medium">
                Student Capacity
              </label>
              <input
                id="capacity"
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Maximum students"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              School Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Brief description of the school..."
            ></textarea>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload School Logo</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop image here or click to browse
              </p>
              <Button type="button" variant="outline" size="sm">
                Choose File
              </Button>
              <input type="file" className="hidden" />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Add School</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
