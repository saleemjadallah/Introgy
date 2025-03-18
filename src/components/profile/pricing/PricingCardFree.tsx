
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PricingFeature from "./PricingFeature";

interface PricingCardFreeProps {
  features: { name: string; free: string[] }[];
  isPremium: boolean;
  isMobile: boolean;
}

const PricingCardFree: React.FC<PricingCardFreeProps> = ({ features, isPremium, isMobile }) => {
  return (
    <Card className={`border-2 ${!isPremium ? "border-primary" : "border-border"}`}>
      <CardHeader className={isMobile ? "pb-2" : ""}>
        <div className="flex justify-between items-center">
          <CardTitle className={isMobile ? "text-xl" : ""}>Free Plan</CardTitle>
          {!isPremium && <Badge variant="outline" className="font-normal">Current</Badge>}
        </div>
        <CardDescription>Essential tools for introverts</CardDescription>
        <div className={`${isMobile ? "mt-2" : "mt-2"} text-${isMobile ? "2xl" : "3xl"} font-bold`}>$0</div>
      </CardHeader>
      <CardContent className={`space-y-4 ${isMobile ? "pt-0" : ""}`}>
        {features.map((feature, index) => (
          <PricingFeature 
            key={`free-${index}`} 
            name={feature.name} 
            features={feature.free} 
            isMobile={isMobile}
          />
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" disabled>
          Current Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCardFree;
