
import { useState, useEffect } from "react";
import { Strategy } from "@/types/social-strategies";
import { toast } from "sonner";

export function useStrategy(strategyId: string) {
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [relatedStrategies, setRelatedStrategies] = useState<Strategy[]>([]);

  // Load the strategy
  useEffect(() => {
    const loadStrategy = () => {
      try {
        // Get all strategies from localStorage
        const allStrategies = JSON.parse(localStorage.getItem("socialStrategies") || "[]");
        
        // Find the selected strategy
        const found = allStrategies.find((s: Strategy) => s.id === strategyId);
        
        if (found) {
          setStrategy(found);
          
          // Find related strategies (same scenario type, different strategy)
          const related = allStrategies
            .filter((s: Strategy) => 
              s.id !== strategyId && 
              s.scenarioType === found.scenarioType &&
              (
                s.type === found.type || // Same strategy type
                s.tags.some(tag => found.tags.includes(tag)) // Or has common tags
              )
            )
            .slice(0, 3); // Limit to 3 related strategies
          
          setRelatedStrategies(related);
        } else {
          setStrategy(null);
          setRelatedStrategies([]);
        }
      } catch (error) {
        console.error("Error loading strategy:", error);
        setStrategy(null);
        setRelatedStrategies([]);
      }
    };

    loadStrategy();
  }, [strategyId]);

  // Save personal note to a strategy
  const saveNote = (strategyId: string, note: string) => {
    try {
      // Get all strategies from localStorage
      const allStrategies = JSON.parse(localStorage.getItem("socialStrategies") || "[]");
      
      // Update the note for the selected strategy
      const updatedStrategies = allStrategies.map((s: Strategy) =>
        s.id === strategyId
          ? { ...s, personalNote: note, updatedAt: new Date() }
          : s
      );
      
      // Save back to localStorage
      localStorage.setItem("socialStrategies", JSON.stringify(updatedStrategies));
      
      // Update the current strategy
      if (strategy) {
        setStrategy({ ...strategy, personalNote: note, updatedAt: new Date() });
      }
      
      toast.success("Note saved successfully");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  // Rate strategy effectiveness
  const rateEffectiveness = (strategyId: string, rating: "effective" | "neutral" | "ineffective") => {
    try {
      // Get all strategies from localStorage
      const allStrategies = JSON.parse(localStorage.getItem("socialStrategies") || "[]");
      
      // Update the rating for the selected strategy
      const updatedStrategies = allStrategies.map((s: Strategy) =>
        s.id === strategyId
          ? { ...s, rating, updatedAt: new Date() }
          : s
      );
      
      // Save back to localStorage
      localStorage.setItem("socialStrategies", JSON.stringify(updatedStrategies));
      
      // Update the current strategy
      if (strategy) {
        setStrategy({ ...strategy, rating, updatedAt: new Date() });
      }
      
      toast.success("Thanks for your feedback!");
    } catch (error) {
      console.error("Error rating strategy:", error);
      toast.error("Failed to save rating");
    }
  };

  return {
    strategy,
    relatedStrategies,
    saveNote,
    rateEffectiveness,
  };
}
