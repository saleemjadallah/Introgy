import { RelationshipTypes } from './relationships';
import { ScheduledInteraction } from './interactions';

export interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  date: Date;
  isCompleted: boolean;
  isPriority: boolean;
  relationshipIds: string[];
  type: 'interaction' | 'birthday' | 'anniversary' | 'custom';
  energyCost: number;
  duration: number;
  recurrence?: RecurrencePattern;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  days?: number[];
  weeks?: number[];
  months?: number[];
  years?: number[];
}

export interface InteractionSchedule {
  id: string;
  name: string;
  description?: string;
  relationshipTypes: RelationshipTypes[];
  frequency: {
    times: number;
    period: 'day' | 'week' | 'month' | 'year';
  };
  interactions: ScheduledInteraction[];
  isActive: boolean;
  createdAt: Date;
  lastUpdated: Date;
}

export interface TimeRange {
  start: string;        // HH:MM format
  end: string;          // HH:MM format
  priority: number;     // 1-3 priority level
}

export interface QuietPeriod {
  start: string;        // YYYY-MM-DD
  end: string;          // YYYY-MM-DD
  reason: string;
}

export interface ScheduleSettings {
  maxDailyInteractions: number;
  preferredDays: number[];        // 0-6 for days of week
  preferredTimeRanges: TimeRange[];
  quietPeriods: QuietPeriod[];
  batchSimilar: boolean;
  reminderStyle: 'gentle' | 'direct' | 'minimal';
}

export interface CustomFrequency {
  unit: 'days' | 'weeks' | 'months';
  value: number;
  flexibility: number;           // days of flexibility
}

export interface CategoryFrequency {
  unit: 'days' | 'weeks' | 'months';
  value: number;
}

export interface RelationshipFrequency {
  relationshipId: string;
  categoryDefault: boolean;     // uses category default if true
  customFrequency?: CustomFrequency;
  lastInteraction: string;      // YYYY-MM-DD
  nextScheduled: string;        // YYYY-MM-DD
  isOverdue: boolean;
  overdueDays: number;
}

export interface CategoryDefault {
  category: string;             // family, close friends, etc.
  frequency: CategoryFrequency;
}

export interface ConnectionScheduler {
  userId: string;
  scheduleSettings: ScheduleSettings;
  relationshipFrequencies: RelationshipFrequency[];
  categoryDefaults: CategoryDefault[];
  scheduledInteractions: ScheduledInteraction[];
}
