
import { format, isYesterday, isAfter, isBefore, startOfDay, endOfDay, set } from "date-fns";
import { SocialEvent } from "@/types/events";
import type { BatteryHistoryEntry, SocialActivity } from "./batteryTypes";

// Helper function to determine if there were late night events
export const hasLateNightEvents = (events: SocialEvent[]): boolean => {
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
export const getStoredEvents = (): SocialEvent[] => {
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

// Battery status helpers
export const getBatteryStatusMessage = (batteryLevel: number) => {
  if (batteryLevel < 20) return "Critical - Time to recharge!";
  if (batteryLevel < 40) return "Low - Consider taking a break soon";
  if (batteryLevel < 60) return "Moderate - Be mindful of your energy";
  if (batteryLevel < 80) return "Good - You have plenty of social energy";
  return "Excellent - Your social battery is fully charged";
};

export const getBatteryColor = (batteryLevel: number) => {
  if (batteryLevel < 20) return "bg-red-500";
  if (batteryLevel < 50) return "bg-orange-500";
  return "bg-green-500";
};

// Sleep quality battery adjustments
export const SLEEP_QUALITY_ADJUSTMENTS = {
  good: 50,   // +50% for good sleep
  medium: 10, // +10% for medium sleep
  bad: -5,    // -5% for bad sleep
};
