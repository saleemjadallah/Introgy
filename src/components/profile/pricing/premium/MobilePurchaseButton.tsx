
import React from "react";
import PaywallButton from "./PaywallButton";

interface MobilePurchaseButtonProps {
  planType: 'monthly' | 'yearly';
  isPremium: boolean;
}

const MobilePurchaseButton: React.FC<MobilePurchaseButtonProps> = ({ 
  planType, 
  isPremium
}) => {
  return (
    <PaywallButton 
      planType={planType} 
      isPremium={isPremium}
      className="w-full"
    >
      {planType === 'yearly' ? 'Yearly (Save 37%)' : 'Monthly Subscription'}
    </PaywallButton>
  );
};

export default MobilePurchaseButton;
