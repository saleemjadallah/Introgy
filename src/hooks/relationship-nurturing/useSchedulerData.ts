
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  ConnectionScheduler,
  CategoryDefault,
  RelationshipFrequency,
  ScheduleSettings 
} from '@/types/relationship-nurturing';
import { 
  DbSchedulerSettings, 
  DbRelationshipFrequency, 
  DbCategoryDefault 
} from '@/types/relationship-nurturing/scheduler';
import { mockScheduler } from '@/data/relationshipNurturingData';

// Helper to convert database scheduler settings to app format
const convertDbSchedulerToApp = (
  settings: DbSchedulerSettings,
  frequencies: DbRelationshipFrequency[],
  categoryDefaults: DbCategoryDefault[]
): ConnectionScheduler => {
  return {
    userId: settings.user_id,
    scheduleSettings: {
      maxDailyInteractions: settings.max_daily_interactions,
      preferredDays: settings.preferred_days,
      preferredTimeRanges: settings.preferred_time_ranges,
      quietPeriods: settings.quiet_periods,
      batchSimilar: settings.batch_similar,
      reminderStyle: settings.reminder_style,
    },
    relationshipFrequencies: frequencies.map(freq => ({
      relationshipId: freq.relationship_id,
      categoryDefault: freq.category_default,
      customFrequency: freq.custom_frequency,
      lastInteraction: freq.last_interaction || '',
      nextScheduled: freq.next_scheduled || '',
      isOverdue: freq.is_overdue,
      overdueDays: freq.overdue_days
    })),
    categoryDefaults: categoryDefaults.map(cat => ({
      category: cat.category,
      frequency: cat.frequency
    })),
    scheduledInteractions: []
  };
};

// Helper to convert app scheduler settings to database format
const convertAppSchedulerToDb = (scheduler: ConnectionScheduler): {
  settings: Omit<DbSchedulerSettings, 'id' | 'created_at' | 'updated_at'>,
  frequencies: Omit<DbRelationshipFrequency, 'id' | 'created_at' | 'updated_at'>[],
  categoryDefaults: Omit<DbCategoryDefault, 'id' | 'created_at' | 'updated_at'>[]
} => {
  return {
    settings: {
      user_id: scheduler.userId,
      max_daily_interactions: scheduler.scheduleSettings.maxDailyInteractions,
      preferred_days: scheduler.scheduleSettings.preferredDays,
      preferred_time_ranges: scheduler.scheduleSettings.preferredTimeRanges,
      quiet_periods: scheduler.scheduleSettings.quietPeriods,
      batch_similar: scheduler.scheduleSettings.batchSimilar,
      reminder_style: scheduler.scheduleSettings.reminderStyle
    },
    frequencies: scheduler.relationshipFrequencies.map(freq => ({
      user_id: scheduler.userId,
      relationship_id: freq.relationshipId,
      category_default: freq.categoryDefault,
      custom_frequency: freq.customFrequency,
      last_interaction: freq.lastInteraction || null,
      next_scheduled: freq.nextScheduled || null,
      is_overdue: freq.isOverdue,
      overdue_days: freq.overdueDays
    })),
    categoryDefaults: scheduler.categoryDefaults.map(cat => ({
      user_id: scheduler.userId,
      category: cat.category,
      frequency: cat.frequency
    }))
  };
};

export const useSchedulerData = () => {
  const [scheduler, setScheduler] = useState<ConnectionScheduler | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSchedulerData = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session) {
        // Load all scheduler components
        const [
          { data: settingsData, error: settingsError },
          { data: frequenciesData, error: frequenciesError },
          { data: defaultsData, error: defaultsError }
        ] = await Promise.all([
          supabase.from('scheduler_settings').select('*').eq('user_id', session.session.user.id).single(),
          supabase.from('relationship_frequencies').select('*').eq('user_id', session.session.user.id),
          supabase.from('category_defaults').select('*').eq('user_id', session.session.user.id)
        ]);

        if (settingsError || frequenciesError || defaultsError) {
          throw new Error('Error loading scheduler data');
        }

        if (settingsData) {
          setScheduler(convertDbSchedulerToApp(
            settingsData,
            frequenciesData || [],
            defaultsData || []
          ));
        } else {
          // Initialize with mock data for new users
          const dbData = convertAppSchedulerToDb({
            ...mockScheduler,
            userId: session.session.user.id
          });

          // Insert initial data
          const [
            { error: insertSettingsError },
            { error: insertFrequenciesError },
            { error: insertDefaultsError }
          ] = await Promise.all([
            supabase.from('scheduler_settings').insert(dbData.settings),
            supabase.from('relationship_frequencies').insert(dbData.frequencies),
            supabase.from('category_defaults').insert(dbData.categoryDefaults)
          ]);

          if (insertSettingsError || insertFrequenciesError || insertDefaultsError) {
            throw new Error('Error initializing scheduler data');
          }

          setScheduler({
            ...mockScheduler,
            userId: session.session.user.id
          });
        }
      } else {
        // Not logged in, use mock data
        setScheduler(mockScheduler);
      }
    } catch (error) {
      console.error('Error in loadSchedulerData:', error);
      toast.error('Failed to load scheduler data');
      setScheduler(mockScheduler);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSchedulerData = async (updatedScheduler: ConnectionScheduler) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session) {
        const dbData = convertAppSchedulerToDb(updatedScheduler);

        // Update all scheduler components
        const [
          { error: settingsError },
          { error: frequenciesError },
          { error: defaultsError }
        ] = await Promise.all([
          supabase
            .from('scheduler_settings')
            .update(dbData.settings)
            .eq('user_id', session.session.user.id),
          supabase
            .from('relationship_frequencies')
            .delete()
            .eq('user_id', session.session.user.id)
            .then(() => supabase.from('relationship_frequencies').insert(dbData.frequencies)),
          supabase
            .from('category_defaults')
            .delete()
            .eq('user_id', session.session.user.id)
            .then(() => supabase.from('category_defaults').insert(dbData.categoryDefaults))
        ]);

        if (settingsError || frequenciesError || defaultsError) {
          throw new Error('Error saving scheduler data');
        }

        setScheduler(updatedScheduler);
      }
    } catch (error) {
      console.error('Error in saveSchedulerData:', error);
      toast.error('Failed to save scheduler changes');
    }
  };

  useEffect(() => {
    loadSchedulerData();
  }, []);

  return {
    scheduler,
    isLoading,
    loadSchedulerData,
    saveSchedulerData
  };
};
