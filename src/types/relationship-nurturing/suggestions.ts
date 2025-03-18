
import { InteractionType } from './interactions';

// Connection suggestion
export interface ConnectionSuggestion {
  id: string;
  relationshipId: string;
  relationshipName: string;
  suggested: boolean;         // AI suggested vs manually added
  suggestedDate: string;
  suggestedTime: string;
  interactionType: InteractionType;
  reasonForSuggestion: string;
  energyLevelRequired: number; // 1-10
  priority: number;           // 1-5 (1 is highest)
  expectedResponse: 'fast' | 'medium' | 'slow' | 'delayed' | 'uncertain';
}

// Intelligent conversation starter
export interface IntelligentConversationStarter {
  id: string;
  relationshipId: string;
  topic: string;
  starter: string;           // The actual conversation starter
  context: string;           // Why this starter was generated
  confidenceScore: number;   // 0-1
  source: 'interest' | 'previous_conversation' | 'past_conversation' | 'life_event' | 'current_event' | 'shared_experience';
}

// Message template
export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  context: 'check_in' | 'life_event' | 'follow_up' | 'celebration' | 'reconnect';
  template: string;
  personalizable: boolean;
  tone: 'casual' | 'warm' | 'professional';
  energyRequired: number;  // 1-10
  
  // These fields are kept for backward compatibility
  title?: string;
  body?: string;
  appropriate_for?: string[];
  energy_required?: number;
}
