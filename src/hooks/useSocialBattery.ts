
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RechargeActivity, DepletingActivity, isRechargeActivity } from "@/types/activity";

interface BatteryHistoryEntry {
  date: Date;
  level: number;
}

export function useSocialBattery() {
  const [batteryLevel, setBatteryLevel] = useState(() => {
    const saved = localStorage.getItem("socialBatteryLevel");
    return saved ? parseInt(saved, 10) : 70;
  });
  
  const [batteryHistory, setBatteryHistory] = useState<BatteryHistoryEntry[]>(() => {
    const saved = localStorage.getItem("batteryHistory");
    return saved ? JSON.parse(saved).map((item: any) => ({
      ...item,
      date: new Date(item.date)
    })) : [];
  });

  // Save battery level to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("socialBatteryLevel", batteryLevel.toString());
    
    // Add to history when battery level changes significantly
    if (batteryHistory.length === 0 || 
        Math.abs(batteryHistory[batteryHistory.length-1].level - batteryLevel) >= 5) {
      const newHistory = [...batteryHistory, {date: new Date(), level: batteryLevel}];
      setBatteryHistory(newHistory);
      localStorage.setItem("batteryHistory", JSON.stringify(newHistory));
    }
  }, [batteryLevel, batteryHistory]);

  const handleSliderChange = (value: number[]) => {
    setBatteryLevel(value[0]);
  };

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

  return {
    batteryLevel,
    batteryHistory,
    handleSliderChange,
    handleActivitySelect
  };
}
