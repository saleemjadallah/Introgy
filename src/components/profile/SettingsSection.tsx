
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SettingsSection = () => {
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
    emailUpdates: false,
    dataCollection: true,
  });

  const handleToggleChange = (key: keyof typeof preferences, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>App Preferences</CardTitle>
          <CardDescription>
            Customize your experience with InnerCircle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use dark theme throughout the app
                </p>
              </div>
              <Switch 
                id="darkMode" 
                checked={preferences.darkMode}
                onCheckedChange={(checked) => handleToggleChange("darkMode", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">App Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive important updates and reminders
                </p>
              </div>
              <Switch 
                id="notifications" 
                checked={preferences.notifications}
                onCheckedChange={(checked) => handleToggleChange("notifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailUpdates">Email Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive occasional emails with tips and updates
                </p>
              </div>
              <Switch 
                id="emailUpdates" 
                checked={preferences.emailUpdates}
                onCheckedChange={(checked) => handleToggleChange("emailUpdates", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Data</CardTitle>
          <CardDescription>
            Control how your information is stored and used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dataCollection">Usage Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Allow anonymous usage data to improve the app
              </p>
            </div>
            <Switch 
              id="dataCollection" 
              checked={preferences.dataCollection}
              onCheckedChange={(checked) => handleToggleChange("dataCollection", checked)}
            />
          </div>
          
          <div className="space-y-2 pt-2">
            <h4 className="font-medium">Data Management</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Export My Data
              </Button>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
            <p className="text-sm text-muted-foreground pt-1">
              Deleting your account will permanently remove all your data
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;
