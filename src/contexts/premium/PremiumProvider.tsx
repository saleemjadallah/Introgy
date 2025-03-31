
import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { 
  inAppPurchaseService, 
  PRODUCT_IDS
} from "@/services/InAppPurchaseService";
import { 
  PremiumContextType, 
  PremiumFeature, 
  Purchase, 
  Product
} from "./types";
import {
  checkPremiumSubscription,
  upgradeUserToPremium,
  verifyAndProcessPurchase,
  getFreeFeatures
} from "./premiumService";

export const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean>(true); // Always set to true
  const [isLoading, setIsLoading] = useState<boolean>(false); // Set to false initially to avoid loading states
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
        await verifyAndProcessPurchase(purchase, user.id);
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
  
  // We'll skip checking the actual premium status
  useEffect(() => {
    setIsLoading(false);
  }, [user]);
  
  const checkFeatureAccess = (feature: PremiumFeature): boolean => {
    // Always return true to unlock all features
    return true;
  };
  
  const upgradeToPremium = async (planType: 'monthly' | 'yearly' = 'monthly'): Promise<void> => {
    // Just simulate success
    toast.success(`Successfully upgraded to ${planType} plan!`);
    return Promise.resolve();
  };
  
  const handlePurchase = async (productId: string): Promise<void> => {
    // Simulate successful purchase
    toast.success("Premium features activated!");
    return Promise.resolve();
  };
  
  const restorePurchases = async (): Promise<void> => {
    // Simulate successful restoration
    toast.success("All purchases restored!");
    return Promise.resolve();
  };
  
  return (
    <PremiumContext.Provider value={{ 
      isPremium: true, // Always true
      isLoading: false, // Never loading
      checkFeatureAccess: () => true, // Always allow access
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
