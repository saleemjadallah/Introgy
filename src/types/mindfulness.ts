
export interface MindfulnessPractice {
  id: string;
  title: string;
  category: MindfulnessCategory;
  subcategory: string;
  duration: number; // In minutes
  description: string;
  script: string; // The full meditation script
  audioUrl?: string; // Optional, for pre-recorded versions
  imageUrl?: string; // Optional theme image
  tags: string[];
  energyImpact: number; // -5 to +5 scale (negative = calming, positive = energizing)
  expertReviewed: boolean;
}

export type MindfulnessCategory = 
  | "Social Recovery" 
  | "Energy Conservation" 
  | "Quiet Strength" 
  | "Preparation" 
  | "Deep Focus";

export interface PracticeFilterOptions {
  category?: MindfulnessCategory;
  maxDuration?: number;
  tags?: string[];
  energyLevel?: number;
}

// Mindful Moments Types
export type MomentCategory = 'breathing' | 'grounding' | 'thought-reset' | 'energy-check';

export interface MindfulMoment {
  id: string;
  title: string;
  category: MomentCategory;
  duration: number; // in seconds (30-180)
  situation: string[];
  energyLevel: {
    min: number; // 1-10 scale
    max: number;
  };
  content: {
    instructions: string; // brief text instructions
    script: string; // complete guidance text
    animationId?: string; // optional reference to visual guide
    audioUrl?: string; // optional audio guidance
  };
  tags: string[];
}

export interface ContextTrigger {
  triggerType: 'time' | 'location' | 'app-event' | 'energy-level' | 'calendar';
  parameters: {
    timeOfDay?: string;
    daysOfWeek?: number[];
    thresholdLevel?: number;
    direction?: 'falling' | 'rising';
    eventType?: string;
    eventCategory?: string;
    minutesBefore?: number;
  };
  enabled: boolean;
  practices: string[]; // IDs of relevant practices
}

export interface MomentDeliverySettings {
  userId: string;
  contextTriggers: ContextTrigger[];
  notificationPreferences: {
    frequency: 'low' | 'medium' | 'high';
    quietHours: {
      start: string; // HH:MM format
      end: string;
    };
    style: 'gentle' | 'direct' | 'minimal';
  };
}
