
import { TimeRange, QuietPeriod, CategoryFrequency, CustomFrequency } from './schedule';

export interface DbSchedulerSettings {
  id: string;
  user_id: string;
  max_daily_interactions: number;
  preferred_days: number[];
  preferred_time_ranges: TimeRange[];
  quiet_periods: QuietPeriod[];
  batch_similar: boolean;
  reminder_style: 'gentle' | 'direct' | 'minimal';
  created_at: string;
  updated_at: string;
}

export interface DbRelationshipFrequency {
  id: string;
  user_id: string;
  relationship_id: string;
  category_default: boolean;
  custom_frequency: CustomFrequency | null;
  last_interaction: string | null;
  next_scheduled: string | null;
  is_overdue: boolean;
  overdue_days: number;
  created_at: string;
  updated_at: string;
}

export interface DbCategoryDefault {
  id: string;
  user_id: string;
  category: string;
  frequency: CategoryFrequency;
  created_at: string;
  updated_at: string;
}
