
import { TimeRange, QuietPeriod, CategoryFrequency, CustomFrequency } from './schedule';
import { Json } from '@/integrations/supabase/types';

export interface DbSchedulerSettings {
  id: string;
  user_id: string;
  max_daily_interactions: number;
  preferred_days: number[];
  preferred_time_ranges: Json;  // Stored as JSON string
  quiet_periods: Json;          // Stored as JSON string
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
  custom_frequency: Json | null;  // Stored as JSON string
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
  frequency: Json;  // Stored as JSON string
  created_at: string;
  updated_at: string;
}

