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
  
  // Check premium status whenever the user changes
  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setIsPremium(false);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const hasPremium = await checkPremiumSubscription(user.id);
        setIsPremium(hasPremium);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkStatus();
  }, [user]);
  
  const checkFeatureAccess = (feature: PremiumFeature): boolean => {
    // Free plan features (available to everyone)
    const freeFeatures = getFreeFeatures();
    
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
      await upgradeUserToPremium(user.id, planType);
      // Refresh premium status
      setIsPremium(true);
    } catch (err) {
      // Error already handled in upgradeUserToPremium
      console.error("Error in upgradeToPremium:", err);
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
        await verifyAndProcessPurchase(purchase, user.id);
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
          await verifyAndProcessPurchase(purchase, user.id);
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
