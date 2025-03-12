
import React from "react";
import { Button } from "@/components/ui/button";
import { Star, Loader2, RefreshCw } from "lucide-react";
import { usePremium } from "@/contexts/premium/PremiumContext";
import { PRODUCT_IDS } from "@/services/InAppPurchaseService";
import { toast } from "sonner";

interface MobilePurchaseButtonProps {
  planType: 'monthly' | 'yearly';
  isPremium: boolean;
}

const MobilePurchaseButton: React.FC<MobilePurchaseButtonProps> = ({ 
  planType, 
  isPremium 
}) => {
  const { 
    purchaseInProgress, 
    handlePurchase,
    restorePurchases
  } = usePremium();
  
  const productId = planType === 'yearly' 
    ? PRODUCT_IDS.PREMIUM_YEARLY 
    : PRODUCT_IDS.PREMIUM_MONTHLY;
  
  const handlePurchaseWithErrorHandling = async () => {
    try {
      await handlePurchase(productId);
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Purchase failed. Please try again later.");
    }
  };
  
  const handleRestorePurchases = async () => {
    try {
      await restorePurchases();
    } catch (error) {
      console.error("Restore error:", error);
      toast.error("Failed to restore purchases. Please try again later.");
    }
  };
  
  if (isPremium) {
    return (
      <Button 
        className="w-full" 
        disabled={true}
      >
        Current Plan
      </Button>
    );
  }
  
  return (
    <div className="space-y-2 w-full">
      <Button 
        className="w-full" 
        onClick={handlePurchaseWithErrorHandling}
        disabled={purchaseInProgress}
      >
        {purchaseInProgress ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Star className="mr-2 h-4 w-4" />
            {planType === 'yearly' ? 'Purchase Yearly' : 'Purchase Monthly'}
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full text-sm" 
        onClick={handleRestorePurchases}
        disabled={purchaseInProgress}
      >
        <RefreshCw className="mr-2 h-3 w-3" />
        Restore Purchases
      </Button>
    </div>
  );
};

export default MobilePurchaseButton;
