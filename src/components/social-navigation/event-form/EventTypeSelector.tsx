
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventType, PeopleCount } from "@/types/events";

interface EventTypeSelectorProps {
  eventType: EventType | undefined;
  peopleCount: PeopleCount | undefined;
  onEventTypeChange: (value: EventType) => void;
  onPeopleCountChange: (value: PeopleCount) => void;
}

const eventTypes: EventType[] = [
  'work function', 
  'casual gathering', 
  'formal event', 
  'family gathering', 
  'date', 
  'networking', 
  'other'
];

const peopleCounts: PeopleCount[] = [
  'intimate (2-5)', 
  'small group (5-15)', 
  'medium gathering (15-30)', 
  'large event (30+)'
];

const EventTypeSelector = ({
  eventType,
  peopleCount,
  onEventTypeChange,
  onPeopleCountChange
}: EventTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="eventType">Event Type*</Label>
        <Select 
          value={eventType || "casual gathering"}
          onValueChange={(value: EventType) => onEventTypeChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="peopleCount">Number of People*</Label>
        <Select 
          value={peopleCount || "small group (5-15)"}
          onValueChange={(value: PeopleCount) => onPeopleCountChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select group size" />
          </SelectTrigger>
          <SelectContent>
            {peopleCounts.map((count) => (
              <SelectItem key={count} value={count}>
                {count}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EventTypeSelector;
