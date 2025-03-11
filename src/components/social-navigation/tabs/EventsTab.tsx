
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SocialEvent } from "@/types/events";
import EventsList from "@/components/social-navigation/EventsList";
import EventForm from "@/components/social-navigation/EventForm";
import { useSocialBattery } from "@/hooks/useSocialBattery";

interface EventsTabProps {
  events: SocialEvent[];
  onEventSelect: (event: SocialEvent) => void;
  onAddEvent: (event: SocialEvent) => SocialEvent;
  onUpdateEvent: (event: SocialEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  selectedEventId?: string;
}

const EventsTab = ({ 
  events, 
  onEventSelect, 
  onAddEvent, 
  onUpdateEvent, 
  onDeleteEvent,
  selectedEventId 
}: EventsTabProps) => {
  const { addActivity } = useSocialBattery();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const handleAddEvent = (event: SocialEvent) => {
    const newEvent = onAddEvent(event);
    
    // Create a "Future event" activity in the social battery
    addActivity({
      type: "depletion",
      name: `Future event: ${event.name}`,
      energyImpact: event.energyCost * 10,
      date: new Date(event.date),
      notes: `This event is expected to cost ${event.energyCost}/10 energy units`,
      source: "social-navigation"
    });
    
    setShowAddForm(false);
    return newEvent;
  };
  
  return (
    <>
      {showAddForm ? (
        <Card className="navigation-container-gradient">
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>Add details about an upcoming social event you'll attend</CardDescription>
          </CardHeader>
          <CardContent>
            <EventForm 
              onSubmit={handleAddEvent}
              onCancel={() => setShowAddForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <EventsList 
          events={events}
          onEventSelect={onEventSelect}
          onAddEvent={handleAddEvent}
          onUpdateEvent={onUpdateEvent}
          onDeleteEvent={onDeleteEvent}
          selectedEventId={selectedEventId}
        />
      )}
    </>
  );
};

export default EventsTab;
