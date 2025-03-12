
import React from "react";
import { Loader2 } from "lucide-react";
import PricingSkeletonCard from "./PricingSkeletonCard";

const LoadingPricingSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Pricing Plans</h2>
          <p className="text-muted-foreground">Choose the plan that's right for your introvert journey</p>
        </div>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {Array(2).fill(0).map((_, i) => (
          <PricingSkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default LoadingPricingSection;
