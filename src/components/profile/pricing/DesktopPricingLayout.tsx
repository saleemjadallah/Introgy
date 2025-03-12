
import React from "react";
import PricingCardFree from "./PricingCardFree";
import PricingCardPremium from "./PricingCardPremium";
import { PricingFeature } from "./PricingFeatureTypes";

interface DesktopPricingLayoutProps {
  features: PricingFeature[];
  isPremium: boolean;
  isUpgrading: boolean;
  onSubscribe: (planType: 'monthly' | 'yearly') => Promise<void>;
}

const DesktopPricingLayout: React.FC<DesktopPricingLayoutProps> = ({
  features,
  isPremium,
  isUpgrading,
  onSubscribe
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <PricingCardFree 
        features={features} 
        isPremium={isPremium}
        isMobile={false} 
      />
      <PricingCardPremium 
        features={features} 
        isPremium={isPremium}
        isMobile={false}
        isUpgrading={isUpgrading}
        onSubscribe={onSubscribe}
      />
    </div>
  );
};

export default DesktopPricingLayout;
