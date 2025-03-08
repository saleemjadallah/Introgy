
export type ScenarioType = "professional" | "social" | "challenging" | "daily" | "all";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type ConversationLength = "quick" | "short" | "extended";
export type PersonaType = 
  | "direct communicator" 
  | "rambler" 
  | "close-talker" 
  | "shy person" 
  | "extrovert" 
  | "interviewer" 
  | "customer service" 
  | "colleague" 
  | "acquaintance"
  | "friend";

export interface Scenario {
  id: string;
  name: string;
  type: ScenarioType;
  difficulty: Difficulty;
  duration: ConversationLength;
  personaType: PersonaType;
  description: string;
  initialMessage: string;
  contextualHints?: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface FeedbackResult {
  strengths: string[];
  improvementAreas: string[];
  overallScore: number;
  engagementLevel: string;
  conversationFlow: string;
  keyLearnings: string;
}
