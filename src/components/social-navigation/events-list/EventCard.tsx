
import { format, isPast, isSameDay } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SocialEvent } from "@/types/events";
import { Calendar, Clock, MapPin, Users, Edit, Trash2, BatteryMedium } from "lucide-react";

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

export default EventCard;
