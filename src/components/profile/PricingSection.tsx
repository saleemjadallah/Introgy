
import React, { useState, useEffect } from "react";
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
import { useSearchParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

const PricingSection = () => {
  const { user } = useAuth();
  const { isPremium, isLoading, upgradeToPremium } = usePremium();
  const isMobile = useIsMobile();
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [showCanceledMessage, setShowCanceledMessage] = useState(false);

  useEffect(() => {
    // Check if payment was canceled
    const canceled = searchParams.get('canceled');
    if (canceled === 'true') {
      setShowCanceledMessage(true);
      // Auto-hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowCanceledMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

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

      {showCanceledMessage && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
          <AlertDescription className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Payment canceled. Your subscription has not been changed.
          </AlertDescription>
        </Alert>
      )}

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
