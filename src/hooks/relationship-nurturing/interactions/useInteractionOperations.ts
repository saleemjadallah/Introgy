
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO } from 'date-fns';
import { 
  ScheduledInteraction,
  InteractionStatus
} from '@/types/relationship-nurturing';

export function useInteractionOperations(
  scheduledInteractions: ScheduledInteraction[],
  setScheduledInteractions: (interactions: ScheduledInteraction[]) => void,
  setTodayInteractions: (interactions: ScheduledInteraction[]) => void,
  toast: any
) {
  const scheduleInteraction = useCallback(async (interaction: Omit<ScheduledInteraction, 'id'>) => {
    const newInteraction: ScheduledInteraction = {
      ...interaction,
      id: uuidv4()
    };

    const updatedInteractions = [...scheduledInteractions, newInteraction];
    setScheduledInteractions(updatedInteractions);

    if (newInteraction.scheduledDate === format(new Date(), 'yyyy-MM-dd')) {
      setTodayInteractions(prevInteractions => [...prevInteractions, newInteraction]);
    }

    toast({
      title: 'Interaction scheduled',
      description: `Scheduled to connect with ${newInteraction.relationshipName} on ${format(parseISO(newInteraction.scheduledDate), 'MMM d, yyyy')}.`
    });

    return newInteraction;
  }, [scheduledInteractions, setScheduledInteractions, setTodayInteractions, toast]);

  const updateInteraction = useCallback(async (interactionId: string, updates: Partial<ScheduledInteraction>) => {
    const updatedInteractions = scheduledInteractions.map(interaction => {
      if (interaction.id === interactionId) {
        return { ...interaction, ...updates };
      }
      return interaction;
    });

    setScheduledInteractions(updatedInteractions);

    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedTodayInteractions = updatedInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(updatedTodayInteractions);

    toast({
      title: 'Interaction updated',
      description: 'Your scheduled interaction has been updated.'
    });
  }, [scheduledInteractions, setScheduledInteractions, setTodayInteractions, toast]);

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

    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedTodayInteractions = updatedInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(updatedTodayInteractions);

    toast({
      title: 'Interaction completed',
      description: 'Your interaction has been marked as completed.'
    });
  }, [scheduledInteractions, setScheduledInteractions, setTodayInteractions, toast]);

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

    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedTodayInteractions = updatedInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(updatedTodayInteractions);

    toast({
      title: 'Interaction skipped',
      description: reason || 'Your interaction has been skipped.'
    });
  }, [scheduledInteractions, setScheduledInteractions, setTodayInteractions, toast]);

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

    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedTodayInteractions = updatedInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(updatedTodayInteractions);

    toast({
      title: 'Interaction rescheduled',
      description: `Rescheduled to ${format(parseISO(newDate), 'MMM d, yyyy')}.`
    });
  }, [scheduledInteractions, setScheduledInteractions, setTodayInteractions, toast]);

  const updateScheduleSettings = useCallback(async (settings: any) => {
    toast({
      title: 'Settings updated',
      description: 'Your nurturing schedule settings have been updated.'
    });
  }, [toast]);

  return {
    scheduleInteraction,
    updateInteraction,
    completeInteraction,
    skipInteraction,
    rescheduleInteraction,
    updateScheduleSettings
  };
}
