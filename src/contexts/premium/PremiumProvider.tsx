
import React, { createContext, useState } from "react";
import { toast } from "sonner";
import { 
  PremiumContextType, 
  PremiumFeature, 
  Product
} from "./types";

export const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium] = useState<boolean>(true); // Always set to true for explanatory site
  const [products] = useState<Product[]>([]); 
  const [loadingProducts] = useState<boolean>(false);
  const [purchaseInProgress] = useState<boolean>(false);
  
  // Always allow access to all features for explanatory site
  const checkFeatureAccess = (feature: PremiumFeature): boolean => {
    return true;
  };
  
  const upgradeToPremium = async (planType: 'monthly' | 'yearly' = 'monthly'): Promise<void> => {
    toast.success("This would upgrade your account in the actual app!");
    return Promise.resolve();
  };
  
  const handlePurchase = async (productId: string): Promise<void> => {
    toast.success("This would process a purchase in the actual app!");
    return Promise.resolve();
  };
  
  const restorePurchases = async (): Promise<void> => {
    toast.success("This would restore your purchases in the actual app!");
    return Promise.resolve();
  };
  
  return (
    <PremiumContext.Provider value={{ 
      isPremium: true, 
      isLoading: false, 
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
