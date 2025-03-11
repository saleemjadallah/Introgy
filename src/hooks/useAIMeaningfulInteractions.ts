
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DeepQuestion, MessageTemplate, ConnectionRitual, SharedExperience } from '@/types/meaningful-interactions';

export function useAIMeaningfulInteractions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const generateInteraction = async (type: string, context: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-meaningful-interactions', {
        body: { type, context }
      });

      if (error) throw error;

      // Store in Supabase
      const { error: dbError } = await supabase
        .from('meaningful_interactions')
        .insert({
          type,
          title: context,
          content: data
        });

      if (dbError) throw dbError;

      toast({
        title: "Generated Successfully",
        description: "New meaningful interaction has been created.",
      });

      return data;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate interaction';
      setError(new Error(message));
      
      toast({
        title: "Generation Failed",
        description: message,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStoredInteractions = async () => {
    try {
      const { data, error } = await supabase
        .from('meaningful_interactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch interactions';
      setError(new Error(message));
      return [];
    }
  };

  return {
    generateInteraction,
    fetchStoredInteractions,
    isLoading,
    error
  };
}
