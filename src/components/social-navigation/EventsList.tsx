
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { SocialEvent } from "@/types/events";
import EventCard from "./events-list/EventCard";
import EventsGroup from "./events-list/EventsGroup";
import EmptyEventsList from "./events-list/EmptyEventsList";

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
  selectedEventId,
}: EventsListProps) => {
  // Group events by time
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === today.toDateString();
  });
  
  const tomorrowEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === tomorrow.toDateString();
  });
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate > tomorrow && eventDate.toDateString() !== today.toDateString() && eventDate.toDateString() !== tomorrow.toDateString();
  });
  
  const pastEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate < today && eventDate.toDateString() !== today.toDateString();
  });

  return (
    <Card className="navigation-container-gradient">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <h3 className="text-lg font-semibold">Your Events</h3>
          <p className="text-sm text-muted-foreground">
            {events.length === 0
              ? "No events scheduled yet"
              : `You have ${events.length} event${events.length !== 1 ? "s" : ""} scheduled`}
          </p>
        </div>
        <Button
          onClick={() => onAddEvent({ id: '', name: '', date: new Date().toISOString(), location: '', people: [], type: 'social-gathering', energyCost: 5, notes: '' })}
          className="bg-periwinkle hover:bg-periwinkle-dark"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </CardHeader>

      <CardContent>
        {events.length === 0 ? (
          <EmptyEventsList onAddEvent={onAddEvent} />
        ) : (
          <div className="space-y-4">
            {todayEvents.length > 0 && (
              <EventsGroup
                title="Today"
                events={todayEvents}
                onEventSelect={onEventSelect}
                onDeleteEvent={onDeleteEvent}
                selectedEventId={selectedEventId}
              />
            )}
            
            {tomorrowEvents.length > 0 && (
              <EventsGroup
                title="Tomorrow"
                events={tomorrowEvents}
                onEventSelect={onEventSelect}
                onDeleteEvent={onDeleteEvent}
                selectedEventId={selectedEventId}
              />
            )}
            
            {upcomingEvents.length > 0 && (
              <EventsGroup
                title="Upcoming"
                events={upcomingEvents}
                onEventSelect={onEventSelect}
                onDeleteEvent={onDeleteEvent}
                selectedEventId={selectedEventId}
              />
            )}
            
            {pastEvents.length > 0 && (
              <EventsGroup
                title="Past Events"
                events={pastEvents}
                onEventSelect={onEventSelect}
                onDeleteEvent={onDeleteEvent}
                selectedEventId={selectedEventId}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsList;
