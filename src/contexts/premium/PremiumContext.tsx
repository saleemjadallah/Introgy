import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";

interface PremiumContextType {
  isPremium: boolean;
  checkFeatureAccess: (feature: PremiumFeature) => boolean;
  upgradeToPremium: () => void;
}

export type PremiumFeature = 
  // Social Battery features
  | "advanced-tracking"
  | "custom-activities"
  | "predictive-analytics"
  | "calendar-integration"
  // Social Navigation features
  | "complete-templates"
  | "unlimited-conversation-practice"
  | "full-strategies-access"
  | "real-time-social-support"
  // Connection Builder features
  | "unlimited-relationships"
  | "ai-interaction-tools"
  | "advanced-nurturing"
  | "boundary-management"
  | "relationship-analytics"
  // Wellbeing Center features
  | "extended-mindfulness"
  | "personalized-recommendations"
  | "custom-ritual-creation"
  | "full-community-participation"
  // Education Center features
  | "complete-galleries"
  | "advanced-content"
  | "expert-resources"
  | "premium-educational-materials";

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  // In a real implementation, this would check with your backend
  // to validate the user's subscription status
  useEffect(() => {
    // For now, we're using localStorage as a temporary solution
    // In production, you'd want to validate this server-side
    const storedPremiumStatus = localStorage.getItem("isPremium") === "true";
    setIsPremium(storedPremiumStatus);
  }, [user]);
  
  const checkFeatureAccess = (feature: PremiumFeature): boolean => {
    // Free plan features (available to everyone)
    const freeFeatures: PremiumFeature[] = [
      // All non-premium features are implicitly available
    ];
    
    // If user is premium, they have access to all features
    if (isPremium) return true;
    
    // Otherwise, check if the feature is in the free tier
    return freeFeatures.includes(feature);
  };
  
  const upgradeToPremium = () => {
    // This would connect to Stripe in production
    // For now, we'll just set the premium flag in localStorage
    localStorage.setItem("isPremium", "true");
    setIsPremium(true);
  };
  
  return (
    <PremiumContext.Provider value={{ isPremium, checkFeatureAccess, upgradeToPremium }}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
};
