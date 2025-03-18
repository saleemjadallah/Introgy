
export interface SocialEvent {
  id?: string;
  name: string;
  date: Date;
  location?: string;
  eventType: EventType;
  peopleCount: PeopleCount;
  knownAttendees?: string[];
  energyCost: number; // 1-10
  duration?: number; // in minutes
  notes?: string;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
  energyDepleted?: boolean; // Track if this event has already depleted the battery
}

export type EventType = 
  | 'work function' 
  | 'casual gathering' 
  | 'formal event' 
  | 'family gathering' 
  | 'date' 
  | 'networking' 
  | 'other';

export type PeopleCount = 
  | 'intimate (2-5)' 
  | 'small group (5-15)' 
  | 'medium gathering (15-30)' 
  | 'large event (30+)';

export type RecurringFrequency = 
  | 'daily' 
  | 'weekly' 
  | 'biweekly' 
  | 'monthly' 
  | 'custom';

export interface ConversationStarter {
  starter: string;
  explanation: string;
  followUp: string;
  category: 'casual' | 'professional' | 'topical' | 'personal';
  isFavorite?: boolean;
}

export interface ExitStrategy {
  title: string;
  description: string;
  duration: 'brief' | 'medium' | 'complete';
  context: EventType[];
}

export interface EventPreparation {
  eventId: string;
  conversationStarters: ConversationStarter[];
  exitStrategies: ExitStrategy[];
  boundaries: string[];
  energyPlan: {
    preEventActivities: string[];
    quietTime: number; // minutes before event
    quietTimeAfter: number; // minutes after event
  };
  aiMemo?: string; // AI-generated preparation memo
  reflectionCompleted?: boolean;
  reflection?: EventReflection;
}

export interface EventReflection {
  rating: number; // 1-5
  actualEnergyCost: number; // 1-10
  successfulTopics: string[];
  challenges: string[];
  exitStrategyUsed?: string;
  notes?: string;
}
