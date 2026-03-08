
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Globe, Mail, MessageSquare, Facebook, Twitter, Instagram } from "lucide-react";

export function CommunicationSettings() {
  const [emailProvider, setEmailProvider] = useState("school");
  const [bulkSmsEnabled, setBulkSmsEnabled] = useState(false);
  const [smsSenderName, setSmsSenderName] = useState("");
  const [schoolEmailServer, setSchoolEmailServer] = useState("");
  const [schoolEmailUsername, setSchoolEmailUsername] = useState("");
  const [schoolEmailPassword, setSchoolEmailPassword] = useState("");
  const [useKytabuEmail, setUseKytabuEmail] = useState(false);

  const handleSaveEmailSettings = () => {
    if (emailProvider === "school" && !schoolEmailServer) {
      toast.error("Please enter your school email server details");
      return;
    }
    
    toast.success("Email settings saved successfully");
    // In a real app, you would save to database here
  };

  const handleSaveSmsSettings = () => {
    if (bulkSmsEnabled && !smsSenderName) {
      toast.error("Please enter a sender name for SMS");
      return;
    }
    
    toast.success("SMS settings saved successfully");
    // In a real app, you would save to database here
  };

  const handleConnectEmail = () => {
    // In a real app, this would authenticate with the email provider
    toast.success("Email server connected successfully");
  };

  const handleTestConnection = () => {
    toast.success("Test email sent successfully");
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="mb-4 grid grid-cols-2 w-64">
          <TabsTrigger value="email">Email Server</TabsTrigger>
          <TabsTrigger value="sms">Bulk SMS</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="space-y-4">
          <Card className="shadow-md bg-gradient-to-br from-white to-gray-50 border-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
            <CardContent className="p-6 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Integration
                </h2>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Connect your school's email server to allow Flami to send emails on behalf of your school.
                  You can either use your own email server or the Kytabu notification system.
                </p>
                
                <RadioGroup 
                  value={emailProvider} 
                  onValueChange={setEmailProvider}
                  className="space-y-4 mb-6"
                >
                  <div className="flex items-start space-x-2 bg-white p-3 rounded-md border">
                    <RadioGroupItem value="school" id="school" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="school" className="font-medium">Use School Email Server</Label>
                      <p className="text-sm text-muted-foreground">
                        Connect to your school's SMTP server to send emails using your school domain
                      </p>
                      
                      {emailProvider === "school" && (
                        <div className="space-y-3 mt-2">
                          <div className="grid gap-1.5">
                            <Label htmlFor="email-server">SMTP Server</Label>
                            <Input 
                              id="email-server" 
                              placeholder="smtp.yourschool.com" 
                              value={schoolEmailServer}
                              onChange={(e) => setSchoolEmailServer(e.target.value)}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-1.5">
                              <Label htmlFor="email-username">Username</Label>
                              <Input 
                                id="email-username" 
                                placeholder="email@yourschool.com" 
                                value={schoolEmailUsername}
                                onChange={(e) => setSchoolEmailUsername(e.target.value)}
                              />
                            </div>
                            
                            <div className="grid gap-1.5">
                              <Label htmlFor="email-password">Password</Label>
                              <Input 
                                id="email-password" 
                                type="password" 
                                placeholder="••••••••" 
                                value={schoolEmailPassword}
                                onChange={(e) => setSchoolEmailPassword(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-between mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleTestConnection}
                            >
                              Test Connection
                            </Button>
                            <Button onClick={handleConnectEmail}>Connect Server</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 bg-white p-3 rounded-md border">
                    <RadioGroupItem value="kytabu" id="kytabu" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="kytabu" className="font-medium">Use Kytabu Email Service</Label>
                      <p className="text-sm text-muted-foreground">
                        Let Kytabu handle email delivery for you. Emails will be sent from notifications@kytabu.school
                      </p>
                      
                      {emailProvider === "kytabu" && (
                        <div className="space-y-3 mt-2">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="use-kytabu-email" 
                              checked={useKytabuEmail}
                              onCheckedChange={setUseKytabuEmail}
                            />
                            <Label htmlFor="use-kytabu-email">Enable Kytabu Email Notifications</Label>
                          </div>
                          
                          <div className="bg-primary/5 p-3 rounded-md text-sm">
                            <p className="font-medium">Benefits of Kytabu Email Service:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-gray-600">
                              <li>No technical setup required</li>
                              <li>High deliverability rates</li>
                              <li>Automatic bounce handling</li>
                              <li>Email tracking and analytics</li>
                            </ul>
                          </div>
                          
                          {useKytabuEmail && (
                            <Button onClick={handleSaveEmailSettings}>Save Settings</Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sms" className="space-y-4">
          <Card className="shadow-md bg-gradient-to-br from-white to-gray-50 border-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
            <CardContent className="p-6 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Bulk SMS Integration
                </h2>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Connect your school to our bulk SMS system to send important notifications to parents and students.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 p-2">
                    <Switch 
                      id="enable-sms" 
                      checked={bulkSmsEnabled}
                      onCheckedChange={setBulkSmsEnabled}
                    />
                    <Label htmlFor="enable-sms" className="font-medium">Enable Bulk SMS</Label>
                  </div>
                  
                  {bulkSmsEnabled && (
                    <div className="space-y-4 bg-white p-4 rounded-md border">
                      <div className="grid gap-1.5">
                        <Label htmlFor="sender-name">SMS Sender Name</Label>
                        <Input 
                          id="sender-name" 
                          placeholder="Your school name (max 11 characters)" 
                          maxLength={11} 
                          value={smsSenderName}
                          onChange={(e) => setSmsSenderName(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                          This is the name that will appear as the sender of the SMS. Maximum 11 characters.
                        </p>
                      </div>
                      
                      <div className="bg-primary/5 p-3 rounded-md">
                        <p className="font-medium text-sm">SMS Credits</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-600">Available Credits:</span>
                          <span className="font-bold">1000</span>
                        </div>
                        <div className="mt-2">
                          <Button className="w-full" variant="outline" size="sm">
                            Buy More Credits
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button onClick={handleSaveSmsSettings}>Save SMS Settings</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-white/50 p-4 rounded-md border border-dashed">
            <h3 className="text-sm font-medium mb-2">Bulk SMS Usage Instructions</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Use Flami to send SMS by saying "Send an SMS to [group]"</li>
              <li>Schedule SMS notifications for events and reminders</li>
              <li>Target specific groups like "All Parents" or "Class 6 Students"</li>
              <li>View SMS delivery reports in the Communications section</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="shadow-md bg-gradient-to-br from-white to-gray-50 border-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
        <CardContent className="p-6 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Digital Presence
            </h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-2 text-primary">School Website</h3>
              <p className="mb-2 text-sm text-gray-600">Manage your school's official website and online presence.</p>
              <div className="flex items-center gap-2 text-blue-600">
                <a href="https://kisumuprimary.ac.ke" target="_blank" rel="noopener noreferrer" className="underline">
                  kisumuprimary.ac.ke
                </a>
                <button className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-md">
                  Edit Website
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2 text-secondary">Social Media</h3>
              <p className="mb-2 text-sm text-gray-600">Connect your school's social media accounts.</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-white p-2 rounded-md border">
                  <div className="flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <span>Facebook</span>
                  </div>
                  <button className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-md">
                    Connect
                  </button>
                </div>
                
                <div className="flex justify-between items-center bg-white p-2 rounded-md border">
                  <div className="flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-blue-400" />
                    <span>Twitter</span>
                  </div>
                  <button className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-md">
                    Connect
                  </button>
                </div>
                
                <div className="flex justify-between items-center bg-white p-2 rounded-md border">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-500" />
                    <span>Instagram</span>
                  </div>
                  <button className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-md">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
