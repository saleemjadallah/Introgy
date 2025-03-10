
import { Strategy } from "@/types/social-strategies";
import { toast } from "sonner";

// Get all strategies from localStorage
export const getAllStrategies = (): Strategy[] => {
  try {
    const allStrategiesString = localStorage.getItem("socialStrategies");
    
    if (!allStrategiesString) {
      console.error("No strategies found in localStorage");
      return [];
    }
    
    const allStrategies = JSON.parse(allStrategiesString);
    
    if (!Array.isArray(allStrategies) || allStrategies.length === 0) {
      console.error("Invalid or empty strategies array in localStorage");
      return [];
    }
    
    return allStrategies;
  } catch (error) {
    console.error("Error getting strategies:", error);
    return [];
  }
};

// Save strategies to localStorage
export const saveStrategiesToLocalStorage = (strategies: Strategy[]): void => {
  try {
    localStorage.setItem("socialStrategies", JSON.stringify(strategies));
  } catch (error) {
    console.error("Error saving strategies:", error);
    toast.error("Failed to save changes");
  }
};

// Find a specific strategy by ID
export const findStrategyById = (strategyId: string): Strategy | null => {
  const allStrategies = getAllStrategies();
  return allStrategies.find((s) => s.id === strategyId) || null;
};

// Find related strategies based on a given strategy
export const findRelatedStrategies = (strategy: Strategy, limit: number = 3): Strategy[] => {
  const allStrategies = getAllStrategies();
  
  const related = allStrategies
    .filter((s) => 
      s.id !== strategy.id && 
      s.scenarioType === strategy.scenarioType &&
      (
        s.type === strategy.type || // Same strategy type
        s.tags.some(tag => strategy.tags.includes(tag)) // Or has common tags
      )
    )
    .slice(0, limit); // Limit the number of related strategies
  
  return related;
};
