
import { toast } from "sonner";
import { SLEEP_QUALITY_ADJUSTMENTS } from "./batteryUtils";
import type { SleepQuality } from "@/components/social-battery/SleepQualityDialog";
import { RechargeActivity } from "@/types/activity";

export function useSleepQuality(
  batteryLevel: number,
  setBatteryLevel: (level: number) => void,
  addHistoryEntry: (level: number) => void
) {
  const recordSleepQuality = (quality: SleepQuality) => {
    const adjustment = SLEEP_QUALITY_ADJUSTMENTS[quality];
    const sleepActivityName = `${quality.charAt(0).toUpperCase() + quality.slice(1)} Sleep`;
    
    // Apply the adjustment to the battery level
    const newLevel = Math.max(0, Math.min(100, batteryLevel + adjustment));
    setBatteryLevel(newLevel);
    
    // Create a sleep quality activity for the history
    const sleepActivity = {
      id: Date.now(),
      name: sleepActivityName,
      duration: 480, // 8 hours in minutes
      energyGain: adjustment,
      isCustom: true
    } as RechargeActivity;
    
    // Add to battery history
    addHistoryEntry(newLevel);
    
    // Show toast notification
    if (adjustment > 0) {
      toast.success(`Battery recharged by ${adjustment}%`, {
        description: `${sleepActivityName} has restored your social energy`,
      });
    } else {
      toast.warning(`Battery reduced by ${Math.abs(adjustment)}%`, {
        description: `${sleepActivityName} has depleted your social energy`,
      });
    }
    
    // Record the sleep quality in local storage for analytics or future reference
    const sleepHistory = JSON.parse(localStorage.getItem("sleepQualityHistory") || "[]");
    sleepHistory.push({
      date: new Date().toISOString(),
      quality,
      batteryAdjustment: adjustment
    });
    localStorage.setItem("sleepQualityHistory", JSON.stringify(sleepHistory));
  };

  return { recordSleepQuality };
}
