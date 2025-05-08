
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface FreePlanNoticeProps {
  profilesCount: number;
  maxFreeProfiles: number;
  canCreateProfile: boolean;
  showUpgradeButton?: boolean;
}

const FreePlanNotice = ({ 
  profilesCount
}: FreePlanNoticeProps) => {
  return (
    <div className="flex flex-col items-center w-full bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg mb-4">
      <div className="text-center mb-2">
        <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
          Create Communication Profiles
        </h3>
        <p className="text-sm text-muted-foreground">
          The Introgy app lets you create profiles for different social situations
        </p>
      </div>
      <Button 
        variant="outline" 
        className="mt-2 group"
        onClick={() => window.location.href = "#download-app"}
      >
        Learn More
        <ArrowDown className="ml-2 h-4 w-4 group-hover:animate-bounce" />
      </Button>
    </div>
  );
};

export default FreePlanNotice;
