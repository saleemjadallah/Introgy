
import { useState, useEffect } from "react";
import type { BatteryHistoryEntry } from "./batteryTypes";

export function useBatteryHistory(batteryLevel: number) {
  const [batteryHistory, setBatteryHistory] = useState<BatteryHistoryEntry[]>(() => {
    const saved = localStorage.getItem("batteryHistory");
    return saved ? JSON.parse(saved).map((item: any) => ({
      ...item,
      date: new Date(item.date)
    })) : [];
  });

  // Update history when battery level changes significantly
  useEffect(() => {
    if (batteryHistory.length === 0 || 
        Math.abs(batteryHistory[batteryHistory.length-1].level - batteryLevel) >= 5) {
      const newHistory = [...batteryHistory, {date: new Date(), level: batteryLevel}];
      setBatteryHistory(newHistory);
      localStorage.setItem("batteryHistory", JSON.stringify(newHistory));
    }
  }, [batteryLevel, batteryHistory]);

  return {
    batteryHistory,
    addHistoryEntry: (entry: BatteryHistoryEntry) => {
      setBatteryHistory(prev => [...prev, entry]);
      localStorage.setItem("batteryHistory", JSON.stringify([...batteryHistory, entry]));
    }
  };
}
