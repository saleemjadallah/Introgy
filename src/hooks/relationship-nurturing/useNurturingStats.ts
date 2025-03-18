
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NurturingStats } from '@/types/relationship-nurturing';
import { calculateStats } from './utils/statsCalculator';

export const useNurturingStats = (
  relationships = [], 
  scheduledInteractions = [], 
  relationshipFrequencies = []
) => {
  const [stats, setStats] = useState<NurturingStats>({
    plannedToday: 0,
    completedToday: 0,
    plannedThisWeek: 0,
    completedThisWeek: 0,
    overdueCount: 0,
    healthyRelationships: 0,
    needsAttentionCount: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    setStats(calculateStats(scheduledInteractions, relationships, relationshipFrequencies));
  }, [relationships, scheduledInteractions, relationshipFrequencies]);

  return { stats };
};
