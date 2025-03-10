import { useEffect, useRef, useState } from "react";
import { SocialEvent } from "@/types/events";
import { toast } from "sonner";
import { BatteryHistoryEntry } from "./social-battery/batteryTypes";

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
          
          // Check if event has started and hasn't already depleted energy
          if (eventDate <= now && !event.energyDepleted) {
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
              description: `Your social battery decreased by ${totalDepletedEnergy}%`,
            });
          } else if (deplatedEvents.length > 1) {
            toast(`Energy depleted for ${deplatedEvents.length} events`, {
              description: `Your social battery decreased by ${totalDepletedEnergy}%`,
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
    
    // Set up interval to check every minute
    intervalRef.current = window.setInterval(() => {
      checkScheduledEvents();
    }, 60000); // Check every minute
    
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