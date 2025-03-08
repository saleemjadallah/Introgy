import { useState, useEffect } from "react";
import { Strategy, StrategyFilters, ScenarioCategory, StrategiesState } from "@/types/social-strategies";
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { socialStrategiesData } from "@/data/socialStrategiesData";

export function useSocialStrategies() {
  const { batteryLevel } = useSocialBattery();
  
  const [state, setState] = useState<StrategiesState>({
    strategies: [],
    filteredStrategies: [],
    scenarioTypes: [
      {
        id: "professional",
        name: "Professional",
        description: "Meetings, networking, presentations",
      },
      {
        id: "social-gatherings",
        name: "Social Gatherings",
        description: "Parties, events, dinners",
      },
      {
        id: "one-on-one",
        name: "One-on-One",
        description: "Dates, friend meetups",
      },
      {
        id: "family-events",
        name: "Family Events",
        description: "Holidays, gatherings",
      },
      {
        id: "public-spaces",
        name: "Public Spaces",
        description: "Commuting, shopping, classes",
      },
      {
        id: "digital-communication",
        name: "Digital Communication",
        description: "Emails, video calls",
      },
    ],
    activeScenario: null,
    loading: true,
    filters: {
      types: ["quick", "preparation", "recovery", "energy-conservation", "connection"],
      maxEnergy: 10,
      maxPrepTime: 60,
      favoritesOnly: false,
      searchQuery: "",
    },
  });

  // Load strategies from the data source
  useEffect(() => {
    const loadStrategies = async () => {
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use the mock data
        const savedStrategies = JSON.parse(localStorage.getItem("socialStrategies") || "null");
        
        // If strategies exist in localStorage, use those, otherwise use mock data
        const strategies = savedStrategies || socialStrategiesData;
        
        setState((prevState) => ({
          ...prevState,
          strategies,
          loading: false,
        }));
      } catch (error) {
        console.error("Error loading strategies:", error);
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    };

    loadStrategies();
  }, []);

  // Filter strategies when filters or active scenario changes
  useEffect(() => {
    const { strategies, filters, activeScenario } = state;
    
    if (!strategies.length || !activeScenario) {
      setState((prevState) => ({
        ...prevState,
        filteredStrategies: [],
      }));
      return;
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

    setState((prevState) => ({
      ...prevState,
      filteredStrategies: filtered,
    }));
  }, [state.strategies, state.filters, state.activeScenario, batteryLevel]);

  // Set active scenario
  const setActiveScenario = (scenarioId: string) => {
    setState((prevState) => ({
      ...prevState,
      activeScenario: scenarioId,
    }));
  };

  // Update filters
  const updateFilters = (newFilters: Partial<StrategyFilters>) => {
    setState((prevState) => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        ...newFilters,
      },
    }));
  };

  // Toggle favorite for a strategy
  const toggleFavorite = (strategyId: string) => {
    setState((prevState) => {
      const updatedStrategies = prevState.strategies.map((strategy) => {
        if (strategy.id === strategyId) {
          return {
            ...strategy,
            isFavorite: !strategy.isFavorite,
            updatedAt: new Date(),
          };
        }
        return strategy;
      });

      // Save to localStorage
      localStorage.setItem("socialStrategies", JSON.stringify(updatedStrategies));

      return {
        ...prevState,
        strategies: updatedStrategies,
      };
    });
  };

  return {
    ...state,
    setActiveScenario,
    updateFilters,
    toggleFavorite,
  };
}
