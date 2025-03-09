
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { useToast } from "@/hooks/use-toast";
import { earnBadge } from "@/services/badgeService";
import { Edit, Save, X } from "lucide-react";

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    displayName: "Guest User",
    email: "guest@example.com",
    bio: "I'm an introvert who enjoys reading, hiking, and quiet evenings at home.",
    introvertLevel: 7, // 1-10 scale
    joinDate: "January 2023",
    timezone: "Pacific Time (PT)",
  });

  const [introvertPreferences, setIntrovertPreferences] = useState<{
    energyDrains: string[];
    energyGains: string[];
    communicationStyle: string;
    socialGoals: string;
  }>({
    energyDrains: ["Large groups", "Small talk", "Unexpected calls", "Loud environments"],
    energyGains: ["Reading", "Nature walks", "Deep conversations", "Creative projects"],
    communicationStyle: "Thoughtful written communication with time to process",
    socialGoals: "Building deeper connections with fewer people"
  });

  useEffect(() => {
    const savedPreferences = localStorage.getItem("introvertPreferences");
    if (savedPreferences) {
      setIntrovertPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
      duration: 3000,
    });
    
    earnBadge("inner-observer");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Manage your personal details and profile information
            </CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit size={16} className="mr-2" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="default" size="sm" onClick={handleSaveProfile}>
                <Save size={16} className="mr-2" /> Save
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X size={16} className="mr-1" /> Cancel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-2">
              <UserAvatar size="lg" name={userData.displayName} />
              {isEditing && (
                <Button variant="outline" size="sm" className="text-xs">
                  Change Avatar
                </Button>
              )}
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  {isEditing ? (
                    <Input 
                      id="displayName" 
                      value={userData.displayName} 
                      onChange={(e) => setUserData({...userData, displayName: e.target.value})}
                    />
                  ) : (
                    <div className="text-lg font-medium">{userData.displayName}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="text-lg font-medium text-muted-foreground">{userData.email}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea 
                    id="bio" 
                    value={userData.bio} 
                    onChange={(e) => setUserData({...userData, bio: e.target.value})}
                    rows={3}
                  />
                ) : (
                  <p className="text-muted-foreground">{userData.bio}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="introvertLevel">Introvert Level</Label>
                  {isEditing ? (
                    <Input 
                      id="introvertLevel" 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={userData.introvertLevel} 
                      onChange={(e) => setUserData({...userData, introvertLevel: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${userData.introvertLevel * 10}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{userData.introvertLevel}/10</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="text-muted-foreground">{userData.joinDate}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Introvert Traits & Preferences</CardTitle>
          <CardDescription>
            How you experience introversion and what works best for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Energy Drains</Label>
              <div className="flex flex-wrap gap-2">
                {introvertPreferences.energyDrains.map(item => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Energy Gains</Label>
              <div className="flex flex-wrap gap-2">
                {introvertPreferences.energyGains.map(item => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Communication Style</Label>
              <div className="text-muted-foreground">
                {introvertPreferences.communicationStyle}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Social Goals</Label>
              <div className="text-muted-foreground">
                {introvertPreferences.socialGoals}
              </div>
            </div>
          </div>
          
          {isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/onboarding")}
            >
              Update Introvert Preferences
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
