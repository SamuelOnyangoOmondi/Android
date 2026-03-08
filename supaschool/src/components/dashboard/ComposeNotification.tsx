
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export function ComposeNotification() {
  const [message, setMessage] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  const toggleRecipient = (recipient: string) => {
    if (selectedRecipients.includes(recipient)) {
      setSelectedRecipients(selectedRecipients.filter(r => r !== recipient));
    } else {
      setSelectedRecipients([...selectedRecipients, recipient]);
    }
  };

  const handleSubmit = () => {
    console.log({
      message,
      recipients: selectedRecipients
    });
    // Reset form after submission
    setMessage("");
    setSelectedRecipients([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Compose Notification</h2>
      <p className="text-sm text-gray-500 mb-4">
        Create a notification by typing on the text field below
      </p>
      
      <Textarea
        placeholder="Write a notification"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full min-h-[100px] mb-4"
      />
      
      <p className="text-sm font-medium text-gray-700 mb-2">Select who to send to</p>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="select-contacts" 
            checked={selectedRecipients.includes("contacts")}
            onCheckedChange={() => toggleRecipient("contacts")}
          />
          <label htmlFor="select-contacts" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Select from contacts
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="all-teachers"
            checked={selectedRecipients.includes("teachers")}
            onCheckedChange={() => toggleRecipient("teachers")}
          />
          <label htmlFor="all-teachers" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Send to all teachers
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="all-parents"
            checked={selectedRecipients.includes("parents")}
            onCheckedChange={() => toggleRecipient("parents")}
          />
          <label htmlFor="all-parents" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Send to all Parents
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="all-admins"
            checked={selectedRecipients.includes("admins")}
            onCheckedChange={() => toggleRecipient("admins")}
          />
          <label htmlFor="all-admins" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            All adminstrators
          </label>
        </div>
      </div>
      
      <Button 
        className="w-full rounded-md bg-gray-600 hover:bg-gray-700 text-white py-2"
        onClick={handleSubmit}
        disabled={!message || selectedRecipients.length === 0}
      >
        Send
      </Button>
    </div>
  );
}
