
import { useState, useEffect } from "react";
import { Strategy, StrategyFilters } from "@/types/social-strategies";
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { getInitialState } from "./initialState";
import { filterStrategies } from "./filterStrategies";
import { loadStrategiesFromStorage, saveStrategiesToStorage } from "./loadStrategies";
import { StrategiesState } from "./types";

export function useSocialStrategies() {
  const { batteryLevel } = useSocialBattery();
  const [state, setState] = useState<StrategiesState>(getInitialState());

  // Load strategies from the data source
  useEffect(() => {
    const loadStrategies = async () => {
      try {
        const strategies = await loadStrategiesFromStorage();
        setState((prevState) => ({
          ...prevState,
          strategies,
          loading: false,
        }));
      } catch (error) {
        console.error("Error in loadStrategies:", error);
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
    
    const filteredStrategies = filterStrategies(
      strategies,
      activeScenario,
      filters,
      batteryLevel
    );

    setState((prevState) => ({
      ...prevState,
      filteredStrategies,
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
      saveStrategiesToStorage(updatedStrategies);

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

// Re-export for backwards compatibility
export * from "./types";
