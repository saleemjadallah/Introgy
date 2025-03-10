
import React from "react";
import { AlertCircle } from "lucide-react";

const LowEnergyWarning = () => {
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3 flex items-start gap-2">
      <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-medium text-yellow-500">Low Energy Warning</p>
        <p className="text-muted-foreground">This event may drain most of your current social battery. Consider scheduling more recharge time.</p>
      </div>
    </div>
  );
};

export default LowEnergyWarning;
