
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RechargeActivity, DepletingActivity, isRechargeActivity } from "@/types/activity";
import { format, isYesterday, isAfter, isBefore, startOfDay, endOfDay, set } from "date-fns";
import { SocialEvent } from "@/types/events";
import type { SleepQuality } from "@/components/social-battery/SleepQualityDialog";

interface BatteryHistoryEntry {
  date: Date;
  level: number;
}

interface SocialActivity {
  type: "recharge" | "depletion";
  name: string;
  energyImpact: number;
  date: Date;
  duration?: number;
  notes?: string;
  source?: string;
}

// Helper function to determine if there were late night events
const hasLateNightEvents = (events: SocialEvent[]): boolean => {
  if (!events || events.length === 0) return false;
  
  const yesterday = endOfDay(new Date());
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lateNightStart = set(yesterday, { hours: 22, minutes: 0 });
  const lateNightEnd = set(new Date(), { hours: 6, minutes: 0 });
  
  return events.some(event => {
    const eventDate = new Date(event.date);
    return isAfter(eventDate, lateNightStart) && isBefore(eventDate, lateNightEnd);
  });
};

// Get stored events from localStorage
const getStoredEvents = (): SocialEvent[] => {
  try {
    const savedEvents = localStorage.getItem("socialEvents");
    if (savedEvents) {
      return JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date)
      }));
    }
  } catch (error) {
    console.error("Error loading events:", error);
  }
  return [];
};

// Sleep quality battery adjustments
const SLEEP_QUALITY_ADJUSTMENTS = {
  good: 50,   // +50% for good sleep
  medium: 10, // +10% for medium sleep
  bad: -5,    // -5% for bad sleep
};

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
          
          // Add this to history as a recharge activity
          const overnightRecharge = {
            id: Date.now(),
            name: "Overnight Rest",
            duration: 480, // 8 hours in minutes
            energyGain: rechargeAmount,
            isCustom: true
          } as RechargeActivity;
          
          // Add to history but don't double-count the recharge
          const newHistoryEntry = {
            date: new Date(),
            level: newLevel
          };
          setBatteryHistory(prev => [...prev, newHistoryEntry]);
        }
      }
      
      // Update last recharge date regardless
      setLastRechargeDate(new Date());
      localStorage.setItem("lastNightlyRecharge", new Date().toISOString());
    };
    
    // Run the check on mount and then set up an interval to check periodically
    checkForOvernightRecharge();
    
    // Check again if the battery level changes
  }, [batteryLevel]);

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

  // Add a new method to handle social activities
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

  // Add a new method to handle sleep quality recording
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
    const newHistoryEntry = {
      date: new Date(),
      level: newLevel
    };
    setBatteryHistory(prev => [...prev, newHistoryEntry]);
    localStorage.setItem("batteryHistory", JSON.stringify([...batteryHistory, newHistoryEntry]));
    
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

  return {
    batteryLevel,
    batteryHistory,
    handleSliderChange,
    handleActivitySelect,
    addActivity,
    recordSleepQuality
  };
}
