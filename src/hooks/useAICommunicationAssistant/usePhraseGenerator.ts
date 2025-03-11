
import { supabase } from '@/integrations/supabase/client';
import { GeneratePhrasesParams, CommunicationPhrases, HookHelpers } from './types';

export function usePhraseGenerator({
  setIsLoading,
  setError,
  toast,
  onSuccess,
  onError
}: HookHelpers) {
  
  const generatePhrases = async (params: GeneratePhrasesParams): Promise<CommunicationPhrases> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-communication-profile', {
        body: {
          ...params,
          requestType: 'generate-phrases'
        }
      });

      if (error) throw new Error(error.message);
      
      if (onSuccess) {
        onSuccess(data.phrases);
      }
      
      return data.phrases;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate phrases');
      setError(error);
      
      toast({
        title: 'Failed to generate phrases',
        description: error.message,
        variant: 'destructive',
      });
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { generatePhrases };
}
