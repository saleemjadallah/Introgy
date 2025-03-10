
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { SocialEvent, EventType, PeopleCount, RecurringFrequency } from "@/types/events";

// Import the new component modules
import DateTimeSelectors from "./event-form/DateTimeSelectors";
import EventTypeSelector from "./event-form/EventTypeSelector";
import EnergyCostSlider from "./event-form/EnergyCostSlider";
import RecurringEventOptions from "./event-form/RecurringEventOptions";
import FormFooter from "./event-form/FormFooter";

interface EventFormProps {
  initialEvent?: Partial<SocialEvent>;
  onSubmit: (event: SocialEvent) => void;
  onCancel: () => void;
}

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
    
    // Create a new Date object to avoid reference issues
    const newDate = new Date(selectedDate);
    setDate(newDate);
    
    // Preserve the time from the existing selection
    const hours = event.date ? new Date(event.date).getHours() : new Date().getHours();
    const minutes = event.date ? new Date(event.date).getMinutes() : new Date().getMinutes();
    
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    
    handleInputChange("date", newDate);
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
    <Card className="w-full max-h-[80vh] overflow-y-auto">
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
          
          <DateTimeSelectors 
            date={date}
            time={time} 
            onDateSelect={handleDateSelect}
            onTimeChange={handleTimeChange}
          />
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              value={event.location || ""} 
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Where is this event taking place?"
            />
          </div>
          
          <EventTypeSelector 
            eventType={event.eventType as EventType}
            peopleCount={event.peopleCount as PeopleCount}
            onEventTypeChange={(value) => handleInputChange("eventType", value)}
            onPeopleCountChange={(value) => handleInputChange("peopleCount", value)}
          />
          
          <EnergyCostSlider 
            energyCost={event.energyCost || 5}
            onEnergyCostChange={(value) => handleInputChange("energyCost", value)}
          />
          
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
          
          <RecurringEventOptions 
            isRecurring={event.isRecurring || false}
            recurringFrequency={event.recurringFrequency as RecurringFrequency}
            onRecurringChange={(checked) => handleInputChange("isRecurring", checked)}
            onFrequencyChange={(value) => handleInputChange("recurringFrequency", value)}
          />
          
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
        
        <FormFooter 
          isEditing={!!initialEvent?.id} 
          onCancel={onCancel}
        />
      </form>
    </Card>
  );
};

export default EventForm;
