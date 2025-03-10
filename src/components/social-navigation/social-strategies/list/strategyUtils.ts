
import { Strategy } from "@/types/social-strategies";

export const filterStrategiesBySearchQuery = (
  strategies: Strategy[],
  searchQuery: string
): Strategy[] => {
  if (searchQuery.trim() === "") {
    return strategies;
  }
  
  const lowercaseQuery = searchQuery.toLowerCase();
  
  return strategies.filter(
    (strategy) =>
      strategy.title.toLowerCase().includes(lowercaseQuery) ||
      strategy.description.toLowerCase().includes(lowercaseQuery) ||
      strategy.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
};
