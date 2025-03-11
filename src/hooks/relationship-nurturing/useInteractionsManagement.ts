
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { 
  Relationship,
  NurturingStats,
  ConnectionScheduler,
  ScheduledInteraction
} from '@/types/relationship-nurturing';

// Import utility functions
import { calculateStats } from './utils/statsCalculator';
import { useInteractionGeneration } from './interactions/useInteractionGeneration';
import { useInteractionOperations } from './interactions/useInteractionOperations';
import { useFrequencyManagement } from './interactions/useFrequencyManagement';

export function useInteractionsManagement(
  relationships: Relationship[],
  scheduler: ConnectionScheduler | null,
  toast: any
) {
  const [scheduledInteractions, setScheduledInteractions] = useState<ScheduledInteraction[]>([]);
  const [todayInteractions, setTodayInteractions] = useState<ScheduledInteraction[]>([]);
  const [stats, setStats] = useState<NurturingStats | null>(null);
  const [relationshipFrequencies, setRelationshipFrequencies] = useState(
    scheduler?.relationshipFrequencies || []
  );
  
  // Initialize interactions from scheduler
  useEffect(() => {
    if (scheduler) {
      setScheduledInteractions(scheduler.scheduledInteractions);
      setRelationshipFrequencies(scheduler.relationshipFrequencies);
      
      const today = format(new Date(), 'yyyy-MM-dd');
      const todaysInteractions = scheduler.scheduledInteractions.filter(i => i.scheduledDate === today);
      setTodayInteractions(todaysInteractions);
      
      const updatedStats = calculateStats(
        scheduler.scheduledInteractions, 
        relationships,
        scheduler.relationshipFrequencies
      );
      setStats(updatedStats);
    }
  }, [scheduler, relationships]);
  
  // Recalculate stats when interactions change
  useEffect(() => {
    if (scheduledInteractions.length && relationshipFrequencies.length) {
      const updatedStats = calculateStats(
        scheduledInteractions, 
        relationships,
        relationshipFrequencies
      );
      setStats(updatedStats);
    }
  }, [scheduledInteractions, relationships, relationshipFrequencies]);

  // Use the interaction generation hook
  const { generateInteractions } = useInteractionGeneration(
    relationships,
    scheduler,
    setScheduledInteractions,
    setTodayInteractions,
    toast
  );

  // Use the interaction operations hook
  const {
    scheduleInteraction,
    updateInteraction,
    completeInteraction,
    skipInteraction,
    rescheduleInteraction,
    updateScheduleSettings
  } = useInteractionOperations(
    scheduledInteractions,
    setScheduledInteractions,
    setTodayInteractions,
    toast
  );

  // Use the frequency management hook
  const { updateFrequencyAfterInteraction } = useFrequencyManagement(
    relationships,
    relationshipFrequencies,
    scheduler?.categoryDefaults || [],
    setRelationshipFrequencies
  );

  // Wrap completeInteraction to also update frequencies
  const handleCompleteInteraction = useCallback(async (interactionId: string, notes?: string) => {
    const completedDate = format(new Date(), 'yyyy-MM-dd');
    
    // Find the interaction
    const interaction = scheduledInteractions.find(i => i.id === interactionId);
    
    // Call the original complete function
    await completeInteraction(interactionId, notes);
    
    // Update frequencies if we found the interaction
    if (interaction) {
      updateFrequencyAfterInteraction(interaction, completedDate);
    }
  }, [scheduledInteractions, completeInteraction, updateFrequencyAfterInteraction]);

  return {
    scheduledInteractions,
    todayInteractions,
    stats,
    scheduleInteraction,
    updateInteraction,
    completeInteraction: handleCompleteInteraction,
    skipInteraction,
    rescheduleInteraction,
    generateInteractions,
    updateScheduleSettings
  };
}
