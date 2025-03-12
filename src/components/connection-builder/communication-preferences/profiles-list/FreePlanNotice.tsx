
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  showUpgradeButton = false 
}: FreePlanNoticeProps) => {
  const navigate = useNavigate();
  
  if (profilesCount === 0) return null;
  
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
          onClick={() => navigate("/profile?tab=pricing")}
          className="whitespace-nowrap ml-2"
        >
          <Star className="h-4 w-4 mr-2" />
          Upgrade Now
        </Button>
      )}
    </div>
  );
};

export default FreePlanNotice;
