
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Battery } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BatteryLevelDisplayProps {
  batteryLevel: number;
  onPlanEnergy: () => void;
}

const BatteryLevelDisplay = ({ batteryLevel, onPlanEnergy }: BatteryLevelDisplayProps) => {
  return (
    <div className="flex justify-between items-center pt-1">
      <div className="flex items-center gap-2">
        <Battery className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">Current Battery Level:</span>
        <span className="text-sm font-medium">{batteryLevel}%</span>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onPlanEnergy}
        className="text-xs bg-[#3E9D9D] text-white hover:bg-[#328383] border-[#3E9D9D]"
      >
        Apply To Battery
      </Button>
    </div>
  );
};

export default BatteryLevelDisplay;
