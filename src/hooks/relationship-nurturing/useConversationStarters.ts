
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
  const generateMoreConversationStarters = useCallback(async (relationshipId: string) => {
    if (!setConversationStarters) return;
    
    try {
      const relationship = relationships.find(r => r.id === relationshipId);
      if (!relationship) return;
      
      if (isAuthenticated) {
        // Call our AI content generation edge function
        const { data, error } = await supabase.functions.invoke('generate-ai-content', {
          body: { 
            type: 'conversation_starters',
            context: {
              relationshipId,
              relationshipName: relationship.name,
              interests: relationship.interests,
              pastTopics: relationship.conversationTopics.map(t => t.topic),
              batteryLevel
            }
          }
        });
        
        if (error) throw error;
        
        if (data?.content && Array.isArray(data.content)) {
          // Get the current user ID
          const { data: userData } = await supabase.auth.getUser();
          const userId = userData.user?.id;
          
          // Map the AI-generated starters to our database format
          const newStarters = data.content.map(starter => ({
            relationship_id: relationshipId,
            topic: starter.topic,
            starter: starter.content,
            context: starter.context,
            confidence_score: 0.85,
            source: starter.source || 'interest',
            user_id: userId || ''
          }));
          
          // Save to database
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
            description: `${mappedStarters.length} new starters created for ${relationship.name}`
          });
        }
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
