import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface DateTimeSelectorsProps {
  date: Date | undefined;
  time: string;
  onDateSelect: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

const DateTimeSelectors = ({ date, time, onDateSelect, onTimeChange }: DateTimeSelectorsProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Modified date selection handler to not automatically close the popover
  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateSelect(selectedDate);
    // Don't automatically close the calendar
  };

  // Close the calendar when the user clicks elsewhere or presses Escape
  const handleCloseCalendar = () => {
    setCalendarOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Date*</Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              onClick={() => setCalendarOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0" 
            sideOffset={4} 
            align="start" 
            side="bottom"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              disabled={undefined} // Ensure no dates are disabled
              fromDate={undefined} // No minimum date restriction 
              toDate={undefined}   // No maximum date restriction
            />
            <div className="p-3 border-t border-border">
              <Button 
                variant="default" 
                size="sm" 
                className="w-full"
                onClick={handleCloseCalendar}
              >
                Done
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time">Time*</Label>
        <Input 
          id="time" 
          type="time" 
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default DateTimeSelectors;