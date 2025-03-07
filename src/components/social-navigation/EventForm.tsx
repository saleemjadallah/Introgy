
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SocialEvent, EventType, PeopleCount, RecurringFrequency } from "@/types/events";
import { CalendarIcon } from "lucide-react";

interface EventFormProps {
  initialEvent?: Partial<SocialEvent>;
  onSubmit: (event: SocialEvent) => void;
  onCancel: () => void;
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

const recurringFrequencies: RecurringFrequency[] = [
  'daily', 
  'weekly', 
  'biweekly', 
  'monthly', 
  'custom'
];

const EventForm = ({ initialEvent, onSubmit, onCancel }: EventFormProps) => {
  const [event, setEvent] = useState<Partial<SocialEvent>>(initialEvent || {
    name: "",
    date: new Date(),
    location: "",
    eventType: "casual gathering",
    peopleCount: "small group (5-15)",
    energyCost: 5,
    duration: 120,
    isRecurring: false,
    recurringFrequency: "weekly",
    notes: "",
  });

  const [date, setDate] = useState<Date | undefined>(initialEvent?.date || new Date());
  const [time, setTime] = useState(initialEvent?.date ? 
    format(initialEvent.date, "HH:mm") : 
    format(new Date(), "HH:mm")
  );

  const handleInputChange = (field: keyof SocialEvent, value: any) => {
    setEvent({ ...event, [field]: value });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setDate(selectedDate);
    
    // Preserve the time from the existing selection
    const hours = event.date ? new Date(event.date).getHours() : new Date().getHours();
    const minutes = event.date ? new Date(event.date).getMinutes() : new Date().getMinutes();
    
    selectedDate.setHours(hours);
    selectedDate.setMinutes(minutes);
    
    handleInputChange("date", selectedDate);
  };

  const handleTimeChange = (timeString: string) => {
    setTime(timeString);
    
    if (!date) return;
    
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    
    handleInputChange("date", newDate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure all required fields are present
    if (!event.name || !event.date || !event.eventType || !event.peopleCount) {
      alert("Please fill in all required fields");
      return;
    }
    
    onSubmit(event as SocialEvent);
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name*</Label>
            <Input 
              id="name" 
              value={event.name || ""} 
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter event name"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time*</Label>
              <Input 
                id="time" 
                type="time" 
                value={time}
                onChange={(e) => handleTimeChange(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              value={event.location || ""} 
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Where is this event taking place?"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type*</Label>
              <Select 
                value={event.eventType || "casual gathering"}
                onValueChange={(value: EventType) => handleInputChange("eventType", value)}
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
                value={event.peopleCount || "small group (5-15)"}
                onValueChange={(value: PeopleCount) => handleInputChange("peopleCount", value)}
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
          
          <div className="space-y-2">
            <Label>Anticipated Social Energy Cost (1-10)</Label>
            <div className="flex items-center space-x-4 pt-2">
              <span className="text-sm">1</span>
              <Slider 
                value={[event.energyCost || 5]} 
                min={1} 
                max={10}
                step={1}
                onValueChange={(value) => handleInputChange("energyCost", value[0])}
              />
              <span className="text-sm">10</span>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Current: {event.energyCost || 5}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input 
              id="duration" 
              type="number" 
              min={5}
              value={event.duration || 120} 
              onChange={(e) => handleInputChange("duration", parseInt(e.target.value))}
              placeholder="How long will this event last?"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={event.isRecurring || false}
              onCheckedChange={(checked) => handleInputChange("isRecurring", checked)}
            />
            <Label>This is a recurring event</Label>
          </div>
          
          {event.isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="recurringFrequency">Frequency</Label>
              <Select 
                value={event.recurringFrequency || "weekly"}
                onValueChange={(value: RecurringFrequency) => handleInputChange("recurringFrequency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {recurringFrequencies.map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>
                      {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              value={event.notes || ""} 
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional details about this event..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialEvent?.id ? "Update Event" : "Create Event"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EventForm;
