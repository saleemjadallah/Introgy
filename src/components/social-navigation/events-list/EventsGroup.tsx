
import { SocialEvent } from "@/types/events";
import EventCard from "./EventCard";

interface EventsGroupProps {
  title: string;
  events: SocialEvent[];
  onEventSelect: (event: SocialEvent) => void;
  onEditEvent: (event: SocialEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  selectedEventId?: string;
  isPast?: boolean;
}

const EventsGroup = ({ 
  title, 
  events, 
  onEventSelect, 
  onEditEvent, 
  onDeleteEvent, 
  selectedEventId,
  isPast
}: EventsGroupProps) => {
  if (events.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          onSelect={onEventSelect}
          onEdit={onEditEvent}
          onDelete={onDeleteEvent}
          isSelected={event.id === selectedEventId}
          isPast={isPast}
        />
      ))}
    </div>
  );
};

export default EventsGroup;
