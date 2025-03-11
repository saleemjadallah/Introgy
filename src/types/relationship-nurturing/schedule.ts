
// Time range for preferred interaction times
export interface TimeRange {
  start: string;        // HH:MM format
  end: string;          // HH:MM format
  priority: number;     // 1-3 priority level
}

// Quiet periods where no interactions should be scheduled
export interface QuietPeriod {
  start: string;        // YYYY-MM-DD
  end: string;          // YYYY-MM-DD
  reason: string;
}

// Schedule settings for the connection scheduler
export interface ScheduleSettings {
  maxDailyInteractions: number;
  preferredDays: number[];        // 0-6 for days of week
  preferredTimeRanges: TimeRange[];
  quietPeriods: QuietPeriod[];
  batchSimilar: boolean;
  reminderStyle: 'gentle' | 'direct' | 'minimal';
}

// Custom frequency for a relationship
export interface CustomFrequency {
  unit: 'days' | 'weeks' | 'months';
  value: number;
  flexibility: number;           // days of flexibility
}

// Frequency for a category of relationships
export interface CategoryFrequency {
  unit: 'days' | 'weeks' | 'months';
  value: number;
}

// Relationship frequency settings
export interface RelationshipFrequency {
  relationshipId: string;
  categoryDefault: boolean;     // uses category default if true
  customFrequency?: CustomFrequency;
  lastInteraction: string;      // YYYY-MM-DD
  nextScheduled: string;        // YYYY-MM-DD
  isOverdue: boolean;
  overdueDays: number;
}

// Default frequency for a category
export interface CategoryDefault {
  category: string;             // family, close friends, etc.
  frequency: CategoryFrequency;
}

// Import the ScheduledInteraction interface to avoid the circular dependency
import { ScheduledInteraction } from './interactions';

// Main connection scheduler data structure
export interface ConnectionScheduler {
  userId: string;
  scheduleSettings: ScheduleSettings;
  relationshipFrequencies: RelationshipFrequency[];
  categoryDefaults: CategoryDefault[];
  scheduledInteractions: ScheduledInteraction[];
}
