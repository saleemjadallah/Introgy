
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { revenueCatService } from "@/services/in-app-purchase/revenueCatService";
import { Capacitor } from "@capacitor/core";
import { useAuth } from "@/contexts/auth";

interface PaywallButtonProps {
  planType?: 'monthly' | 'yearly';
  isPremium: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

const PaywallButton: React.FC<PaywallButtonProps> = ({ 
  planType, 
  isPremium, 
  variant = "default", 
  size = "default",
  className = "",
  children
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const isNative = Capacitor.isNativePlatform();

  // Only enable RevenueCat paywall on native platforms
  if (!isNative) {
    return null;
  }

  const handlePresentPaywall = async () => {
    if (isPremium) {
      toast.info("You already have premium access!");
      return;
    }

    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    try {
      setIsLoading(true);
      
      // Ensure the user ID is set in RevenueCat
      await revenueCatService.setUserId(user.id);
      
      // Present the appropriate paywall offering
      const offeringId = planType === 'yearly' ? 'premium_yearly' : 'premium_monthly';
      await revenueCatService.presentPaywall(offeringId);
    } catch (error) {
      console.error("Error presenting paywall:", error);
      toast.error("Failed to load subscription options. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handlePresentPaywall}
      disabled={isLoading || isPremium}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : children ? (
        children
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {isPremium ? "Current Plan" : planType === 'yearly' ? "Yearly (Save 37%)" : "Monthly Subscription"}
        </>
      )}
    </Button>
  );
};

export default PaywallButton;
