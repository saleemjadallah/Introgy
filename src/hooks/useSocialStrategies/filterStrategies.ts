import { Strategy, StrategyFilters } from "@/types/social-strategies";

export const filterStrategies = (
  strategies: Strategy[],
  activeScenario: string | null,
  filters: StrategyFilters,
  batteryLevel: number
): Strategy[] => {
  if (!strategies.length || !activeScenario) {
    return [];
  }

  let filtered = strategies.filter((strategy) => {
    // Filter by scenario type
    if (strategy.scenarioType !== activeScenario) {
      return false;
    }

    // Filter by strategy types
    if (!filters.types.includes(strategy.type)) {
      return false;
    }

    // Filter by max energy
    const energyValue = { low: 3, medium: 6, high: 10 }[strategy.energyLevel];
    if (energyValue > filters.maxEnergy) {
      return false;
    }

    // Filter by max prep time
    if (strategy.prepTime > filters.maxPrepTime) {
      return false;
    }

    // Filter by favorites
    if (filters.favoritesOnly && !strategy.isFavorite) {
      return false;
    }

    return true;
  });

  // Sort strategies based on user's current battery level
  filtered.sort((a, b) => {
    // Prioritize favorites
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;

    // Then prioritize energy-appropriate strategies based on current battery level
    const aEnergyValue = { low: 3, medium: 6, high: 10 }[a.energyLevel];
    const bEnergyValue = { low: 3, medium: 6, high: 10 }[b.energyLevel];
    
    // If battery is low, prioritize low-energy strategies
    if (batteryLevel < 30) {
      return aEnergyValue - bEnergyValue;
    }
    
    // Otherwise, sort by most effective (based on user ratings)
    if (a.rating === "effective" && b.rating !== "effective") return -1;
    if (a.rating !== "effective" && b.rating === "effective") return 1;
    
    // Finally sort by recency
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return filtered;
};
