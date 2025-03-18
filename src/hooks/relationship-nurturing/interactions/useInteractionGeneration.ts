
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays } from 'date-fns';
import { 
  Relationship,
  ScheduledInteraction,
  ConnectionScheduler
} from '@/types/relationship-nurturing';
import { supabase } from '@/integrations/supabase/client';

export function useInteractionGeneration(
  relationships: Relationship[],
  scheduler: ConnectionScheduler | null,
  setScheduledInteractions: (interactions: ScheduledInteraction[]) => void,
  setTodayInteractions: React.Dispatch<React.SetStateAction<ScheduledInteraction[]>>,
  toast: any
) {
  const generateInteractions = useCallback(async () => {
    if (!scheduler || !relationships.length) return [];

    const newInteractions: ScheduledInteraction[] = [];
    
    for (const relationship of relationships) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-ai-content', {
          body: {
            type: 'meaningful_interaction',
            context: {
              relationship,
              interactionType: relationship.category === 'professional' ? 'professional' : 'casual'
            }
          }
        });

        if (error) throw error;

        if (data?.content) {
          const today = new Date();
          const daysToAdd = relationship.importance > 4 ? 3 : relationship.importance < 2 ? 14 : 7;
          
          const newInteraction: ScheduledInteraction = {
            id: uuidv4(),
            relationshipId: relationship.id,
            relationshipName: relationship.name,
            scheduledDate: format(addDays(today, daysToAdd), 'yyyy-MM-dd'),
            suggestedTimeSlots: ['10:00', '14:00', '18:00'],
            interactionType: relationship.category === 'professional' ? 'call' : 'message',
            duration: relationship.category === 'professional' ? 30 : 15,
            purpose: data.content,
            preparationNeeded: relationship.importance > 3,
            preparationNotes: `AI-generated suggestion based on relationship context`,
            status: 'planned',
            energyCost: relationship.importance * 2
          };
          
          newInteractions.push(newInteraction);
        }
      } catch (error) {
        console.error(`Error generating interaction for ${relationship.name}:`, error);
      }
    }
    
    setScheduledInteractions(newInteractions);

    const today = format(new Date(), 'yyyy-MM-dd');
    const todaysInteractions = newInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(todaysInteractions);

    toast({
      title: 'Interaction schedule generated',
      description: 'New AI-suggested interactions have been added to your schedule.'
    });

    return newInteractions;
  }, [relationships, scheduler, setScheduledInteractions, setTodayInteractions, toast]);

  return { generateInteractions };
}
