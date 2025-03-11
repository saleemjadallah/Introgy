
import { supabase } from '@/integrations/supabase/client';
import { EnhanceProfileParams, HookHelpers } from './types';

export function useProfileEnhancer({
  setIsLoading,
  setError,
  toast,
  onSuccess,
  onError
}: HookHelpers) {
  
  const enhanceProfile = async (params: EnhanceProfileParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-communication-profile', {
        body: {
          ...params,
          requestType: 'enhance-profile'
        }
      });

      if (error) throw new Error(error.message);
      
      if (onSuccess) {
        onSuccess(data.enhancements);
      }
      
      return data.enhancements;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to enhance profile');
      setError(error);
      
      toast({
        title: 'Failed to enhance profile',
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

  return { enhanceProfile };
}
