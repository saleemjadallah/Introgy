
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import PremiumPlanHeader from "./premium/PremiumPlanHeader";
import PremiumPlanPricing from "./premium/PremiumPlanPricing";
import PremiumPlanFeatures from "./premium/PremiumPlanFeatures";
import PremiumPlanButtons from "./premium/PremiumPlanButtons";

interface PricingCardPremiumProps {
  features: { name: string; premium: string[] }[];
  isPremium: boolean;
  isMobile: boolean;
  isUpgrading: boolean;
  onSubscribe: (planType: 'monthly' | 'yearly') => Promise<void>;
}

const PricingCardPremium: React.FC<PricingCardPremiumProps> = ({ 
  features, 
  isPremium, 
  isMobile,
  isUpgrading,
  onSubscribe
}) => {
  return (
    <Card className={`border-2 ${isPremium ? "border-primary" : "border-border"}`}>
      <CardHeader className={isMobile ? "pb-2" : ""}>
        <PremiumPlanHeader isMobile={isMobile} />
        <CardDescription>Complete introvert toolkit</CardDescription>
        <PremiumPlanPricing isMobile={isMobile} />
      </CardHeader>
      <CardContent className={`space-y-4 ${isMobile ? "pt-0" : ""}`}>
        <PremiumPlanFeatures features={features} isMobile={isMobile} />
      </CardContent>
      <CardFooter className={isMobile ? "" : "flex gap-4"}>
        <PremiumPlanButtons 
          isMobile={isMobile}
          isPremium={isPremium}
          isUpgrading={isUpgrading}
          onSubscribe={onSubscribe}
        />
      </CardFooter>
    </Card>
  );
};

export default PricingCardPremium;
