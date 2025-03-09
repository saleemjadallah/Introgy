
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { earnBadge } from "@/services/badgeService";
import PersonalInfoCard from "./PersonalInfoCard";
import IntrovertTraitsCard from "./IntrovertTraitsCard";

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
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
      <PersonalInfoCard 
        userData={userData}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setUserData={setUserData}
        onSave={handleSaveProfile}
      />
      
      <IntrovertTraitsCard 
        introvertPreferences={introvertPreferences}
        isEditing={isEditing}
      />
    </div>
  );
};

export default ProfileSection;
