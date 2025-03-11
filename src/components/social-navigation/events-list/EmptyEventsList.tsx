
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { SocialEvent } from "@/types/events";

interface EmptyEventsListProps {
  onAddEvent: (event: SocialEvent) => void;
}

const EmptyEventsList = ({ onAddEvent }: EmptyEventsListProps) => {
  const handleCreateEvent = () => {
    // Create a default empty event
    onAddEvent({
      id: "",
      name: "",
      date: new Date(), // Use Date object
      location: "",
      eventType: "casual gathering",
      peopleCount: "small group (5-15)",
      energyCost: 5,
      notes: "",
    });
  };

  return (
    <div className="text-center py-10 space-y-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-periwinkle/10 flex items-center justify-center">
        <CalendarPlus className="h-8 w-8 text-periwinkle" />
      </div>
      <h3 className="text-lg font-medium">No events yet</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        Create your first social event to start planning and preparing for social interactions.
      </p>
      <Button 
        onClick={handleCreateEvent}
        className="bg-periwinkle hover:bg-periwinkle-dark mt-2"
      >
        <CalendarPlus className="h-4 w-4 mr-2" />
        Create Your First Event
      </Button>
    </div>
  );
};

export default EmptyEventsList;
