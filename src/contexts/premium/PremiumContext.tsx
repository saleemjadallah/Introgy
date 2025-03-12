
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  checkFeatureAccess: (feature: PremiumFeature) => boolean;
  upgradeToPremium: (planType?: 'monthly' | 'yearly') => Promise<void>;
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
  | "up-to-10-relationships"
  | "basic-communication-tools"
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check premium status whenever the user changes
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) {
        setIsPremium(false);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch premium subscription from Supabase
        const { data, error } = await supabase
          .from('premium_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .gt('expires_at', new Date().toISOString())
          .maybeSingle();
        
        if (error) {
          console.error("Error checking premium status:", error);
          setIsPremium(false);
        } else {
          // User is premium if we found an active subscription
          setIsPremium(!!data);
        }
      } catch (err) {
        console.error("Unexpected error checking premium status:", err);
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPremiumStatus();
  }, [user]);
  
  const checkFeatureAccess = (feature: PremiumFeature): boolean => {
    // Free plan features (available to everyone)
    const freeFeatures: PremiumFeature[] = [
      "up-to-10-relationships",
      "basic-communication-tools",
      // All non-premium features are implicitly available
    ];
    
    // If user is premium, they have access to all features
    if (isPremium) return true;
    
    // Otherwise, check if the feature is in the free tier
    return freeFeatures.includes(feature);
  };
  
  const upgradeToPremium = async (planType: 'monthly' | 'yearly' = 'monthly') => {
    if (!user) {
      toast.error("You need to be logged in to upgrade to premium");
      return;
    }
    
    try {
      // In a real implementation, this would connect to Stripe
      // For now, we'll just call our database function to create/update the subscription
      const { data, error } = await supabase.rpc('upgrade_to_premium', { plan_type: planType });
      
      if (error) {
        console.error("Error upgrading to premium:", error);
        toast.error("Failed to upgrade to premium. Please try again.");
        return;
      }
      
      // Refresh premium status
      setIsPremium(true);
      toast.success(`You've been upgraded to the ${planType} Premium plan!`);
      
    } catch (err) {
      console.error("Unexpected error upgrading to premium:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  
  return (
    <PremiumContext.Provider value={{ isPremium, isLoading, checkFeatureAccess, upgradeToPremium }}>
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
