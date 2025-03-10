
export interface MindfulnessPractice {
  id: string;
  title: string;
  category: MindfulnessCategory;
  subcategory: string;
  duration: number; // In minutes
  description: string;
  script: string; // The full meditation script
  audioUrl?: string; // Optional, for pre-recorded versions
  imageUrl?: string; // Optional theme image
  tags: string[];
  energyImpact: number; // -5 to +5 scale (negative = calming, positive = energizing)
  expertReviewed: boolean;
}

export type MindfulnessCategory = 
  | "Social Recovery" 
  | "Energy Conservation" 
  | "Quiet Strength" 
  | "Preparation" 
  | "Deep Focus";

export interface PracticeFilterOptions {
  category?: MindfulnessCategory;
  maxDuration?: number;
  tags?: string[];
  energyLevel?: number;
}
