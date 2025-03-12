import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { 
  inAppPurchaseService, 
  PRODUCT_IDS, 
  Purchase, 
  Product,
  VerificationResult
} from "@/services/InAppPurchaseService";

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  checkFeatureAccess: (feature: PremiumFeature) => boolean;
  upgradeToPremium: (planType?: 'monthly' | 'yearly') => Promise<void>;
  products: Product[];
  loadingProducts: boolean;
  purchaseInProgress: boolean;
  handlePurchase: (productId: string) => Promise<void>;
  restorePurchases: () => Promise<void>;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [purchaseInProgress, setPurchaseInProgress] = useState<boolean>(false);
  const isNative = Capacitor.isNativePlatform();
  
  // Load available products
  useEffect(() => {
    const loadProducts = async () => {
      if (!isNative) return;
      
      try {
        setLoadingProducts(true);
        const availableProducts = await inAppPurchaseService.getProducts();
        setProducts(availableProducts);
      } catch (error) {
        console.error("Error loading products:", error);
        toast.error("Failed to load purchase options");
      } finally {
        setLoadingProducts(false);
      }
    };
    
    loadProducts();
  }, [isNative]);
  
  // Set up purchase listener
  useEffect(() => {
    if (!user || !isNative) return;
    
    const handlePurchaseEvent = async (purchase: Purchase) => {
      try {
        // Verify purchase with backend
        await verifyAndProcessPurchase(purchase);
        // Update premium status
        setIsPremium(true);
        toast.success("Premium subscription activated!");
      } catch (err) {
        console.error("Error processing purchase:", err);
        toast.error("Failed to activate subscription");
      }
    };
    
    inAppPurchaseService.addPurchaseListener(handlePurchaseEvent);
    
    return () => {
      inAppPurchaseService.removePurchaseListener(handlePurchaseEvent);
    };
  }, [user, isNative]);
  
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
  
  const handlePurchase = async (productId: string) => {
    if (!user) {
      toast.error("You need to be logged in to make a purchase");
      return;
    }
    
    try {
      setPurchaseInProgress(true);
      
      // Initiate purchase through our service
      const purchase = await inAppPurchaseService.purchaseProduct(productId);
      
      // If purchase was successful, verify and record it
      if (purchase) {
        await verifyAndProcessPurchase(purchase);
        setIsPremium(true);
        toast.success("Premium subscription activated!");
      }
    } catch (error) {
      console.error("Error during purchase:", error);
      toast.error("Purchase failed. Please try again.");
    } finally {
      setPurchaseInProgress(false);
    }
  };
  
  const restorePurchases = async () => {
    if (!user) {
      toast.error("You need to be logged in to restore purchases");
      return;
    }
    
    try {
      setPurchaseInProgress(true);
      
      // Restore purchases using our service
      const restoredPurchases = await inAppPurchaseService.restorePurchases();
      
      if (restoredPurchases && restoredPurchases.length > 0) {
        // Process each restored purchase
        for (const purchase of restoredPurchases) {
          await verifyAndProcessPurchase(purchase);
        }
        
        setIsPremium(true);
        toast.success("Your subscription has been restored!");
      } else {
        toast.info("No previous purchases found");
      }
    } catch (error) {
      console.error("Error restoring purchases:", error);
      toast.error("Failed to restore purchases. Please try again.");
    } finally {
      setPurchaseInProgress(false);
    }
  };
  
  // New method to verify and process purchases with receipt validation
  const verifyAndProcessPurchase = async (purchase: Purchase): Promise<void> => {
    if (!user) throw new Error("User is not authenticated");
    
    console.log("Verifying purchase:", purchase);
    
    // Verify purchase receipt with backend
    const verificationResult = await inAppPurchaseService.verifyPurchase(purchase, user.id);
    
    // If verification fails, throw error
    if (!verificationResult.success) {
      console.error("Purchase verification failed:", verificationResult.error);
      throw new Error(`Purchase verification failed: ${verificationResult.error}`);
    }
    
    console.log("Purchase verified successfully:", verificationResult);
    
    // Purchase is already recorded in the database by the verification function
    // No need to store it again
  };
  
  // Helper to validate and record purchases in our database (old method, kept for backwards compatibility)
  const validateAndRecordPurchase = async (purchase: Purchase): Promise<void> => {
    // This method now uses the new verification flow
    return verifyAndProcessPurchase(purchase);
  };
  
  return (
    <PremiumContext.Provider value={{ 
      isPremium, 
      isLoading, 
      checkFeatureAccess, 
      upgradeToPremium,
      products,
      loadingProducts,
      purchaseInProgress,
      handlePurchase,
      restorePurchases
    }}>
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
