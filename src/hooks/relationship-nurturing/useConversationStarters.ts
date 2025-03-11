
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Relationship,
  IntelligentConversationStarter
} from '@/types/relationship-nurturing';
import { supabase } from '@/integrations/supabase/client';

export function useConversationStarters(
  relationships: Relationship[],
  conversationStarters: IntelligentConversationStarter[],
  isAuthenticated: boolean,
  batteryLevel: number,
  toast: any,
  setConversationStarters?: (starters: IntelligentConversationStarter[]) => void
) {
  // Generate more conversation starters - uses Supabase Edge Function
  const generateMoreConversationStarters = useCallback(async (relationshipId: string) => {
    if (!setConversationStarters) return;
    
    try {
      const relationship = relationships.find(r => r.id === relationshipId);
      if (!relationship) {
        return;
      }
      
      if (isAuthenticated) {
        // Use Supabase Edge Function to generate starters
        const { data, error } = await supabase.functions.invoke('generate-conversation-starters', {
          body: { 
            relationshipId,
            relationshipName: relationship.name,
            interests: relationship.interests,
            pastTopics: relationship.conversationTopics.map(t => t.topic),
            batteryLevel
          }
        });
        
        if (error) throw error;
        
        if (data && data.starters && data.starters.length > 0) {
          // Save the generated starters to Supabase
          const newStarters = data.starters.map((starter: any) => ({
            relationship_id: relationshipId, 
            topic: starter.topic,
            starter: starter.content,
            context: starter.context,
            confidence_score: Math.random() * 0.3 + 0.7, // Random high score for demo
            source: starter.source || 'interest',
            user_id: (await supabase.auth.getUser()).data.user?.id
          }));
          
          const { data: insertedData, error: insertError } = await supabase
            .from('intelligent_conversation_starters')
            .insert(newStarters)
            .select();
            
          if (insertError) throw insertError;
          
          // Add new starters to state
          const mappedStarters = insertedData.map(s => ({
            id: s.id,
            relationshipId: s.relationship_id,
            topic: s.topic,
            starter: s.starter,
            context: s.context,
            confidenceScore: s.confidence_score,
            source: s.source
          })) as IntelligentConversationStarter[];
          
          setConversationStarters([...conversationStarters, ...mappedStarters]);
          
          toast({
            title: 'New conversation starters generated',
            description: `${mappedStarters.length} new starters created for ${relationship.name}.`
          });
        } else {
          throw new Error('No starters were generated');
        }
      } else {
        // Use mock generation in non-authenticated mode
        setTimeout(() => {
          // Create a mock new starter
          const newStarter: IntelligentConversationStarter = {
            id: uuidv4(),
            relationshipId,
            topic: 'Recent local events',
            starter: `I just heard about that new ${relationship.interests[0]} event happening next weekend. Have you seen anything about it?`,
            context: `Based on shared interest in ${relationship.interests[0]}`,
            confidenceScore: 0.87,
            source: 'interest'
          };
          
          setConversationStarters([...conversationStarters, newStarter]);
          
          toast({
            title: 'New conversation starter generated',
            description: 'AI has generated a new conversation starter based on shared interests.'
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Error generating conversation starters:', error);
      toast({
        title: 'Generation failed',
        description: 'Could not generate new conversation starters. Please try again.',
        variant: 'destructive'
      });
    }
  }, [relationships, conversationStarters, isAuthenticated, batteryLevel, setConversationStarters, toast]);
  
  // Copy conversation starter to clipboard
  const copyConversationStarter = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: 'Copied to clipboard',
      description: 'The conversation starter has been copied to your clipboard.'
    });
  }, [toast]);

  return {
    generateMoreConversationStarters,
    copyConversationStarter
  };
}
