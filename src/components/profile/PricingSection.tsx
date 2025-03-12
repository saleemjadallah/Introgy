
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, DollarSign, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePremium } from "@/contexts/premium/PremiumContext";

interface PricingFeature {
  name: string;
  free: string[];
  premium: string[];
}

const PricingSection = () => {
  const { user } = useAuth();
  const { isPremium, isLoading, upgradeToPremium } = usePremium();
  const isMobile = useIsMobile();
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);

  // Mock subscription function
  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    if (!user) {
      toast.error("You need to be logged in to upgrade to premium");
      return;
    }
    
    try {
      setIsUpgrading(true);
      // In production, this would connect to Stripe first
      await upgradeToPremium(planType);
    } catch (error) {
      console.error("Error during subscription:", error);
      toast.error("Failed to process your subscription. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const features: PricingFeature[] = [
    {
      name: "Social Battery",
      free: ["Basic tracking", "Standard activities", "Simple metrics"],
      premium: ["Advanced tracking", "Custom activities", "Predictive analytics", "Calendar integration"]
    },
    {
      name: "Social Navigation",
      free: ["Limited templates", "Basic preparation tools"],
      premium: ["Complete template library", "Unlimited conversation practice", "Full strategies access", "Real-time social support"]
    },
    {
      name: "Connection Builder",
      free: ["Up to 10 relationships", "Basic communication tools"],
      premium: ["Unlimited relationships", "AI interaction tools", "Advanced nurturing", "Boundary management", "Relationship analytics"]
    },
    {
      name: "Wellbeing Center",
      free: ["5 basic mindfulness exercises", "Limited community access"],
      premium: ["30+ mindfulness exercises", "Personalized recommendations", "Custom ritual creation", "Full community participation"]
    },
    {
      name: "Education Center",
      free: ["Basic glossary", "Introvert fundamentals"],
      premium: ["Complete galleries", "Advanced content", "Expert resources", "Premium educational materials"]
    }
  ];

  // Show loading state while checking subscription status
  if (isLoading) {
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
          {/* Skeleton cards */}
          {Array(2).fill(0).map((_, i) => (
            <Card key={i} className="border-2 animate-pulse">
              <CardHeader>
                <div className="w-36 h-8 bg-muted rounded" />
                <div className="w-full h-5 bg-muted rounded mt-2" />
                <div className="w-24 h-8 bg-muted rounded mt-3" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array(5).fill(0).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="w-24 h-5 bg-muted rounded" />
                    <div className="space-y-1">
                      {Array(3).fill(0).map((_, k) => (
                        <div key={k} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-muted mt-1" />
                          <div className="w-full h-4 bg-muted rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <div className="w-full h-10 bg-muted rounded" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Pricing Plans</h2>
          <p className="text-muted-foreground">Choose the plan that's right for your introvert journey</p>
        </div>
        <Badge variant={isPremium ? "default" : "outline"} className="text-sm py-1">
          {isPremium ? "Premium" : "Free Plan"}
        </Badge>
      </div>

      {isMobile ? (
        // Mobile layout - vertical stack
        <div className="space-y-6">
          {/* Free Plan Card */}
          <Card className={`border-2 ${!isPremium ? "border-primary" : "border-border"}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Free Plan</CardTitle>
                {!isPremium && <Badge variant="outline" className="font-normal">Current</Badge>}
              </div>
              <CardDescription>Essential tools for introverts</CardDescription>
              <div className="mt-2 text-2xl font-bold">$0</div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {features.map((feature, index) => (
                <div key={`free-${index}`} className="space-y-1">
                  <h4 className="font-medium text-sm">{feature.name}</h4>
                  <ul className="space-y-0.5">
                    {feature.free.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan Card */}
          <Card className={`border-2 ${isPremium ? "border-primary" : "border-border"}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Premium Plan</CardTitle>
                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600">Best</Badge>
              </div>
              <CardDescription>Complete introvert toolkit</CardDescription>
              <div className="mt-2">
                <div className="text-2xl font-bold">$7.99 <span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                <div className="text-xs text-muted-foreground mt-0.5">or $59.99/year (save 37%)</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {features.map((feature, index) => (
                <div key={`premium-${index}`} className="space-y-1">
                  <h4 className="font-medium text-sm">{feature.name}</h4>
                  <ul className="space-y-0.5">
                    {feature.premium.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe('monthly')}
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
            </CardFooter>
          </Card>
        </div>
      ) : (
        // Desktop layout - side by side
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan Card */}
          <Card className={`border-2 ${!isPremium ? "border-primary" : "border-border"}`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Free Plan</span>
                {!isPremium && <Badge variant="outline" className="font-normal">Current</Badge>}
              </CardTitle>
              <CardDescription>Essential tools for introverts</CardDescription>
              <div className="mt-2 text-3xl font-bold">$0</div>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={`free-${index}`} className="space-y-2">
                  <h4 className="font-medium">{feature.name}</h4>
                  <ul className="space-y-1">
                    {feature.free.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check size={16} className="text-green-500 shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan Card */}
          <Card className={`border-2 ${isPremium ? "border-primary" : "border-border"}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Premium Plan</CardTitle>
                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
                  Best Value
                </Badge>
              </div>
              <CardDescription>Complete introvert toolkit</CardDescription>
              <div className="mt-2">
                <div className="text-3xl font-bold">$7.99 <span className="text-base font-normal text-muted-foreground">/month</span></div>
                <div className="text-sm text-muted-foreground mt-1">or $59.99/year (save 37%)</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={`premium-${index}`} className="space-y-2">
                  <h4 className="font-medium">{feature.name}</h4>
                  <ul className="space-y-1">
                    {feature.premium.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check size={16} className="text-green-500 shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button 
                className="w-1/2" 
                onClick={() => handleSubscribe('monthly')}
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
                onClick={() => handleSubscribe('yearly')}
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
            </CardFooter>
          </Card>
        </div>
      )}

      <Card className="bg-muted/50">
        <CardContent className={`${isMobile ? 'p-4' : 'pt-6'}`}>
          <div className="flex items-center gap-3">
            <DollarSign className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-primary`} />
            <div>
              <h3 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>30-Day Money-Back Guarantee</h3>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                Try Premium risk-free. If you're not satisfied, get a full refund within 30 days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingSection;
