
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IntrovertQuestionnaire, { IntrovertPreferences } from "@/components/profile/questionnaire/IntrovertQuestionnaire";
import { useToast } from "@/hooks/use-toast";
import { earnBadge } from "@/services/badgeService";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For demo, assume user is authenticated
  
  // In a real app, check authentication status
  useEffect(() => {
    // Check if this is right after signup
    const isNewSignup = sessionStorage.getItem("newSignup") === "true";
    
    if (!isAuthenticated) {
      navigate("/auth");
    } else if (!isNewSignup) {
      // If user is already authenticated but didn't just sign up, redirect to profile
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);
  
  const handleCompleteQuestionnaire = (preferences: IntrovertPreferences) => {
    // In a real app, save preferences to user profile in database
    
    // For demo: Save to localStorage
    localStorage.setItem("introvertPreferences", JSON.stringify(preferences));
    
    // Clear the new signup flag
    sessionStorage.removeItem("newSignup");
    
    // Award a badge for completing the profile
    earnBadge("inner-observer");
    
    // Redirect to profile page
    toast({
      title: "Profile updated",
      description: "Thank you for sharing your preferences!",
      duration: 3000,
    });
    
    navigate("/profile");
  };
  
  const handleSkip = () => {
    sessionStorage.removeItem("newSignup");
    navigate("/profile");
  };
  
  return (
    <div className="container py-8 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Introgy</h1>
        <p className="text-center mb-8 text-muted-foreground">
          Let's customize your experience based on your introvert preferences
        </p>
        
        <IntrovertQuestionnaire 
          onComplete={handleCompleteQuestionnaire}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
};

export default Onboarding;
