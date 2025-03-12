
import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";

interface PremiumPlanButtonsProps {
  isMobile: boolean;
  isPremium: boolean;
  isUpgrading: boolean;
  onSubscribe: (planType: 'monthly' | 'yearly') => Promise<void>;
}

const PremiumPlanButtons: React.FC<PremiumPlanButtonsProps> = ({ 
  isMobile, 
  isPremium, 
  isUpgrading, 
  onSubscribe 
}) => {
  if (isMobile) {
    return (
      <Button 
        className="w-full" 
        onClick={() => onSubscribe('monthly')}
        disabled={isUpgrading || isPremium}
      >
        {isUpgrading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {isPremium ? "Current Plan" : "Upgrade Now"}
          </>
        )}
      </Button>
    );
  }

  return (
    <>
      <Button 
        className="w-1/2" 
        onClick={() => onSubscribe('monthly')}
        disabled={isUpgrading || isPremium}
      >
        {isUpgrading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Monthly
          </>
        )}
      </Button>
      <Button 
        className="w-1/2" 
        onClick={() => onSubscribe('yearly')}
        disabled={isUpgrading || isPremium}
        variant="outline"
      >
        {isUpgrading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Yearly (Save 37%)"
        )}
      </Button>
    </>
  );
};

export default PremiumPlanButtons;
