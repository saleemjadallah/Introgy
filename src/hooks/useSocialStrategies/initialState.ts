
import { StrategiesState } from "./types";
import { scenarioTypes } from "./scenarioTypes";

export const getInitialState = (): StrategiesState => ({
  strategies: [],
  filteredStrategies: [],
  scenarioTypes,
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
