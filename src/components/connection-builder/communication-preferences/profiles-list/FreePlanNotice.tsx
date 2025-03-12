
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { usePremium } from "@/contexts/premium/PremiumContext";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { PRODUCT_IDS } from "@/services/InAppPurchaseService";

interface FreePlanNoticeProps {
  profilesCount: number;
  maxFreeProfiles: number;
  canCreateProfile: boolean;
  showUpgradeButton?: boolean;
}

const FreePlanNotice = ({ 
  profilesCount, 
  maxFreeProfiles, 
  canCreateProfile,
  showUpgradeButton = true 
}: FreePlanNoticeProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handlePurchase, purchaseInProgress } = usePremium();
  const [isProcessing, setIsProcessing] = useState(false);
  const isNative = Capacitor.isNativePlatform();
  
  if (profilesCount === 0) return null;
  
  const handleUpgrade = async () => {
    if (!user) {
      toast.error("You need to be logged in to upgrade");
      navigate("/auth?mode=signin");
      return;
    }

    // For native platforms, use in-app purchase
    if (isNative) {
      try {
        await handlePurchase(PRODUCT_IDS.PREMIUM_MONTHLY);
      } catch (error) {
        console.error("Purchase error:", error);
        toast.error("Purchase failed. Please try again later.");
      }
      return;
    }

    // For web, use Stripe checkout
    try {
      setIsProcessing(true);

      // Call the Stripe checkout edge function
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { planType: 'monthly', userId: user.id }
      });

      if (error) {
        console.error("Checkout error:", error);
        toast.error("Failed to start checkout process");
        return;
      }

      // Redirect to Stripe checkout page
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error during checkout:", err);
      toast.error("Failed to process checkout");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="flex justify-between items-center w-full">
      <div className="text-sm text-muted-foreground">
        {canCreateProfile 
          ? `Using ${profilesCount} of ${maxFreeProfiles} available profiles (Free plan)`
          : `Free plan limit reached (${profilesCount}/${maxFreeProfiles})`
        }
      </div>
      
      {!canCreateProfile && showUpgradeButton && (
        <Button 
          size="sm" 
          onClick={handleUpgrade}
          className="whitespace-nowrap ml-2"
          disabled={isProcessing || purchaseInProgress}
        >
          {isProcessing || purchaseInProgress ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Star className="h-4 w-4 mr-2" />
              Upgrade Now
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default FreePlanNotice;
