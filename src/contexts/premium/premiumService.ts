
import { supabase } from "@/integrations/supabase/client";
import { inAppPurchaseService } from "@/services/InAppPurchaseService";
import { Purchase, VerificationResult } from "./types";
import { toast } from "sonner";

export const checkPremiumSubscription = async (userId: string | undefined): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Fetch premium subscription from Supabase
    const { data, error } = await supabase
      .from('premium_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();
    
    if (error) {
      console.error("Error checking premium status:", error);
      return false;
    }
    
    // User is premium if we found an active subscription
    return !!data;
  } catch (err) {
    console.error("Unexpected error checking premium status:", err);
    return false;
  }
};

export const upgradeUserToPremium = async (
  userId: string | undefined, 
  planType: 'monthly' | 'yearly' = 'monthly'
): Promise<void> => {
  if (!userId) {
    toast.error("You need to be logged in to upgrade to premium");
    throw new Error("User is not authenticated");
  }
  
  try {
    // In a real implementation, this would connect to Stripe
    // For now, we'll just call our database function to create/update the subscription
    const { data, error } = await supabase.rpc('upgrade_to_premium', { plan_type: planType });
    
    if (error) {
      console.error("Error upgrading to premium:", error);
      toast.error("Failed to upgrade to premium. Please try again.");
      throw error;
    }
    
    toast.success(`You've been upgraded to the ${planType} Premium plan!`);
  } catch (err) {
    console.error("Unexpected error upgrading to premium:", err);
    toast.error("An unexpected error occurred. Please try again.");
    throw err;
  }
};

export const verifyAndProcessPurchase = async (purchase: Purchase, userId: string): Promise<void> => {
  if (!userId) throw new Error("User is not authenticated");
  
  console.log("Verifying purchase:", purchase);
  
  // Verify purchase receipt with backend
  const verificationResult = await inAppPurchaseService.verifyPurchase(purchase, userId);
  
  // If verification fails, throw error
  if (!verificationResult.success) {
    console.error("Purchase verification failed:", verificationResult.error);
    throw new Error(`Purchase verification failed: ${verificationResult.error}`);
  }
  
  console.log("Purchase verified successfully:", verificationResult);
  
  // Purchase is already recorded in the database by the verification function
  // No need to store it again
};

export const getFreeFeatures = (): string[] => {
  return [
    "up-to-10-relationships",
    "basic-communication-tools",
    // All non-premium features are implicitly available
  ];
};
