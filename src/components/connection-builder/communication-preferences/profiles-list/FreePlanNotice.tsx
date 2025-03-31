
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { usePremium } from "@/contexts/premium";

interface FreePlanNoticeProps {
  profilesCount: number;
  maxFreeProfiles: number;
  canCreateProfile: boolean;
  showUpgradeButton?: boolean;
}

const FreePlanNotice = ({ 
  profilesCount, 
  maxFreeProfiles 
}: FreePlanNoticeProps) => {
  if (profilesCount === 0) return null;
  
  // Just show a simple count with no restrictions
  return (
    <div className="flex justify-between items-center w-full">
      <div className="text-sm text-muted-foreground">
        {`Using ${profilesCount} profiles`}
      </div>
    </div>
  );
};

export default FreePlanNotice;
