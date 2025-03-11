
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Relationship,
  NurturingStats,
  ConnectionScheduler,
  ScheduledInteraction,
  InteractionStatus,
  RelationshipFrequency
} from '@/types/relationship-nurturing';
import { addDays, format, isAfter, isBefore, parseISO, subDays } from 'date-fns';

export function useInteractionsManagement(
  relationships: Relationship[],
  scheduler: ConnectionScheduler | null,
  toast: any
) {
  const [scheduledInteractions, setScheduledInteractions] = useState<ScheduledInteraction[]>([]);
  const [todayInteractions, setTodayInteractions] = useState<ScheduledInteraction[]>([]);
  const [stats, setStats] = useState<NurturingStats | null>(null);

  // Update interactions when scheduler or relationships change
  useEffect(() => {
    if (scheduler) {
      setScheduledInteractions(scheduler.scheduledInteractions);
      
      // Calculate today's interactions
      const today = format(new Date(), 'yyyy-MM-dd');
      const todaysInteractions = scheduler.scheduledInteractions.filter(i => i.scheduledDate === today);
      setTodayInteractions(todaysInteractions);
      
      // Calculate stats
      calculateStats(scheduler.scheduledInteractions, relationships);
    }
  }, [scheduler, relationships]);

  // Calculate statistics for the dashboard
  const calculateStats = useCallback((interactions: ScheduledInteraction[], relations: Relationship[]) => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const startOfWeek = subDays(today, today.getDay());

    const plannedToday = interactions.filter(i => i.scheduledDate === todayStr).length;
    const completedToday = interactions.filter(i => i.scheduledDate === todayStr && i.status === 'completed').length;
    
    const plannedThisWeek = interactions.filter(i => {
      const interactionDate = parseISO(i.scheduledDate);
      return isAfter(interactionDate, startOfWeek) && 
             isBefore(interactionDate, addDays(startOfWeek, 7));
    }).length;
    
    const completedThisWeek = interactions.filter(i => {
      const interactionDate = parseISO(i.scheduledDate);
      return isAfter(interactionDate, startOfWeek) && 
             isBefore(interactionDate, addDays(startOfWeek, 7)) &&
             i.status === 'completed';
    }).length;

    const overdueInteractions = scheduler?.relationshipFrequencies.filter(rf => rf.isOverdue) || [];
    const overdueCount = overdueInteractions.length;
    
    // Simple algorithm to determine relationship health based on frequency adherence
    const healthyRelationships = relations.filter(r => {
      const frequency = scheduler?.relationshipFrequencies.find(rf => rf.relationshipId === r.id);
      return frequency && !frequency.isOverdue;
    }).length;

    const needsAttentionCount = relations.length - healthyRelationships;

    const upcomingEvents = relations.flatMap(r => 
      r.lifeEvents.filter(e => {
        const eventDate = parseISO(e.date);
        const daysUntil = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil >= 0 && daysUntil <= 14; // Events in the next 14 days
      })
    ).length;

    setStats({
      plannedToday,
      completedToday,
      plannedThisWeek,
      completedThisWeek,
      overdueCount,
      healthyRelationships,
      needsAttentionCount,
      upcomingEvents
    });
  }, [scheduler]);

  // Add a new scheduled interaction
  const scheduleInteraction = useCallback(async (interaction: Omit<ScheduledInteraction, 'id'>) => {
    const newInteraction: ScheduledInteraction = {
      ...interaction,
      id: uuidv4()
    };

    const updatedInteractions = [...scheduledInteractions, newInteraction];
    setScheduledInteractions(updatedInteractions);

    // Update scheduler
    if (scheduler) {
      const updatedScheduler = {
        ...scheduler,
        scheduledInteractions: updatedInteractions
      };
      
      // If the scheduled date is today, add to today's interactions
      const today = format(new Date(), 'yyyy-MM-dd');
      if (newInteraction.scheduledDate === today) {
        setTodayInteractions([...todayInteractions, newInteraction]);
      }
    }

    toast({
      title: 'Interaction scheduled',
      description: `Scheduled to connect with ${newInteraction.relationshipName} on ${format(parseISO(newInteraction.scheduledDate), 'MMM d, yyyy')}.`
    });

    return newInteraction;
  }, [scheduledInteractions, todayInteractions, scheduler, toast]);

  // Update an existing scheduled interaction
  const updateInteraction = useCallback(async (interactionId: string, updates: Partial<ScheduledInteraction>) => {
    const updatedInteractions = scheduledInteractions.map(interaction => {
      if (interaction.id === interactionId) {
        return { ...interaction, ...updates };
      }
      return interaction;
    });

    setScheduledInteractions(updatedInteractions);

    // Update today's interactions if needed
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedTodayInteractions = updatedInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(updatedTodayInteractions);

    toast({
      title: 'Interaction updated',
      description: 'Your scheduled interaction has been updated.'
    });
  }, [scheduledInteractions, toast]);

  // Mark an interaction as completed
  const completeInteraction = useCallback(async (interactionId: string, notes?: string) => {
    const completedDate = format(new Date(), 'yyyy-MM-dd');

    const updatedInteractions = scheduledInteractions.map(interaction => {
      if (interaction.id === interactionId) {
        return { 
          ...interaction, 
          status: 'completed' as InteractionStatus,
          completedDate,
          ...(notes && { preparationNotes: notes })
        };
      }
      return interaction;
    });

    setScheduledInteractions(updatedInteractions);

    // Update today's interactions
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedTodayInteractions = updatedInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(updatedTodayInteractions);

    // Update scheduler
    if (scheduler) {
      // Find the relationship frequency for this interaction
      const interaction = scheduledInteractions.find(i => i.id === interactionId);
      if (interaction) {
        const updatedFrequencies = scheduler.relationshipFrequencies.map(freq => {
          if (freq.relationshipId === interaction.relationshipId) {
            // Calculate next scheduled date based on frequency
            const nextDate = calculateNextInteractionDate(freq);
            return {
              ...freq,
              lastInteraction: completedDate,
              nextScheduled: nextDate,
              isOverdue: false,
              overdueDays: 0
            };
          }
          return freq;
        });
      }
    }

    // Recalculate stats
    calculateStats(updatedInteractions, relationships);

    toast({
      title: 'Interaction completed',
      description: 'Your interaction has been marked as completed.'
    });
  }, [scheduledInteractions, scheduler, relationships, calculateStats, toast]);

  // Skip an interaction
  const skipInteraction = useCallback(async (interactionId: string, reason?: string) => {
    const updatedInteractions = scheduledInteractions.map(interaction => {
      if (interaction.id === interactionId) {
        return { 
          ...interaction, 
          status: 'skipped' as InteractionStatus,
          ...(reason && { preparationNotes: `Skipped: ${reason}` })
        };
      }
      return interaction;
    });

    setScheduledInteractions(updatedInteractions);

    // Update today's interactions
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedTodayInteractions = updatedInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(updatedTodayInteractions);

    toast({
      title: 'Interaction skipped',
      description: reason || 'Your interaction has been skipped.'
    });
  }, [scheduledInteractions, toast]);

  // Reschedule an interaction
  const rescheduleInteraction = useCallback(async (interactionId: string, newDate: string, reason?: string) => {
    const updatedInteractions = scheduledInteractions.map(interaction => {
      if (interaction.id === interactionId) {
        return { 
          ...interaction, 
          scheduledDate: newDate,
          status: 'planned' as InteractionStatus,
          ...(reason && { preparationNotes: `Rescheduled: ${reason}` })
        };
      }
      return interaction;
    });

    setScheduledInteractions(updatedInteractions);

    // Update today's interactions
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedTodayInteractions = updatedInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(updatedTodayInteractions);

    toast({
      title: 'Interaction rescheduled',
      description: `Rescheduled to ${format(parseISO(newDate), 'MMM d, yyyy')}.`
    });
  }, [scheduledInteractions, toast]);

  // Helper function to calculate next scheduled date based on frequency
  const calculateNextInteractionDate = (frequency: RelationshipFrequency): string => {
    const today = new Date();
    let nextDate = today;

    if (frequency.categoryDefault && scheduler) {
      // Find the category default
      const relationship = relationships.find(r => r.id === frequency.relationshipId);
      if (relationship) {
        const categoryDefault = scheduler.categoryDefaults.find(cd => cd.category === relationship.category);
        if (categoryDefault) {
          const { unit, value } = categoryDefault.frequency;
          switch (unit) {
            case 'days':
              nextDate = addDays(today, value);
              break;
            case 'weeks':
              nextDate = addDays(today, value * 7);
              break;
            case 'months':
              // Approximate month as 30 days
              nextDate = addDays(today, value * 30);
              break;
          }
        }
      }
    } else if (frequency.customFrequency) {
      // Use custom frequency
      const { unit, value } = frequency.customFrequency;
      switch (unit) {
        case 'days':
          nextDate = addDays(today, value);
          break;
        case 'weeks':
          nextDate = addDays(today, value * 7);
          break;
        case 'months':
          // Approximate month as 30 days
          nextDate = addDays(today, value * 30);
          break;
      }
    }

    return format(nextDate, 'yyyy-MM-dd');
  };

  // Generate new suggested interactions
  const generateInteractions = useCallback(async () => {
    if (!scheduler || !relationships.length) return [];

    const newInteractions = generateSuggestedInteractions(relationships, scheduler);
    setScheduledInteractions(newInteractions);

    // Update today's interactions
    const today = format(new Date(), 'yyyy-MM-dd');
    const todaysInteractions = newInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(todaysInteractions);

    toast({
      title: 'Interaction schedule generated',
      description: 'New suggested interactions have been added to your schedule.'
    });

    return newInteractions;
  }, [scheduler, relationships, toast]);

  // Update schedule settings
  const updateScheduleSettings = useCallback(async (settings: Partial<ConnectionScheduler['scheduleSettings']>) => {
    if (!scheduler) return;

    toast({
      title: 'Settings updated',
      description: 'Your nurturing schedule settings have been updated.'
    });
  }, [scheduler, toast]);

  return {
    scheduledInteractions,
    todayInteractions,
    stats,
    scheduleInteraction,
    updateInteraction,
    completeInteraction,
    skipInteraction,
    rescheduleInteraction,
    generateInteractions: generateInteractions,
    updateScheduleSettings
  };
}
