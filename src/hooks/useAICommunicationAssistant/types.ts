
import { CommunicationProfile } from '@/types/communication-preferences';

export interface GenerateProfileParams {
  communicationStyle?: string;
  socialPreferences?: string;
  energyLevels?: string;
  situationContext?: string;
}

export interface EnhanceProfileParams {
  existingProfile: Partial<CommunicationProfile>;
  situationContext?: string;
}

export interface GeneratePhrasesParams {
  existingProfile?: Partial<CommunicationProfile>;
  communicationStyle?: string;
  situationContext?: string;
}

export interface CommunicationPhrases {
  introductions: string[];
  boundaries: string[];
  exitStrategies: string[];
  followUps: string[];
  explanation: string;
}

export interface HookHelpers {
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  toast: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}
