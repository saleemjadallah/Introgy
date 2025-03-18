
import { useState, useEffect } from "react";
import { useBatteryHistory } from "./social-battery/useBatteryHistory";
import { useOvernightRecharge } from "./social-battery/useOvernightRecharge";
import { useSleepQuality } from "./social-battery/useSleepQuality";
import { useActivityManagement } from "./social-battery/useActivityManagement";
import { useScheduledEvents } from "./useScheduledEvents";
import type { UseSocialBatteryReturn, BatteryHistoryEntry } from "./social-battery/batteryTypes";

export function useSocialBattery(): UseSocialBatteryReturn {
  const [batteryLevel, setBatteryLevel] = useState(() => {
    const saved = localStorage.getItem("socialBatteryLevel");
    return saved ? parseInt(saved, 10) : 70;
  });
  
  // Save battery level to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("socialBatteryLevel", batteryLevel.toString());
  }, [batteryLevel]);

  // Compose functionality from smaller hooks
  const { batteryHistory, addHistoryEntry } = useBatteryHistory(batteryLevel);
  
  const { lastRechargeDate } = useOvernightRecharge(
    batteryLevel, 
    setBatteryLevel,
    addHistoryEntry
  );
  
  const { recordSleepQuality } = useSleepQuality(
    batteryLevel,
    setBatteryLevel,
    addHistoryEntry
  );
  
  const { handleActivitySelect, addActivity } = useActivityManagement(
    batteryLevel,
    setBatteryLevel
  );
  
  // Add scheduled events functionality
  const { checkScheduledEvents } = useScheduledEvents(
    batteryLevel,
    setBatteryLevel,
    addHistoryEntry
  );

  const handleSliderChange = (value: number[]) => {
    setBatteryLevel(value[0]);
  };

  return {
    batteryLevel,
    batteryHistory,
    handleSliderChange,
    handleActivitySelect,
    addActivity,
    recordSleepQuality,
    checkScheduledEvents
  };
}
