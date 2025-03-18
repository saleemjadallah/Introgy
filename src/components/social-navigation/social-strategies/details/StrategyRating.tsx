
import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface StrategyRatingProps {
  strategyId: string;
  currentRating: "effective" | "neutral" | "ineffective" | null | undefined;
  rateEffectiveness: (strategyId: string, rating: "effective" | "neutral" | "ineffective") => void;
}

const StrategyRating = ({ strategyId, currentRating, rateEffectiveness }: StrategyRatingProps) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">Rate this strategy</h4>
      <div className="flex space-x-2">
        <Button
          variant={currentRating === "effective" ? "default" : "outline"}
          size="sm"
          className="flex gap-1"
          onClick={() => rateEffectiveness(strategyId, "effective")}
        >
          <ThumbsUp className="h-4 w-4" />
          Effective
        </Button>
        <Button
          variant={currentRating === "neutral" ? "default" : "outline"}
          size="sm"
          className="flex gap-1"
          onClick={() => rateEffectiveness(strategyId, "neutral")}
        >
          Neutral
        </Button>
        <Button
          variant={currentRating === "ineffective" ? "default" : "outline"}
          size="sm"
          className="flex gap-1"
          onClick={() => rateEffectiveness(strategyId, "ineffective")}
        >
          <ThumbsDown className="h-4 w-4" />
          Ineffective
        </Button>
      </div>
    </div>
  );
};

export default StrategyRating;
