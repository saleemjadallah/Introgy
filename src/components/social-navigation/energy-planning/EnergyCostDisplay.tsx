
import React from "react";
import { Progress } from "@/components/ui/progress";

interface EnergyCostDisplayProps {
  energyCost: number;
}

const EnergyCostDisplay = ({ energyCost }: EnergyCostDisplayProps) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm">Expected Social Energy Cost</span>
        <span className="text-sm font-medium">{energyCost}/10</span>
      </div>
      <Progress value={energyCost * 10} className="h-2" />
      <p className="mt-2 text-sm text-muted-foreground">
        {energyCost <= 3 ? "Low energy event, should be manageable" :
         energyCost <= 6 ? "Moderate energy event, plan for some recovery time" :
         "High energy event, ensure you plan for significant recharge time"}
      </p>
    </div>
  );
};

export default EnergyCostDisplay;
