
import React from "react";
import { Separator } from "@/components/ui/separator";

interface StrategyStepsProps {
  steps: string[];
}

const StrategySteps = ({ steps }: StrategyStepsProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">How to implement this strategy</h4>
      <ol className="space-y-2 pl-5 list-decimal">
        {steps.map((step, index) => (
          <li key={index} className="text-sm">{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default StrategySteps;
