
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useProfileGenerator } from './useProfileGenerator';
import { useProfileEnhancer } from './useProfileEnhancer';
import { usePhraseGenerator } from './usePhraseGenerator';

export function useAICommunicationAssistant(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const { generateProfile } = useProfileGenerator({
    setIsLoading,
    setError,
    toast,
    onSuccess: options?.onSuccess,
    onError: options?.onError
  });

  const { enhanceProfile } = useProfileEnhancer({
    setIsLoading,
    setError,
    toast,
    onSuccess: options?.onSuccess,
    onError: options?.onError
  });

  const { generatePhrases } = usePhraseGenerator({
    setIsLoading,
    setError,
    toast,
    onSuccess: options?.onSuccess,
    onError: options?.onError
  });

  return {
    generateProfile,
    enhanceProfile,
    generatePhrases,
    isLoading,
    error
  };
}

// Re-export types
export type { 
  GenerateProfileParams,
  EnhanceProfileParams, 
  GeneratePhrasesParams,
  CommunicationPhrases 
} from './types';
