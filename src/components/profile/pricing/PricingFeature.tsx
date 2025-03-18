
import React from "react";
import { Check } from "lucide-react";

interface PricingFeatureProps {
  name: string;
  features: string[];
  isMobile?: boolean;
}

const PricingFeature: React.FC<PricingFeatureProps> = ({
  name,
  features,
  isMobile = false
}) => {
  return (
    <div className="space-y-1">
      <h4 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{name}</h4>
      <ul className="space-y-0.5">
        {features.map((item, i) => (
          <li key={i} className={`flex items-start gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <Check 
              size={isMobile ? 14 : 16} 
              className="text-green-500 shrink-0 mt-0.5" 
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PricingFeature;
