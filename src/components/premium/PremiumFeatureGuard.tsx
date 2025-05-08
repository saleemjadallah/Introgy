
import React from "react";
import { PremiumFeature } from "@/contexts/premium";

interface PremiumFeatureGuardProps {
  feature: PremiumFeature;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const PremiumFeatureGuard: React.FC<PremiumFeatureGuardProps> = ({ 
  feature, 
  children,
  title,
  description
}) => {
  // For the explanatory website, just render children without any blocking
  return <>{children}</>;
};
