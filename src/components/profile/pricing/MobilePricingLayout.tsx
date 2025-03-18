
import React from "react";
import PricingCardFree from "./PricingCardFree";
import PricingCardPremium from "./PricingCardPremium";
import { PricingFeature } from "./PricingFeatureTypes";

interface MobilePricingLayoutProps {
  features: PricingFeature[];
  isPremium: boolean;
  isUpgrading: boolean;
  onSubscribe: (planType: 'monthly' | 'yearly') => Promise<void>;
}

const MobilePricingLayout: React.FC<MobilePricingLayoutProps> = ({
  features,
  isPremium,
  isUpgrading,
  onSubscribe
}) => {
  return (
    <div className="space-y-6">
      <PricingCardFree 
        features={features} 
        isPremium={isPremium}
        isMobile={true} 
      />
      <PricingCardPremium 
        features={features} 
        isPremium={isPremium}
        isMobile={true}
        isUpgrading={isUpgrading}
        onSubscribe={onSubscribe}
      />
    </div>
  );
};

export default MobilePricingLayout;
