import { useEffect, useRef, useState } from "react";
import { SocialEvent } from "@/types/events";
import { toast } from "sonner";
import { BatteryHistoryEntry } from "./social-battery/batteryTypes";

// Helper function to compare if an event's date/time has been reached
function compareEventStartTime(eventDate: Date, currentDate: Date): boolean {
  // Extract date components
  const eventYear = eventDate.getFullYear();
  const eventMonth = eventDate.getMonth();
  const eventDay = eventDate.getDate();
  const eventHours = eventDate.getHours();
  const eventMinutes = eventDate.getMinutes();
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const currentHours = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();
  
  // Compare year, month, day
  if (eventYear < currentYear) return true;
  if (eventYear > currentYear) return false;
  
  // Same year
  if (eventMonth < currentMonth) return true;
  if (eventMonth > currentMonth) return false;
  
  // Same year, same month
  if (eventDay < currentDay) return true;
  if (eventDay > currentDay) return false;
  
  // Same year, same month, same day - compare hours
  if (eventHours < currentHours) return true;
  if (eventHours > currentHours) return false;
  
  // Same hour - compare minutes
  return eventMinutes <= currentMinutes;
}

export function useScheduledEvents(
  batteryLevel: number,
  setBatteryLevel: (level: number) => void,
  addHistoryEntry?: (entry: BatteryHistoryEntry) => void
) {
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const intervalRef = useRef<number | null>(null);
  
  // Load events from localStorage
  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem("socialEvents");
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(parsedEvents);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    }
  }, []);
  
  // Update event in localStorage
  const updateEvent = (updatedEvent: SocialEvent) => {
    try {
      const updatedEvents = events.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      );
      
      localStorage.setItem("socialEvents", JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };
  
  // Check for events that have started but haven't depleted energy yet
  const checkScheduledEvents = () => {
    const now = new Date();
    let batteryUpdated = false;
    let totalDepletedEnergy = 0;
    let deplatedEvents: string[] = [];
    
    // Flag to track if we need to reset any incorrectly depleted future events
    let needToFixIncorrectlyDepletedEvents = false;
    
    // Get fresh events data from localStorage
    try {
      const savedEvents = localStorage.getItem("socialEvents");
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        
        parsedEvents.forEach((event: SocialEvent) => {
          const eventDate = new Date(event.date);
          
          // Check if event has started (compare year, month, day, hours, minutes)
          const isEventStarted = compareEventStartTime(eventDate, now);
          
          // Check if there are any events incorrectly marked as depleted
          if (!isEventStarted && event.energyDepleted) {
            // This is a future event incorrectly marked as depleted - fix it
            console.log(`Fixing incorrectly depleted future event: ${event.name}`);
            const updatedEvent: SocialEvent = {
              ...event,
              energyDepleted: false // Reset to not depleted since it's in the future
            };
            updateEvent(updatedEvent);
            needToFixIncorrectlyDepletedEvents = true;
          }
          
          // Only deplete battery for events that have started but haven't been depleted yet
          if (isEventStarted && !event.energyDepleted) {
            // Mark event as energy depleted
            const updatedEvent: SocialEvent = {
              ...event,
              energyDepleted: true
            };
            updateEvent(updatedEvent);
            
            totalDepletedEnergy += event.energyCost;
            batteryUpdated = true;
            deplatedEvents.push(event.name);
          }
        });
        
        // Notify about fixed events
        if (needToFixIncorrectlyDepletedEvents) {
          toast(`Fixed event energy settings`, {
            description: `Future events will now only deplete battery at their scheduled time.`,
          });
        }
        
        // Update battery level if any events depleted energy
        if (batteryUpdated) {
          const newBatteryLevel = Math.max(0, batteryLevel - totalDepletedEnergy);
          setBatteryLevel(newBatteryLevel);
          
          // Add history entry if function is provided
          if (addHistoryEntry) {
            addHistoryEntry({
              date: new Date(),
              level: newBatteryLevel
            });
          }
          
          if (deplatedEvents.length === 1) {
            toast(`Energy depleted for event: ${deplatedEvents[0]}`, {
              description: `Your social battery decreased by ${totalDepletedEnergy}% as the scheduled time arrived.`,
            });
          } else if (deplatedEvents.length > 1) {
            toast(`Energy depleted for ${deplatedEvents.length} events`, {
              description: `Your social battery decreased by ${totalDepletedEnergy}% as the scheduled times arrived.`,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error checking scheduled events:", error);
    }
  };
  
  useEffect(() => {
    // Initial check when component mounts
    checkScheduledEvents();
    
    // Set up interval to check every 30 seconds
    intervalRef.current = window.setInterval(() => {
      console.log("Checking scheduled events...");
      checkScheduledEvents();
    }, 30000); // Check every 30 seconds for more responsive updates
    
    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [batteryLevel]); // Only re-run when battery level changes
  
  return {
    checkScheduledEvents // Exported so it can be called manually if needed
  };
}