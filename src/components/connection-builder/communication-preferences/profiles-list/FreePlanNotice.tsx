
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FreePlanNoticeProps {
  profilesCount: number;
  maxFreeProfiles: number;
  canCreateProfile: boolean;
}

const FreePlanNotice = ({ profilesCount, maxFreeProfiles, canCreateProfile }: FreePlanNoticeProps) => {
  if (profilesCount === 0) return null;
  
  return (
    <div className="text-sm text-muted-foreground">
      {canCreateProfile 
        ? `Using ${profilesCount} of ${maxFreeProfiles} available profiles (Free plan)`
        : `Free plan limit reached (${profilesCount}/${maxFreeProfiles})`
      }
    </div>
  );
};

export default FreePlanNotice;
