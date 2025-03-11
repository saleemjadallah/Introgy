
import { StrategyFilters, ScenarioCategory, Strategy } from "@/types/social-strategies";

export interface StrategiesState {
  strategies: Strategy[];
  filteredStrategies: Strategy[];
  scenarioTypes: ScenarioCategory[];
  activeScenario: string | null;
  loading: boolean;
  filters: StrategyFilters;
}
