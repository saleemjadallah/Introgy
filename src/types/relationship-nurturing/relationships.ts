
import { InteractionType } from './interactions';

// A meaningful life event for a relationship
export interface LifeEvent {
  id: string;
  relationshipId: string;
  eventType: string;  // birthday, anniversary, promotion, etc.
  date: string;       // YYYY-MM-DD
  description: string;
  recurring: boolean;
  reminderDaysBefore: number;
}

// A suggested conversation topic for a relationship
export interface ConversationTopic {
  id: string;
  topic: string;
  context: string;
  source: 'previous-conversation' | 'life-event' | 'interest' | 'follow-up';
  importance: number;  // 1-5
  lastDiscussed?: string;
}

// A relationship with basic info and context
export interface Relationship {
  id: string;
  name: string;
  category: string;
  importance: number;  // 1-5
  notes: string;
  contactMethods: {
    type: string;
    value: string;
  }[];
  interests: string[];
  lifeEvents: LifeEvent[];
  conversationTopics: ConversationTopic[];
  interactionHistory: {
    date: string;
    type: InteractionType;
    notes: string;
    quality: number;  // 1-5
  }[];
}
