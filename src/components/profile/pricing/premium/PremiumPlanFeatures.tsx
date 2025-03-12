
import React from "react";
import PricingFeature from "../PricingFeature";

interface PremiumPlanFeaturesProps {
  features: { name: string; premium: string[] }[];
  isMobile: boolean;
}

const PremiumPlanFeatures: React.FC<PremiumPlanFeaturesProps> = ({ features, isMobile }) => {
  return (
    <div className={`space-y-4 ${isMobile ? "pt-0" : ""}`}>
      {features.map((feature, index) => (
        <PricingFeature 
          key={`premium-${index}`} 
          name={feature.name} 
          features={feature.premium}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

export default PremiumPlanFeatures;
