
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CommunicationProfile } from '@/types/communication-preferences';

interface AICommunicationAssistantOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface GenerateProfileParams {
  communicationStyle?: string;
  socialPreferences?: string;
  energyLevels?: string;
  situationContext?: string;
}

interface EnhanceProfileParams {
  existingProfile: Partial<CommunicationProfile>;
  situationContext?: string;
}

interface GeneratePhrasesParams {
  existingProfile?: Partial<CommunicationProfile>;
  communicationStyle?: string;
  situationContext?: string;
}

interface CommunicationPhrases {
  introductions: string[];
  boundaries: string[];
  exitStrategies: string[];
  followUps: string[];
  explanation: string;
}

export function useAICommunicationAssistant(options?: AICommunicationAssistantOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

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
      
      if (options?.onSuccess) {
        options.onSuccess(data.profile);
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
      
      if (options?.onError) {
        options.onError(error);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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
      
      if (options?.onSuccess) {
        options.onSuccess(data.enhancements);
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
      
      if (options?.onError) {
        options.onError(error);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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
      
      if (options?.onSuccess) {
        options.onSuccess(data.phrases);
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
      
      if (options?.onError) {
        options.onError(error);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateProfile,
    enhanceProfile,
    generatePhrases,
    isLoading,
    error
  };
}
