
import React from "react";

interface PremiumPlanPricingProps {
  isMobile: boolean;
}

const PremiumPlanPricing: React.FC<PremiumPlanPricingProps> = ({ isMobile }) => {
  return (
    <div className={`${isMobile ? "mt-2" : "mt-2"}`}>
      <div className={`text-${isMobile ? "2xl" : "3xl"} font-bold`}>
        $7.99 <span className={`text-${isMobile ? "sm" : "base"} font-normal text-muted-foreground`}>/mo</span>
      </div>
      <div className={`text-${isMobile ? "xs" : "sm"} text-muted-foreground mt-${isMobile ? "0.5" : "1"}`}>
        or $59.99/year (save 37%)
      </div>
    </div>
  );
};

export default PremiumPlanPricing;
