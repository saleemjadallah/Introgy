
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePremium, PremiumFeature } from "@/contexts/premium/PremiumContext";

interface PremiumFeatureGuardProps {
  feature: PremiumFeature;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const PremiumFeatureGuard: React.FC<PremiumFeatureGuardProps> = ({ 
  feature, 
  children, 
  title = "Premium Feature", 
  description = "This feature requires a premium subscription" 
}) => {
  const { checkFeatureAccess } = usePremium();
  const navigate = useNavigate();
  
  const hasAccess = checkFeatureAccess(feature);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  return (
    <Card className="border-dashed border-2 border-muted-foreground/30">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 text-center opacity-50 pointer-events-none">
        <div className="filter blur-sm">
          {children}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => navigate("/profile?tab=pricing")}
          variant="default"
        >
          <Star className="w-4 h-4 mr-2" />
          Upgrade to Premium
        </Button>
      </CardFooter>
    </Card>
  );
};
