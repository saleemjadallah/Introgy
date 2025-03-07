
import { SocialEvent, EventPreparation } from "@/types/events";
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { useEventsList } from "@/hooks/useEventsList";
import { useEventPreparation } from "@/hooks/useEventPreparation";
import { useConversationStarters } from "@/hooks/useConversationStarters";
import { usePreparationMemo } from "@/hooks/usePreparationMemo";

export function useEvents() {
  const { batteryLevel } = useSocialBattery();
  const { 
    events, 
    isLoading, 
    activeEvent, 
    setActiveEvent, 
    addEvent, 
    updateEvent, 
    deleteEvent 
  } = useEventsList();
  
  const { 
    eventPreparation, 
    setEventPreparation, 
    loadEventPreparation, 
    saveEventPreparation 
  } = useEventPreparation();
  
  const { generateConversationStarters: generateConversationStartersBase } = useConversationStarters();
  const { generatePreparationMemo: generatePreparationMemoBase } = usePreparationMemo();

  // Wrapper functions to maintain the original API
  const generateConversationStarters = async (eventId: string) => {
    if (!activeEvent) return [];
    
    const { starters, updatedPreparation } = await generateConversationStartersBase(
      activeEvent, 
      eventPreparation
    );
    
    if (updatedPreparation) {
      saveEventPreparation(eventId, updatedPreparation);
    }
    
    return starters;
  };

  const generatePreparationMemo = async (eventId: string) => {
    if (!activeEvent) return null;
    
    const { memo, updatedPreparation } = await generatePreparationMemoBase(
      activeEvent, 
      batteryLevel,
      eventPreparation
    );
    
    if (updatedPreparation) {
      saveEventPreparation(eventId, updatedPreparation);
    }
    
    return memo;
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
    generatePreparationMemo,
    loadEventPreparation
  };
}
