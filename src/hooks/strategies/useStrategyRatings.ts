
import { Strategy } from "@/types/social-strategies";
import { toast } from "sonner";
import { getAllStrategies, saveStrategiesToLocalStorage } from "./strategyUtils";

export function useStrategyRatings() {
  // Rate strategy effectiveness
  const rateEffectiveness = (strategyId: string, rating: "effective" | "neutral" | "ineffective") => {
    try {
      // Get all strategies from localStorage
      const allStrategies = getAllStrategies();
      
      // Update the rating for the selected strategy
      const updatedStrategies = allStrategies.map((s: Strategy) =>
        s.id === strategyId
          ? { ...s, rating, updatedAt: new Date() }
          : s
      );
      
      // Save back to localStorage
      saveStrategiesToLocalStorage(updatedStrategies);
      
      toast.success("Thanks for your feedback!");
      return true;
    } catch (error) {
      console.error("Error rating strategy:", error);
      toast.error("Failed to save rating");
      return false;
    }
  };

  return { rateEffectiveness };
}
