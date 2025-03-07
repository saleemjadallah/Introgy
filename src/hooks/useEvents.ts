
import { useState, useEffect } from "react";
import { SocialEvent, EventPreparation, ConversationStarter } from "@/types/events";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useEvents() {
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState<SocialEvent | null>(null);
  const [eventPreparation, setEventPreparation] = useState<EventPreparation | null>(null);

  // For now we're using localStorage but this can be expanded to use Supabase
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

  const generateConversationStarters = async (eventId: string) => {
    try {
      if (!activeEvent) return [];
      
      // Get user interests (would come from profile in a real implementation)
      const userInterests = "technology, books, hiking, movies, quiet activities";
      
      const response = await supabase.functions.invoke("generate-conversation-starters", {
        body: {
          eventType: activeEvent.eventType,
          userInterests,
          attendees: activeEvent.knownAttendees?.join(", ")
        }
      });

      if (response.error) throw new Error(response.error.message);
      
      const starters: ConversationStarter[] = response.data.starters;
      
      // Update event preparation with new starters
      const preparation = eventPreparation || {
        eventId,
        conversationStarters: [],
        exitStrategies: [],
        boundaries: [],
        energyPlan: {
          preEventActivities: [],
          quietTime: 30,
          quietTimeAfter: 60
        }
      };
      
      const updatedPreparation = {
        ...preparation,
        conversationStarters: [
          ...preparation.conversationStarters,
          ...starters
        ]
      };
      
      setEventPreparation(updatedPreparation);
      
      // Save to localStorage
      const savedPreparations = JSON.parse(localStorage.getItem("eventPreparations") || "{}");
      savedPreparations[eventId] = updatedPreparation;
      localStorage.setItem("eventPreparations", JSON.stringify(savedPreparations));
      
      return starters;
    } catch (error) {
      console.error("Error generating conversation starters:", error);
      toast.error("Failed to generate conversation starters");
      return [];
    }
  };

  const loadEventPreparation = (eventId: string) => {
    try {
      const savedPreparations = JSON.parse(localStorage.getItem("eventPreparations") || "{}");
      const preparation = savedPreparations[eventId];
      
      if (preparation) {
        setEventPreparation(preparation);
        return preparation;
      } else {
        setEventPreparation(null);
        return null;
      }
    } catch (error) {
      console.error("Error loading event preparation:", error);
      toast.error("Failed to load event preparation");
      return null;
    }
  };

  return {
    events,
    isLoading,
    activeEvent,
    eventPreparation,
    setActiveEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    generateConversationStarters,
    loadEventPreparation
  };
}
