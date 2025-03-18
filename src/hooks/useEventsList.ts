
import { useState, useEffect } from "react";
import { SocialEvent } from "@/types/events";
import { toast } from "sonner";

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

export function useEventsList() {
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState<SocialEvent | null>(null);

  // Load events from localStorage
  useEffect(() => {
    const loadEvents = () => {
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
        toast.error("Failed to load your events");
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const saveEvents = (updatedEvents: SocialEvent[]) => {
    try {
      localStorage.setItem("socialEvents", JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error saving events:", error);
      toast.error("Failed to save your events");
    }
  };

  const addEvent = (event: SocialEvent) => {
    // Create event with energyDepleted flag
    // If the event is in the past, mark it as already depleted
    // If in the future, mark as not depleted (will be handled by useScheduledEvents)
    const now = new Date();
    const eventDate = new Date(event.date);
    
    // Check if event has already started (year, month, day, hour, minute comparison)
    const isPastEvent = compareEventStartTime(eventDate, now);
    
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
      energyDepleted: isPastEvent // Only mark as depleted if it's a past event
    };
    
    const updatedEvents = [...events, newEvent];
    saveEvents(updatedEvents);
    toast.success("Event created successfully");
    return newEvent;
  };

  const updateEvent = (updatedEvent: SocialEvent) => {
    if (!updatedEvent.id) return;
    
    // Find the original event
    const originalEvent = events.find(event => event.id === updatedEvent.id);
    
    if (originalEvent) {
      // If date has changed, reset the energyDepleted flag appropriately
      if (originalEvent.date.toString() !== updatedEvent.date.toString()) {
        const now = new Date();
        const eventDate = new Date(updatedEvent.date);
        
        // If the event's new date is in the future, it hasn't depleted energy yet
        // If it's in the past, mark it as already depleted 
        updatedEvent.energyDepleted = compareEventStartTime(eventDate, now);
      }
    }
    
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    );
    saveEvents(updatedEvents);
    
    if (activeEvent?.id === updatedEvent.id) {
      setActiveEvent(updatedEvent);
    }
    
    toast.success("Event updated successfully");
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    saveEvents(updatedEvents);
    
    if (activeEvent?.id === eventId) {
      setActiveEvent(null);
    }
    
    toast.success("Event deleted successfully");
  };

  return {
    events,
    isLoading,
    activeEvent,
    setActiveEvent,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
