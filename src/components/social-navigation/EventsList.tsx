
import { useState } from "react";
import { isPast, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { SocialEvent } from "@/types/events";
import { Plus } from "lucide-react";
import EventCard from "./events-list/EventCard";
import EmptyEventsList from "./events-list/EmptyEventsList";
import EventFormDialog from "./events-list/EventFormDialog";
import EventsGroup from "./events-list/EventsGroup";

interface EventsListProps {
  events: SocialEvent[];
  onEventSelect: (event: SocialEvent) => void;
  onAddEvent: (event: SocialEvent) => void;
  onUpdateEvent: (event: SocialEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  selectedEventId?: string;
}

const EventsList = ({ 
  events, 
  onEventSelect, 
  onAddEvent, 
  onUpdateEvent, 
  onDeleteEvent,
  selectedEventId 
}: EventsListProps) => {
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SocialEvent | null>(null);
  
  // Group events by date category
  const upcomingEvents = events.filter(event => 
    !isPast(new Date(event.date)) || isSameDay(new Date(event.date), new Date())
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const pastEvents = events.filter(event => 
    isPast(new Date(event.date)) && !isSameDay(new Date(event.date), new Date())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const handleAddEvent = (event: SocialEvent) => {
    onAddEvent(event);
    setShowNewEventForm(false);
  };
  
  const handleUpdateEvent = (event: SocialEvent) => {
    onUpdateEvent(event);
    setEditingEvent(null);
  };

  const newEventButton = (
    <Button size="sm" className="flex items-center gap-1">
      <Plus className="h-4 w-4" />
      New Event
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Events</h3>
        <EventFormDialog
          isOpen={showNewEventForm}
          setIsOpen={setShowNewEventForm}
          editingEvent={null}
          onSubmit={handleAddEvent}
          onCancel={() => setShowNewEventForm(false)}
          triggerButton={newEventButton}
        />
      </div>
      
      {upcomingEvents.length === 0 && pastEvents.length === 0 ? (
        <EmptyEventsList onAddFirstEvent={() => setShowNewEventForm(true)} />
      ) : (
        <>
          <EventsGroup
            title="Upcoming Events"
            events={upcomingEvents}
            onEventSelect={onEventSelect}
            onEditEvent={setEditingEvent}
            onDeleteEvent={onDeleteEvent}
            selectedEventId={selectedEventId}
            isPast={false}
          />
          
          <EventsGroup
            title="Past Events"
            events={pastEvents}
            onEventSelect={onEventSelect}
            onEditEvent={setEditingEvent}
            onDeleteEvent={onDeleteEvent}
            selectedEventId={selectedEventId}
            isPast={true}
          />
        </>
      )}
      
      {/* Edit Event Dialog */}
      <EventFormDialog
        isOpen={!!editingEvent}
        setIsOpen={(open) => !open && setEditingEvent(null)}
        editingEvent={editingEvent}
        onSubmit={handleUpdateEvent}
        onCancel={() => setEditingEvent(null)}
      />
    </div>
  );
};

export default EventsList;
