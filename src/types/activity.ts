
// Define common type for activities
export interface BaseActivity {
  id: number;
  name: string;
  duration: number;
  isCustom?: boolean;
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
];

// Mock data for depleting activities
export const depletingActivities: DepletingActivity[] = [
  { id: 1, name: "Team meeting", duration: 60, energyLoss: 20 },
  { id: 2, name: "Social gathering", duration: 120, energyLoss: 35 },
  { id: 3, name: "Phone call", duration: 15, energyLoss: 10 },
  { id: 4, name: "Video conference", duration: 45, energyLoss: 25 },
  { id: 5, name: "Shopping in crowded store", duration: 30, energyLoss: 15 },
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
