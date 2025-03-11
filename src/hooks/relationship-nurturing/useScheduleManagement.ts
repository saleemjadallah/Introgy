
import { useCallback } from 'react';
import { 
  ConnectionSuggestion,
  ScheduledInteraction,
  InteractionType
} from '@/types/relationship-nurturing';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

export function useScheduleManagement(
  connectionSuggestions: ConnectionSuggestion[],
  scheduleInteraction: (interaction: Omit<ScheduledInteraction, 'id'>) => Promise<ScheduledInteraction>,
  isAuthenticated: boolean,
  toast: any,
  setConnectionSuggestions?: (suggestions: ConnectionSuggestion[]) => void
) {
  // Apply a suggested connection
  const applySuggestion = useCallback(async (suggestionId: string) => {
    if (!setConnectionSuggestions) return;
    
    const suggestion = connectionSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;
    
    // Create an interaction from the suggestion
    const interaction: Omit<ScheduledInteraction, 'id'> = {
      relationshipId: suggestion.relationshipId,
      relationshipName: suggestion.relationshipName,
      scheduledDate: suggestion.suggestedDate,
      suggestedTimeSlots: [suggestion.suggestedTime],
      interactionType: suggestion.interactionType as InteractionType,
      duration: 
        suggestion.interactionType === 'meet' ? 90 : 
        suggestion.interactionType === 'call' ? 30 : 
        suggestion.interactionType === 'video' ? 45 : 15,
      purpose: "AI-suggested connection",
      preparationNeeded: suggestion.energyLevelRequired > 3,
      preparationNotes: suggestion.reasonForSuggestion,
      status: 'planned',
      energyCost: suggestion.energyLevelRequired
    };
    
    // Schedule the interaction
    await scheduleInteraction(interaction);
    
    // Remove the suggestion
    const updatedSuggestions = connectionSuggestions.filter(s => s.id !== suggestionId);
    setConnectionSuggestions(updatedSuggestions);
    
    // If authenticated, update in Supabase
    if (isAuthenticated) {
      try {
        const { error } = await supabase
          .from('connection_suggestions')
          .delete()
          .eq('id', suggestionId);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting suggestion:', error);
        // Toast message already shown by scheduleInteraction
      }
    }
  }, [connectionSuggestions, scheduleInteraction, setConnectionSuggestions, isAuthenticated, toast]);
  
  // Skip a suggested connection
  const skipSuggestion = useCallback(async (suggestionId: string) => {
    if (!setConnectionSuggestions) return;
    
    // Remove the suggestion
    const updatedSuggestions = connectionSuggestions.filter(s => s.id !== suggestionId);
    setConnectionSuggestions(updatedSuggestions);
    
    // If authenticated, update in Supabase
    if (isAuthenticated) {
      try {
        const { error } = await supabase
          .from('connection_suggestions')
          .delete()
          .eq('id', suggestionId);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting suggestion:', error);
        toast({
          title: 'Update failed',
          description: 'There was an issue removing the suggestion.',
          variant: 'destructive'
        });
      }
    }
    
    toast({
      title: 'Suggestion skipped',
      description: 'The connection suggestion has been removed.'
    });
  }, [connectionSuggestions, setConnectionSuggestions, isAuthenticated, toast]);

  return {
    applySuggestion,
    skipSuggestion
  };
}
