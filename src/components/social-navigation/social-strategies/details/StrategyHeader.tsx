
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart } from "lucide-react";
import { Strategy } from "@/types/social-strategies";

interface StrategyHeaderProps {
  strategy: Strategy;
  onBack: () => void;
  toggleFavorite: (strategyId: string) => void;
}

const StrategyHeader = ({ strategy, onBack, toggleFavorite }: StrategyHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ChevronLeft className="h-4 w-4 mr-1" /> Back
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => toggleFavorite(strategy.id)}
      >
        <Heart
          className={`h-4 w-4 ${
            strategy.isFavorite ? "fill-primary text-primary" : ""
          }`}
        />
      </Button>
    </div>
  );
};

export default StrategyHeader;
