
import { supabase } from '@/integrations/supabase/client';
import { GenerateProfileParams, HookHelpers } from './types';

export function useProfileGenerator({
  setIsLoading,
  setError,
  toast,
  onSuccess,
  onError
}: HookHelpers) {
  
  const generateProfile = async (params: GenerateProfileParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-communication-profile', {
        body: {
          ...params,
          requestType: 'generate-profile'
        }
      });

      if (error) throw new Error(error.message);
      
      if (onSuccess) {
        onSuccess(data.profile);
      }
      
      return data.profile;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate profile');
      setError(error);
      
      toast({
        title: 'Failed to generate profile',
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

  return { generateProfile };
}
