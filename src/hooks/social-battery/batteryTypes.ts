
import type { SleepQuality } from "@/components/social-battery/SleepQualityDialog";
import { RechargeActivity, DepletingActivity } from "@/types/activity";

export interface BatteryHistoryEntry {
  date: Date;
  level: number;
}

export interface SocialActivity {
  type: "recharge" | "depletion";
  name: string;
  energyImpact: number;
  date: Date;
  duration?: number;
  notes?: string;
  source?: string;
  description?: string;
}

export interface UseSocialBatteryReturn {
  batteryLevel: number;
  batteryHistory: BatteryHistoryEntry[];
  handleSliderChange: (value: number[]) => void;
  handleActivitySelect: (activity: RechargeActivity | DepletingActivity) => void;
  addActivity: (activity: SocialActivity) => RechargeActivity | DepletingActivity;
  recordSleepQuality: (quality: SleepQuality) => void;
  checkScheduledEvents: () => void;
}
