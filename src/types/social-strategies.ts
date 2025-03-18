
export interface Strategy {
  id: string;
  title: string;
  description: string;
  scenarioType: string; // e.g., professional, social-gatherings, etc.
  type: StrategyType;
  energyLevel: EnergyLevel;
  prepTime: number; // minutes
  steps: string[];
  examplePhrases?: string[];
  challenges: Challenge[];
  tags: string[];
  personalNote?: string;
  isFavorite: boolean;
  rating?: "effective" | "neutral" | "ineffective" | null;
  createdAt: Date;
  updatedAt: Date;
}

export type StrategyType = 
  | "quick" 
  | "preparation" 
  | "recovery" 
  | "energy-conservation" 
  | "connection";

export type ScenarioType = 
  | "professional" 
  | "social-gatherings" 
  | "one-on-one" 
  | "family-events" 
  | "public-spaces" 
  | "digital-communication";

export type EnergyLevel = "low" | "medium" | "high";

export interface Challenge {
  challenge: string;
  solution: string;
}

export interface ScenarioCategory {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
}

export interface StrategyFilters {
  types: StrategyType[];
  maxEnergy: number;
  maxPrepTime: number;
  favoritesOnly: boolean;
  searchQuery: string;
}

export interface StrategiesState {
  strategies: Strategy[];
  filteredStrategies: Strategy[];
  scenarioTypes: ScenarioCategory[];
  activeScenario: string | null;
  loading: boolean;
  filters: StrategyFilters;
}
