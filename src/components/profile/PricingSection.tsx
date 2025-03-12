
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePremium } from "@/contexts/premium/PremiumContext";
import { pricingFeatures } from "./pricing/pricingFeatureData";
import LoadingPricingSection from "./pricing/LoadingPricingSection";
import MobilePricingLayout from "./pricing/MobilePricingLayout";
import DesktopPricingLayout from "./pricing/DesktopPricingLayout";
import MoneyBackGuarantee from "./pricing/MoneyBackGuarantee";

const PricingSection = () => {
  const { user } = useAuth();
  const { isPremium, isLoading, upgradeToPremium } = usePremium();
  const isMobile = useIsMobile();
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);

  // Mock subscription function
  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    if (!user) {
      toast.error("You need to be logged in to upgrade to premium");
      return;
    }
    
    try {
      setIsUpgrading(true);
      // In production, this would connect to Stripe first
      await upgradeToPremium(planType);
    } catch (error) {
      console.error("Error during subscription:", error);
      toast.error("Failed to process your subscription. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  // Show loading state while checking subscription status
  if (isLoading) {
    return <LoadingPricingSection />;
  }

  // Main content
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Pricing Plans</h2>
          <p className="text-muted-foreground">Choose the plan that's right for your introvert journey</p>
        </div>
        <Badge variant={isPremium ? "default" : "outline"} className="text-sm py-1">
          {isPremium ? "Premium" : "Free Plan"}
        </Badge>
      </div>

      {isMobile ? (
        <MobilePricingLayout 
          features={pricingFeatures}
          isPremium={isPremium}
          isUpgrading={isUpgrading}
          onSubscribe={handleSubscribe}
        />
      ) : (
        <DesktopPricingLayout 
          features={pricingFeatures}
          isPremium={isPremium}
          isUpgrading={isUpgrading}
          onSubscribe={handleSubscribe}
        />
      )}

      <MoneyBackGuarantee isMobile={isMobile} />
    </div>
  );
};

export default PricingSection;
