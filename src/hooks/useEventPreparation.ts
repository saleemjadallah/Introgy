
import { useState } from "react";
import { EventPreparation } from "@/types/events";
import { toast } from "sonner";

export function useEventPreparation() {
  const [eventPreparation, setEventPreparation] = useState<EventPreparation | null>(null);

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

  const saveEventPreparation = (eventId: string, preparation: EventPreparation) => {
    try {
      // Save to localStorage
      const savedPreparations = JSON.parse(localStorage.getItem("eventPreparations") || "{}");
      savedPreparations[eventId] = preparation;
      localStorage.setItem("eventPreparations", JSON.stringify(savedPreparations));
      
      setEventPreparation(preparation);
      return preparation;
    } catch (error) {
      console.error("Error saving event preparation:", error);
      toast.error("Failed to save event preparation");
      return null;
    }
  };

  return {
    eventPreparation,
    setEventPreparation,
    loadEventPreparation,
    saveEventPreparation
  };
}
