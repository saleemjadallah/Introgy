
// Define common type for activities
export interface BaseActivity {
  id: number;
  name: string;
  duration: number;
  isCustom?: boolean;
  description?: string; // Add optional description field
}

// Type for recharging activities
export interface RechargeActivity extends BaseActivity {
  energyGain: number;
}

// Type for depleting activities
export interface DepletingActivity extends BaseActivity {
  energyLoss: number;
}

// Type guard to check if an activity is a recharge activity
export const isRechargeActivity = (activity: RechargeActivity | DepletingActivity): activity is RechargeActivity => {
  return 'energyGain' in activity;
};

// Mock data for recharge activities
export const rechargeActivities: RechargeActivity[] = [
  { id: 1, name: "Read a book", duration: 30, energyGain: 15 },
  { id: 2, name: "Take a walk alone", duration: 20, energyGain: 10 },
  { id: 3, name: "Listen to calming music", duration: 15, energyGain: 8 },
  { id: 4, name: "Meditate", duration: 10, energyGain: 12 },
  { id: 5, name: "Make a cup of tea", duration: 5, energyGain: 5 },
  // New recharge activities
  { id: 6, name: "Journal or creative writing", duration: 25, energyGain: 13, description: "Expressive writing provides mental clarity and emotional processing" },
  { id: 7, name: "Hot bath or shower", duration: 20, energyGain: 11, description: "Warmth and isolation create a perfect recharge environment" },
  { id: 8, name: "Nature observation", duration: 30, energyGain: 15, description: "Bird watching, cloud gazing, or sitting by water" },
  { id: 9, name: "Crafting or hands-on hobby", duration: 45, energyGain: 18, description: "Knitting, woodworking, painting, or any focused creative activity" },
  { id: 10, name: "Watch a favorite show alone", duration: 40, energyGain: 14, description: "Comfortable, predictable entertainment without social demands" },
  { id: 11, name: "Play with a pet", duration: 15, energyGain: 9, description: "Companionship without human social complexity" },
  { id: 12, name: "Gardening or plant care", duration: 30, energyGain: 13, description: "Connecting with nature in a structured, nurturing way" },
  { id: 13, name: "Listen to a podcast or audiobook", duration: 30, energyGain: 12, description: "Engaging content without visual overstimulation" },
  { id: 14, name: "Cook or bake something", duration: 40, energyGain: 16, description: "Creative, sensory engagement with tangible results" },
  { id: 15, name: "Technology-free quiet time", duration: 25, energyGain: 14, description: "Deliberate disconnection from digital stimulation" },
  { id: 16, name: "Star gazing", duration: 20, energyGain: 10, description: "Perspective-shifting, peaceful nighttime activity" },
  { id: 17, name: "Organize a small space", duration: 15, energyGain: 8, description: "Creating order reduces mental load" },
  { id: 18, name: "Deep breathing exercises", duration: 5, energyGain: 6, description: "Quick but effective reset for overwhelm" },
  { id: 19, name: "Stretch or gentle yoga", duration: 15, energyGain: 9, description: "Physical release of tension without exertion" },
  { id: 20, name: "Browse a bookstore or library alone", duration: 45, energyGain: 17, description: "Quiet exploration in a low-pressure social environment" },
];

// Mock data for depleting activities
export const depletingActivities: DepletingActivity[] = [
  { id: 1, name: "Team meeting", duration: 60, energyLoss: 20 },
  { id: 2, name: "Social gathering", duration: 120, energyLoss: 35 },
  { id: 3, name: "Phone call", duration: 15, energyLoss: 10 },
  { id: 4, name: "Video conference", duration: 45, energyLoss: 25 },
  { id: 5, name: "Shopping in crowded store", duration: 30, energyLoss: 15 },
  // New depleting activities
  { id: 6, name: "Networking event", duration: 90, energyLoss: 40, description: "High energy cost due to meeting many new people" },
  { id: 7, name: "Public speaking", duration: 30, energyLoss: 45, description: "Short duration but intense energy drain" },
  { id: 8, name: "Family reunion", duration: 180, energyLoss: 50, description: "Extended social interaction with multiple conversations" },
  { id: 9, name: "Job interview", duration: 60, energyLoss: 30, description: "High stakes social evaluation" },
  { id: 10, name: "Group brainstorming session", duration: 60, energyLoss: 25, description: "Requires active participation and thinking on the spot" },
  { id: 11, name: "Dinner party", duration: 150, energyLoss: 35, description: "Extended social small talk and interaction" },
  { id: 12, name: "Crowded concert/event", duration: 120, energyLoss: 30, description: "Sensory overload plus social interaction" },
  { id: 13, name: "Parent-teacher meeting", duration: 30, energyLoss: 20, description: "Formal social interaction" },
  { id: 14, name: "Small talk with neighbor", duration: 15, energyLoss: 15, description: "Brief but unplanned interaction" },
  { id: 15, name: "Large restaurant with friends", duration: 90, energyLoss: 25, description: "Managing conversation in noisy environment" },
  { id: 16, name: "Customer service interaction", duration: 20, energyLoss: 15, description: "Explaining needs to strangers" },
  { id: 17, name: "Social media engagement", duration: 30, energyLoss: 10, description: "Digital social interaction" },
  { id: 18, name: "Birthday party (as guest)", duration: 120, energyLoss: 30, description: "Social obligation with varied interactions" },
  { id: 19, name: "Birthday party (as focus)", duration: 180, energyLoss: 50, description: "Being center of attention" },
  { id: 20, name: "Open office workday", duration: 480, energyLoss: 40, description: "Long-duration ambient social exposure" },
];

// Storage keys
export const CUSTOM_RECHARGE_ACTIVITIES_KEY = "customRechargeActivities";
export const CUSTOM_DEPLETING_ACTIVITIES_KEY = "customDepletingActivities";

// Helper functions to get stored custom activities
export const getStoredCustomActivities = <T extends RechargeActivity | DepletingActivity>(key: string): T[] => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

// Helper functions to save custom activities
export const saveCustomActivities = <T extends RechargeActivity | DepletingActivity>(key: string, activities: T[]): void => {
  localStorage.setItem(key, JSON.stringify(activities));
};

// Get the next available ID for a custom activity
export const getNextCustomActivityId = (activities: BaseActivity[]): number => {
  return activities.length > 0 
    ? Math.max(...activities.map(a => a.id)) + 1 
    : 1;
};
