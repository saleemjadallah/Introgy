
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";

interface FreePlanNoticeProps {
  profilesCount: number;
  maxFreeProfiles: number;
  canCreateProfile: boolean;
  showUpgradeButton?: boolean;
}

const FreePlanNotice = ({ 
  profilesCount, 
  maxFreeProfiles, 
  canCreateProfile,
  showUpgradeButton = true 
}: FreePlanNoticeProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (profilesCount === 0) return null;
  
  const handleUpgrade = async () => {
    if (!user) {
      toast.error("You need to be logged in to upgrade");
      navigate("/auth?mode=signin");
      return;
    }

    try {
      setIsProcessing(true);

      // Call the Stripe checkout edge function
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { planType: 'monthly', userId: user.id }
      });

      if (error) {
        console.error("Checkout error:", error);
        toast.error("Failed to start checkout process");
        return;
      }

      // Redirect to Stripe checkout page
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error during checkout:", err);
      toast.error("Failed to process checkout");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="flex justify-between items-center w-full">
      <div className="text-sm text-muted-foreground">
        {canCreateProfile 
          ? `Using ${profilesCount} of ${maxFreeProfiles} available profiles (Free plan)`
          : `Free plan limit reached (${profilesCount}/${maxFreeProfiles})`
        }
      </div>
      
      {!canCreateProfile && showUpgradeButton && (
        <Button 
          size="sm" 
          onClick={handleUpgrade}
          className="whitespace-nowrap ml-2"
          disabled={isProcessing}
        >
          <Star className="h-4 w-4 mr-2" />
          Upgrade Now
        </Button>
      )}
    </div>
  );
};

export default FreePlanNotice;
