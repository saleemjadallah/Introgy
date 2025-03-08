
import { toast } from "sonner";
import { RechargeActivity, DepletingActivity, isRechargeActivity } from "@/types/activity";
import type { SocialActivity } from "./batteryTypes";

export function useActivityManagement(
  batteryLevel: number,
  setBatteryLevel: (level: number) => void
) {
  const handleActivitySelect = (activity: RechargeActivity | DepletingActivity) => {
    let energyChange: number;
    let isRecharge: boolean;
    
    if (isRechargeActivity(activity)) {
      energyChange = activity.energyGain;
      isRecharge = true;
    } else {
      energyChange = activity.energyLoss;
      isRecharge = false;
    }
    
    const newLevel = isRecharge 
      ? Math.min(100, batteryLevel + energyChange) 
      : Math.max(0, batteryLevel - energyChange);
    
    setBatteryLevel(newLevel);
    
    toast(
      isRecharge 
        ? `Battery recharged by ${energyChange}%` 
        : `Battery depleted by ${energyChange}%`,
      {
        description: `${activity.name} (${activity.duration} min)`,
      }
    );
  };

  // Method to handle social activities
  const addActivity = (activity: SocialActivity) => {
    const isRecharge = activity.type === "recharge";
    const energyChange = activity.energyImpact;
    
    // Create a custom activity compatible with handleActivitySelect
    const customActivity = isRecharge 
      ? {
          id: Date.now(),
          name: activity.name,
          duration: activity.duration || 60,
          energyGain: energyChange,
          isCustom: true
        } as RechargeActivity
      : {
          id: Date.now(),
          name: activity.name,
          duration: activity.duration || 60,
          energyLoss: energyChange,
          isCustom: true
        } as DepletingActivity;
    
    // Use the existing handleActivitySelect
    handleActivitySelect(customActivity);
    
    return customActivity;
  };

  return {
    handleActivitySelect,
    addActivity
  };
}
