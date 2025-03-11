
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { Edit, Save, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PersonalInfoCardProps {
  userData: {
    displayName: string;
    email: string;
    bio: string;
    introvertLevel: number;
    joinDate: string;
    timezone: string;
  };
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  setUserData: (userData: any) => void;
  onSave: () => void;
}

const PersonalInfoCard = ({ 
  userData, 
  isEditing, 
  setIsEditing, 
  setUserData, 
  onSave 
}: PersonalInfoCardProps) => {
  const { user } = useAuth();
  
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          if (data) {
            setUserData({
              ...userData,
              displayName: data.display_name || userData.displayName,
              email: data.email || userData.email,
              // Keep other fields as they may not be in the profiles table
            });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };

    loadUserProfile();
  }, [user]);

  const handleSave = async () => {
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            display_name: userData.displayName,
            // Don't update email through this method as it requires auth verification
            updated_at: new Date().toISOString() // Fix: Convert Date to string
          })
          .eq('id', user.id);

        if (error) throw error;
        
        onSave();
        toast("Profile updated", {
          description: "Your profile has been successfully updated.",
        });
      } catch (error) {
        console.error('Error updating profile:', error);
        toast("Error updating profile", {
          description: "Failed to update your profile. Please try again.",
        });
      }
    } else {
      onSave(); // Fall back to local save for demo
    }
  };

  return (
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
            <Button variant="default" size="sm" onClick={handleSave}>
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
  );
};

export default PersonalInfoCard;
