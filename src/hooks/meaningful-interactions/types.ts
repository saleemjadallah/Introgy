
import { 
  DeepQuestion, 
  MessageTemplate, 
  ConnectionRitual,
  SharedExperience,
  MessageVariable
} from '@/types/meaningful-interactions';

export interface UseMeaningfulInteractionsProps {
  initialQuestions?: DeepQuestion[];
  initialTemplates?: MessageTemplate[];
  initialRituals?: ConnectionRitual[];
  initialExperiences?: SharedExperience[];
}

export interface MeaningfulInteractionFilters {
  categories?: string[];
  depthLevels?: number[];
  relationshipTypes?: string[];
  energyLevels?: number[];
  topics?: string[];
  searchTerm?: string;
}
