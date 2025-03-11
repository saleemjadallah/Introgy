
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays } from 'date-fns';
import { 
  RelationshipInsight,
  ConnectionSuggestion,
  InteractionType
} from '@/types/relationship-nurturing';
import { supabase } from '@/integrations/supabase/client';

export function useInsightsManagement(
  insights: RelationshipInsight[],
  connectionSuggestions: ConnectionSuggestion[],
  isAuthenticated: boolean,
  toast: any,
  setInsights?: (insights: RelationshipInsight[]) => void,
  setConnectionSuggestions?: (suggestions: ConnectionSuggestion[]) => void,
) {
  // Mark an insight as read (not new)
  const markInsightAsRead = useCallback(async (insightId: string) => {
    if (!setInsights) return;
    
    const updatedInsights = insights.map(insight => 
      insight.id === insightId ? { ...insight, isNew: false } : insight
    );
    
    setInsights(updatedInsights);
    
    // If authenticated, update in Supabase
    if (isAuthenticated) {
      try {
        const { error } = await supabase
          .from('relationship_insights')
          .update({ is_new: false })
          .eq('id', insightId);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error updating insight:', error);
        toast({
          title: 'Update failed',
          description: 'There was an issue updating the insight status.',
          variant: 'destructive'
        });
      }
    }
  }, [insights, isAuthenticated, setInsights, toast]);

  // Mark all insights as read
  const markAllInsightsAsRead = useCallback(async () => {
    if (!setInsights) return;
    
    const updatedInsights = insights.map(insight => ({ ...insight, isNew: false }));
    setInsights(updatedInsights);
    
    // If authenticated, update in Supabase
    if (isAuthenticated) {
      try {
        // Get all the insight IDs that are currently new
        const insightIds = insights
          .filter(insight => insight.isNew)
          .map(insight => insight.id);
          
        if (insightIds.length > 0) {
          const { error } = await supabase
            .from('relationship_insights')
            .update({ is_new: false })
            .in('id', insightIds);
            
          if (error) throw error;
        }
      } catch (error) {
        console.error('Error updating insights:', error);
        toast({
          title: 'Update failed',
          description: 'There was an issue updating the insight statuses.',
          variant: 'destructive'
        });
      }
    }
    
    toast({
      title: 'All insights marked as read',
      description: 'Your relationship insights have been marked as read.'
    });
  }, [insights, isAuthenticated, setInsights, toast]);
  
  // Take action on an insight
  const takeActionOnInsight = useCallback(async (insightId: string) => {
    if (!setConnectionSuggestions) return;
    
    const insight = insights.find(i => i.id === insightId);
    if (!insight) return;
    
    // Mark the insight as read
    await markInsightAsRead(insightId);
    
    // Different actions based on insight type
    switch (insight.type) {
      case 'connection_gap':
        // Create a suggestion from this insight
        const newSuggestion: ConnectionSuggestion = {
          id: uuidv4(),
          relationshipId: insight.relationshipId,
          relationshipName: insight.relationshipName,
          suggested: true,
          suggestedDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
          suggestedTime: '18:30',
          interactionType: 'call' as InteractionType,
          reasonForSuggestion: insight.recommendation,
          energyLevelRequired: 4,
          priority: 3,
          expectedResponse: 'fast'
        };
        
        if (isAuthenticated) {
          try {
            // Save to Supabase
            const { data, error } = await supabase
              .from('connection_suggestions')
              .insert({
                relationship_id: insight.relationshipId,
                relationship_name: insight.relationshipName,
                suggested: true,
                suggested_date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
                suggested_time: '18:30',
                interaction_type: 'call',
                reason_for_suggestion: insight.recommendation,
                energy_level_required: 4,
                priority: '3', // String format for enum
                expected_response: 'fast', // String format for enum
                user_id: (await supabase.auth.getUser()).data.user?.id
              });
              
            if (error) throw error;
            
            // If data exists, use it, otherwise use the new suggestion
            const convertedSuggestion = newSuggestion;
            setConnectionSuggestions([...connectionSuggestions, convertedSuggestion]);
          } catch (error) {
            console.error('Error creating suggestion:', error);
            // Add to local state anyway for a better UX
            setConnectionSuggestions([...connectionSuggestions, newSuggestion]);
          }
        } else {
          // Just add to local state
          setConnectionSuggestions([...connectionSuggestions, newSuggestion]);
        }
        
        toast({
          title: 'Action taken',
          description: 'Converted the insight into a connection suggestion.'
        });
        break;
        
      case 'interaction_pattern':
      case 'energy_impact':
      case 'conversation_suggestion':
      case 'relationship_health':
      default:
        // For other insight types, just mark as read for now
        toast({
          title: 'Insight noted',
          description: 'The insight has been marked as read.'
        });
        break;
    }
  }, [insights, connectionSuggestions, markInsightAsRead, isAuthenticated, setConnectionSuggestions, toast]);

  return {
    markInsightAsRead,
    markAllInsightsAsRead,
    takeActionOnInsight
  };
}
