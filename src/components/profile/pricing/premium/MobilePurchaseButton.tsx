
import React from "react";
import PaywallButton from "./PaywallButton";
import { Capacitor } from "@capacitor/core";

interface MobilePurchaseButtonProps {
  planType: 'monthly' | 'yearly';
  isPremium: boolean;
}

const MobilePurchaseButton: React.FC<MobilePurchaseButtonProps> = ({ 
  planType, 
  isPremium
}) => {
  const isNative = Capacitor.isNativePlatform();
  
  return (
    <PaywallButton 
      planType={planType} 
      isPremium={isPremium}
      className={`w-full ${isNative ? 'native-button' : ''}`}
      data-plan-type={planType}
      data-is-premium={isPremium.toString()}
    >
      {planType === 'yearly' ? 'Yearly (Save 37%)' : 'Monthly Subscription'}
    </PaywallButton>
  );
};

export default MobilePurchaseButton;
