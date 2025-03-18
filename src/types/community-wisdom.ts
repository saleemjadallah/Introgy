
export type WisdomCategory = 
  | 'practical-strategies'
  | 'personal-insights'
  | 'success-stories'
  | 'coping-techniques'
  | 'resources';

export type SituationType = 
  | 'work'
  | 'social'
  | 'family'
  | 'education'
  | 'daily-life'
  | 'other';

export type EnergyLevel = 'low' | 'medium' | 'high';

export interface WisdomItem {
  id: string;
  content: string;
  category: WisdomCategory;
  situation: SituationType;
  energyLevel: EnergyLevel;
  tags: string[];
  helpfulCount: number;
  comments: WisdomComment[];
  dateSubmitted: string;
  implementation?: {
    tried: boolean;
    effectiveness?: 'low' | 'medium' | 'high';
    personalNotes?: string;
  };
}

export interface WisdomComment {
  id: string;
  text: string;
  dateSubmitted: string;
}

export interface WisdomFilter {
  categories: WisdomCategory[];
  situations: SituationType[];
  energyLevels: EnergyLevel[];
  searchTerm: string;
}
