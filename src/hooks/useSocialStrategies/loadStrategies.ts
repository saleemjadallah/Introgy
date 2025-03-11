import { socialStrategiesData } from "@/data/socialStrategiesData";
import { Strategy } from "@/types/social-strategies";

export const loadStrategiesFromStorage = async (): Promise<Strategy[]> => {
  try {
    // Check if strategies exist in localStorage
    const savedStrategies = JSON.parse(localStorage.getItem("socialStrategies") || "null");
    
    if (savedStrategies && savedStrategies.length > 0) {
      // If strategies exist in localStorage, use those
      console.log("Loaded strategies from localStorage:", savedStrategies.length);
      return savedStrategies;
    } else {
      // Otherwise use mock data and save to localStorage
      localStorage.setItem("socialStrategies", JSON.stringify(socialStrategiesData));
      console.log("Saved mock strategies to localStorage:", socialStrategiesData.length);
      return socialStrategiesData;
    }
  } catch (error) {
    console.error("Error loading strategies:", error);
    // If there's an error, still try to use the mock data
    return socialStrategiesData;
  }
};

export const saveStrategiesToStorage = (strategies: Strategy[]): void => {
  localStorage.setItem("socialStrategies", JSON.stringify(strategies));
};
