
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PremiumPlanHeaderProps {
  isMobile: boolean;
}

const PremiumPlanHeader: React.FC<PremiumPlanHeaderProps> = ({ isMobile }) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle className={isMobile ? "text-xl" : ""}>Premium Plan</CardTitle>
      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600">
        {isMobile ? "Best" : "Best Value"}
      </Badge>
    </div>
  );
};

export default PremiumPlanHeader;
