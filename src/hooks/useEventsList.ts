
import { useState, useEffect } from "react";
import { SocialEvent } from "@/types/events";
import { toast } from "sonner";

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
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    const updatedEvents = [...events, newEvent];
    saveEvents(updatedEvents);
    toast.success("Event created successfully");
    return newEvent;
  };

  const updateEvent = (updatedEvent: SocialEvent) => {
    if (!updatedEvent.id) return;
    
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
