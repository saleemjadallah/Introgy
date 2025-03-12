
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ProfileCardHeader from "./ProfileCardHeader";
import AvatarSection from "./AvatarSection";
import ProfileFormFields from "./ProfileFormFields";
import { useAuth } from "@/contexts/auth"; // Updated import path
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
            updated_at: new Date().toISOString()
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
      <ProfileCardHeader 
        isEditing={isEditing} 
        setIsEditing={setIsEditing} 
        onSave={handleSave} 
      />
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <AvatarSection 
            displayName={userData.displayName} 
            isEditing={isEditing} 
          />
          <ProfileFormFields 
            userData={userData} 
            isEditing={isEditing} 
            setUserData={setUserData} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
