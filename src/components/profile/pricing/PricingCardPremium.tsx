
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Loader2 } from "lucide-react";
import PricingFeature from "./PricingFeature";

interface PricingCardPremiumProps {
  features: { name: string; premium: string[] }[];
  isPremium: boolean;
  isMobile: boolean;
  isUpgrading: boolean;
  onSubscribe: (planType: 'monthly' | 'yearly') => Promise<void>;
}

const PricingCardPremium: React.FC<PricingCardPremiumProps> = ({ 
  features, 
  isPremium, 
  isMobile,
  isUpgrading,
  onSubscribe
}) => {
  return (
    <Card className={`border-2 ${isPremium ? "border-primary" : "border-border"}`}>
      <CardHeader className={isMobile ? "pb-2" : ""}>
        <div className="flex justify-between items-center">
          <CardTitle className={isMobile ? "text-xl" : ""}>Premium Plan</CardTitle>
          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600">
            {isMobile ? "Best" : "Best Value"}
          </Badge>
        </div>
        <CardDescription>Complete introvert toolkit</CardDescription>
        <div className={`${isMobile ? "mt-2" : "mt-2"}`}>
          <div className={`text-${isMobile ? "2xl" : "3xl"} font-bold`}>
            $7.99 <span className={`text-${isMobile ? "sm" : "base"} font-normal text-muted-foreground`}>/mo</span>
          </div>
          <div className={`text-${isMobile ? "xs" : "sm"} text-muted-foreground mt-${isMobile ? "0.5" : "1"}`}>
            or $59.99/year (save 37%)
          </div>
        </div>
      </CardHeader>
      <CardContent className={`space-y-4 ${isMobile ? "pt-0" : ""}`}>
        {features.map((feature, index) => (
          <PricingFeature 
            key={`premium-${index}`} 
            name={feature.name} 
            features={feature.premium}
            isMobile={isMobile}
          />
        ))}
      </CardContent>
      <CardFooter className={isMobile ? "" : "flex gap-4"}>
        {isMobile ? (
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
        ) : (
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
        )}
      </CardFooter>
    </Card>
  );
};

export default PricingCardPremium;
