
import { useState, useEffect } from "react";
import { Strategy } from "@/types/social-strategies";
import { findStrategyById, findRelatedStrategies } from "./strategyUtils";
import { useStrategyNotes } from "./useStrategyNotes";
import { useStrategyRatings } from "./useStrategyRatings";

export function useStrategy(strategyId: string) {
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [relatedStrategies, setRelatedStrategies] = useState<Strategy[]>([]);
  const { saveNote } = useStrategyNotes();
  const { rateEffectiveness } = useStrategyRatings();

  // Load the strategy
  useEffect(() => {
    const loadStrategy = () => {
      console.log("Loading strategy with ID:", strategyId);
      
      const found = findStrategyById(strategyId);
      
      if (found) {
        console.log("Found strategy:", found.title);
        setStrategy(found);
        
        // Find related strategies
        const related = findRelatedStrategies(found);
        setRelatedStrategies(related);
      } else {
        console.error("Strategy not found with ID:", strategyId);
        setStrategy(null);
        setRelatedStrategies([]);
      }
    };

    loadStrategy();
  }, [strategyId]);

  // Wrapper for saveNote that updates the local state
  const handleSaveNote = (strategyId: string, note: string) => {
    const success = saveNote(strategyId, note);
    
    if (success && strategy) {
      setStrategy({ ...strategy, personalNote: note, updatedAt: new Date() });
    }
    
    return success;
  };

  // Wrapper for rateEffectiveness that updates the local state
  const handleRateEffectiveness = (strategyId: string, rating: "effective" | "neutral" | "ineffective") => {
    const success = rateEffectiveness(strategyId, rating);
    
    if (success && strategy) {
      setStrategy({ ...strategy, rating, updatedAt: new Date() });
    }
    
    return success;
  };

  return {
    strategy,
    relatedStrategies,
    saveNote: handleSaveNote,
    rateEffectiveness: handleRateEffectiveness,
  };
}
