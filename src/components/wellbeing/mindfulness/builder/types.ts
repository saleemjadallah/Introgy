
export interface PracticeRequest {
  duration: number;
  focusAreas: string[];
  situationType: string;
  situationDetails: string;
  goalStatement: string;
  preferredElements: string[];
}

export interface GeneratedPracticeSegment {
  type: string;
  content: string;
  duration: number;
}

export const focusAreaOptions = [
  "Social Recovery", 
  "Energy Conservation", 
  "Quiet Strength", 
  "Preparation", 
  "Deep Focus",
  "Self-Acceptance",
  "Stress Reduction",
  "Emotional Regulation"
];

export const situationTypeOptions = [
  "Before Social Event",
  "After Social Interaction",
  "During Workday",
  "Morning Routine",
  "Evening Wind-down",
  "Conflict Recovery",
  "Energy Depletion",
  "Decision Making",
  "Creative Block",
  "Other"
];

export const techniqueOptions = [
  "Breathing Techniques",
  "Body Scan",
  "Visualization",
  "Guided Imagery",
  "Progressive Relaxation",
  "Loving-Kindness",
  "Mindful Movement",
  "Sound Meditation",
  "Grounding Exercises",
  "Self-Compassion Practice"
];
