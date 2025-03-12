
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import MobilePurchaseButton from "./MobilePurchaseButton";

interface PremiumPlanButtonsProps {
  isMobile: boolean;
  isPremium: boolean;
  isUpgrading: boolean;
  onSubscribe: (planType: 'monthly' | 'yearly') => Promise<void>;
}

const PremiumPlanButtons: React.FC<PremiumPlanButtonsProps> = ({ 
  isMobile, 
  isPremium, 
  isUpgrading, 
  onSubscribe 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  // If we're on a native platform, use the native in-app purchase flow
  if (isNative) {
    if (isMobile) {
      return <MobilePurchaseButton planType="monthly" isPremium={isPremium} />;
    }
    
    return (
      <>
        <MobilePurchaseButton planType="monthly" isPremium={isPremium} />
        <MobilePurchaseButton planType="yearly" isPremium={isPremium} />
      </>
    );
  }

  // Web platform flow using Stripe
  const handleCheckout = async (planType: 'monthly' | 'yearly') => {
    if (!user) {
      toast.error("You need to be logged in to upgrade");
      navigate("/auth?mode=signin");
      return;
    }

    try {
      setIsProcessing(true);

      // Call the Stripe checkout edge function
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { planType, userId: user.id }
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

  if (isMobile) {
    return (
      <Button 
        className="w-full" 
        onClick={() => handleCheckout('monthly')}
        disabled={isProcessing || isPremium}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {isPremium ? "Current Plan" : "Upgrade Now"}
          </>
        )}
      </Button>
    );
  }

  return (
    <>
      <Button 
        className="w-1/2" 
        onClick={() => handleCheckout('monthly')}
        disabled={isProcessing || isPremium}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Monthly
          </>
        )}
      </Button>
      <Button 
        className="w-1/2" 
        onClick={() => handleCheckout('yearly')}
        disabled={isProcessing || isPremium}
        variant="outline"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Yearly (Save 37%)"
        )}
      </Button>
    </>
  );
};

export default PremiumPlanButtons;
