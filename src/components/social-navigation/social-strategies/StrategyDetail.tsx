
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useStrategy } from "@/hooks/useStrategy";

// Import the smaller component files
import StrategyHeader from "./details/StrategyHeader";
import StrategyOverview from "./details/StrategyOverview";
import StrategySteps from "./details/StrategySteps";
import StrategyPhrases from "./details/StrategyPhrases";
import StrategyChallenges from "./details/StrategyChallenges";
import StrategyNotes from "./details/StrategyNotes";
import StrategyRating from "./details/StrategyRating";
import RelatedStrategies from "./details/RelatedStrategies";

interface StrategyDetailProps {
  strategyId: string;
  onBack: () => void;
  toggleFavorite: (strategyId: string) => void;
}

const StrategyDetail = ({ strategyId, onBack, toggleFavorite }: StrategyDetailProps) => {
  const { strategy, relatedStrategies, saveNote, rateEffectiveness } = useStrategy(strategyId);

  if (!strategy) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Strategy not found</p>
        <Button variant="link" onClick={onBack} className="mt-2">
          Back to strategies
        </Button>
      </div>
    );
  }

  const handleRelatedStrategyView = (relatedId: string) => {
    // Navigate back to strategies list and select the related strategy
    onBack();
    setTimeout(() => {
      const detailElement = document.getElementById(relatedId);
      if (detailElement) detailElement.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  return (
    <div className="space-y-4">
      <StrategyHeader 
        strategy={strategy} 
        onBack={onBack} 
        toggleFavorite={toggleFavorite} 
      />

      <StrategyOverview strategy={strategy} />

      <Separator />

      <StrategySteps steps={strategy.steps} />

      {strategy.examplePhrases && strategy.examplePhrases.length > 0 && (
        <StrategyPhrases phrases={strategy.examplePhrases} />
      )}

      <StrategyChallenges challenges={strategy.challenges} />

      <Separator />

      <StrategyNotes 
        strategyId={strategyId} 
        currentNote={strategy.personalNote} 
        saveNote={saveNote} 
      />

      <StrategyRating 
        strategyId={strategyId} 
        currentRating={strategy.rating} 
        rateEffectiveness={rateEffectiveness} 
      />

      {relatedStrategies.length > 0 && (
        <RelatedStrategies 
          strategies={relatedStrategies} 
          onViewStrategy={handleRelatedStrategyView} 
        />
      )}
    </div>
  );
};

export default StrategyDetail;
