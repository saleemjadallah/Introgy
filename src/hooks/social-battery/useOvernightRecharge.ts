
import { useState, useEffect } from "react";
import { getStoredEvents, hasLateNightEvents } from "./batteryUtils";
import { toast } from "sonner";
import { BatteryHistoryEntry } from "./batteryTypes";
import { startOfDay } from "date-fns";

export function useOvernightRecharge(
  batteryLevel: number, 
  setBatteryLevel: (level: number) => void,
  addHistoryEntry: (entry: BatteryHistoryEntry) => void
) {
  const [lastRechargeDate, setLastRechargeDate] = useState<Date>(() => {
    const saved = localStorage.getItem("lastNightlyRecharge");
    return saved ? new Date(saved) : new Date(0); // Default to epoch if not set
  });

  // Check for overnight recharge
  useEffect(() => {
    const checkForOvernightRecharge = () => {
      const today = startOfDay(new Date());
      const lastRechargeDay = startOfDay(new Date(lastRechargeDate));
      
      // If we've already recharged today, do nothing
      if (today.getTime() === lastRechargeDay.getTime()) {
        return;
      }
      
      // Check for events last night
      const events = getStoredEvents();
      const hadLateNightEvents = hasLateNightEvents(events);
      
      if (!hadLateNightEvents) {
        // Calculate 50% recharge, but don't exceed 100%
        const rechargeAmount = 50;
        const newLevel = Math.min(100, batteryLevel + rechargeAmount);
        
        // Only apply if it would actually change the level
        if (newLevel > batteryLevel) {
          setBatteryLevel(newLevel);
          
          toast.success(`Battery recharged by ${rechargeAmount}%`, {
            description: "Overnight rest has restored your social energy",
          });
          
          // Add to history
          addHistoryEntry({ date: new Date(), level: newLevel });
        }
      }
      
      // Update last recharge date regardless
      setLastRechargeDate(new Date());
      localStorage.setItem("lastNightlyRecharge", new Date().toISOString());
    };
    
    // Run the check on mount
    checkForOvernightRecharge();
    
  }, [batteryLevel, setBatteryLevel, addHistoryEntry]);

  return { lastRechargeDate };
}
