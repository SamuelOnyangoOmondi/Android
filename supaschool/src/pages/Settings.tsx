import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/hooks/use-theme";
import { SchoolFilter } from "@/components/shared/SchoolFilter";
import { toast } from "sonner";
import {
  Palette,
  User,
  Bell,
  Shield,
  Globe,
  Mail,
  MessageSquare,
  Smartphone,
  Download,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [defaultSchoolId, setDefaultSchoolId] = useState("");
  const [dateFormat, setDateFormat] = useState("dd-mm-yyyy");
  const [language, setLanguage] = useState("en");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [mealAlerts, setMealAlerts] = useState(true);

  const handleSaveAppearance = () => {
    toast.success("Appearance settings saved");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved");
  };

  const handleSavePlatform = () => {
    toast.success("Platform settings saved");
  };

  const handleExportData = () => {
    toast.success("Data export started. You will receive an email when ready.");
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2 bg-gradient-to-r from-violet-600 to-purple-800 p-6 rounded-xl shadow-md border border-violet-500/30">
          <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-white/80 max-w-2xl">
            Manage your account, preferences, notifications, and platform defaults.
          </p>
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="platform" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Platform</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose how SupaSchool looks. Changes apply immediately.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex items-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
                      theme === "light"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <Sun className="h-5 w-5" />
                    <span className="font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex items-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
                      theme === "dark"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <Moon className="h-5 w-5" />
                    <span className="font-medium">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`flex items-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
                      theme === "system"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <Monitor className="h-5 w-5" />
                    <span className="font-medium">System</span>
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="sw">Kiswahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger id="date-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSaveAppearance}>Save appearance</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification preferences
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose how you want to receive alerts and updates.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Reports, summaries, and important alerts
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">SMS notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Urgent alerts and reminders
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">In-app notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Badge counts and in-app alerts
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={inAppNotifications}
                    onCheckedChange={setInAppNotifications}
                  />
                </div>
                <div className="border-t pt-4 space-y-4">
                  <p className="font-medium">Alert types</p>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="attendance-alerts" className="font-normal">
                      Attendance alerts (low coverage, absent students)
                    </Label>
                    <Switch
                      id="attendance-alerts"
                      checked={attendanceAlerts}
                      onCheckedChange={setAttendanceAlerts}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="meal-alerts" className="font-normal">
                      Meal alerts (shortages, distribution issues)
                    </Label>
                    <Switch
                      id="meal-alerts"
                      checked={mealAlerts}
                      onCheckedChange={setMealAlerts}
                    />
                  </div>
                </div>
                <Button onClick={handleSaveNotifications}>Save preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platform" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Platform defaults
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Set default values used across the platform.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default school</Label>
                  <SchoolFilter
                    value={defaultSchoolId}
                    onValueChange={setDefaultSchoolId}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pre-select this school when opening attendance, meals, and reports.
                  </p>
                </div>
                <Button onClick={handleSavePlatform}>Save defaults</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Data & privacy
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Export your data or manage account security.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <p className="font-medium mb-1">Export your data</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download a copy of your school data, reports, and records. The export will be
                    prepared and sent to your email.
                  </p>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Request data export
                  </Button>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="font-medium mb-1">Account</p>
                  <p className="text-sm text-muted-foreground">
                    Profile and security settings are managed through your organization. Contact
                    your administrator for changes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
