
import { useState } from "react";
import { format, isPast, isSameDay } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SocialEvent } from "@/types/events";
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, BatteryMedium } from "lucide-react";
import EventForm from "./EventForm";

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Events</h3>
        <Dialog open={showNewEventForm} onOpenChange={setShowNewEventForm}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Add details about an upcoming social event you'll attend
              </DialogDescription>
            </DialogHeader>
            <EventForm 
              onSubmit={handleAddEvent}
              onCancel={() => setShowNewEventForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {upcomingEvents.length === 0 && pastEvents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your upcoming social events to prepare for them
            </p>
            <Button onClick={() => setShowNewEventForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {upcomingEvents.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Upcoming Events</h4>
              {upcomingEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onSelect={onEventSelect}
                  onEdit={setEditingEvent}
                  onDelete={onDeleteEvent}
                  isSelected={event.id === selectedEventId}
                />
              ))}
            </div>
          )}
          
          {pastEvents.length > 0 && (
            <div className="space-y-3 mt-6">
              <h4 className="text-sm font-medium text-muted-foreground">Past Events</h4>
              {pastEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onSelect={onEventSelect}
                  onEdit={setEditingEvent}
                  onDelete={onDeleteEvent}
                  isSelected={event.id === selectedEventId}
                  isPast
                />
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the details for this event
            </DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <EventForm 
              initialEvent={editingEvent}
              onSubmit={handleUpdateEvent}
              onCancel={() => setEditingEvent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface EventCardProps {
  event: SocialEvent;
  onSelect: (event: SocialEvent) => void;
  onEdit: (event: SocialEvent) => void;
  onDelete: (eventId: string) => void;
  isSelected?: boolean;
  isPast?: boolean;
}

const EventCard = ({ event, onSelect, onEdit, onDelete, isSelected, isPast }: EventCardProps) => {
  return (
    <Card 
      className={`border ${isSelected ? 'border-primary' : ''} ${isPast ? 'bg-muted/30' : ''} hover:border-primary/50 cursor-pointer transition-all`}
      onClick={() => onSelect(event)}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{event.name}</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Are you sure you want to delete this event?")) {
                  onDelete(event.id as string);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          <div className="flex items-center mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(event.date), "E, MMM d, yyyy")}
          </div>
          <div className="flex items-center mt-1">
            <Clock className="h-4 w-4 mr-1" />
            {format(new Date(event.date), "h:mm a")}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {event.location && (
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {event.location}
            </div>
          )}
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {event.peopleCount}
          </div>
          <div className="flex items-center">
            <BatteryMedium className="h-3 w-3 mr-1" />
            {event.energyCost}/10
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsList;
