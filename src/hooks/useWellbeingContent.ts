
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useWellbeingContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const generateContent = async (contentType: 'glossary' | 'mythbuster' | 'famous', query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-wellbeing-content', {
        body: { contentType, query }
      });

      if (error) throw error;

      toast({
        title: "Content Generated",
        description: "AI-powered content has been created.",
      });

      return data.content;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate content';
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

  return {
    generateContent,
    isLoading,
    error
  };
}
