// Deep Questions
export interface DeepQuestion {
  id: string;
  text: string;
  category: string;        // personal-values, aspirations, experiences, beliefs, etc.
  depthLevel: number;      // 1-3 (light, medium, deep)
  topics: string[];        // related interest areas
  relationshipTypes: string[]; // appropriate relationship contexts
  energyRequired: number;  // 1-5 scale for conversation intensity
  followUps: string[];     // potential follow-up questions
}

// Message Templates
export interface MessageVariable {
  name: string;           // variable name
  type: string;           // text, selection, memory, interest
  options?: string[];     // if type is selection
}

export interface MessageTemplate {
  id: string;
  purpose: string;        // thinking-of-you, appreciation, reconnection, celebration
  baseTemplate: string;   // template with {{variable}} placeholders
  variables: MessageVariable[];
  tone: string;           // warm, casual, thoughtful, celebratory
  energyRequired: number; // 1-5 scale
  relationshipStage: string; // new, established, close, reconnecting
}

// Connection Rituals
export interface RitualFrequency {
  unit: 'days' | 'weeks' | 'months';
  value: number;
  flexibility: number;    // days of flexibility
}

export interface ConnectionRitual {
  id: string;
  name: string;
  description: string;
  frequency: RitualFrequency;
  interactionType: string; // message, call, video, in-person
  duration: number;        // estimated minutes
  structure: string;       // description of ritual format
  prompts: string[];       // conversation/activity prompts
  energyCost: number;      // 1-5 scale
  relationshipTypes: string[];
}

// Shared Experiences
export interface SharedExperience {
  id: string;
  title: string;
  category: string;        // article, video, activity, game, etc.
  description: string;
  url?: string;            // optional external link
  interestTags: string[];
  timeRequired: number;    // minutes
  energyRequired: number;  // 1-5 scale
  discussionPrompts: string[];
  relationshipTypes: string[];
}

// Filter options for different tools
export interface MeaningfulInteractionFilters {
  categories?: string[];
  depthLevels?: number[];
  relationshipTypes?: string[];
  energyLevels?: number[];
  topics?: string[];
  searchTerm?: string;
}