import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Import CSS directly to ensure styling
import "react-day-picker/dist/style.css";

interface DateTimeSelectorsProps {
  date: Date | undefined;
  time: string;
  onDateSelect: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

const DateTimeSelectors = ({ date, time, onDateSelect, onTimeChange }: DateTimeSelectorsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);

  // Update the local state when the parent date changes
  useEffect(() => {
    setSelectedDate(date);
  }, [date]);
  
  // Handle selection and confirm
  const handleDateSelect = (selected: Date | undefined) => {
    if (selected) {
      setSelectedDate(selected);
      
      // Create a new Date to avoid reference issues
      const newDate = new Date(selected);
      
      // Get hours and minutes from existing time if set
      if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          newDate.setHours(hours, minutes);
        }
      }
      
      // Call the parent's date select handler
      onDateSelect(newDate);
      
      // Close the dialog after selection
      setIsDialogOpen(false);
    }
  };

  // Custom component for the calendar for better mobile support
  const MobileCalendar = () => {
    return (
      <div className="p-4">
        <div className="space-y-4">
          <div className="text-center pb-4 border-b">
            <h3 className="text-lg font-medium">Select date</h3>
            <p className="text-sm text-muted-foreground">
              Tap on a date to select it
            </p>
          </div>
          
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="mx-auto"
            showOutsideDays
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                buttonVariants({ variant: "outline" }),
                "h-9 w-9 p-0 opacity-80 hover:opacity-100"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-12 w-12 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/50",
              day: cn(
                buttonVariants({ variant: "ghost" }),
                "h-12 w-12 p-0 font-normal text-base aria-selected:opacity-100 hover:bg-primary/20"
              ),
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_disabled: "text-muted-foreground opacity-50",
              day_hidden: "invisible",
            }}
            fromDate={new Date(2000, 0, 1)} // Allow dates back to year 2000
            toDate={new Date(2100, 11, 31)} // Allow dates up to year 2100
            defaultMonth={selectedDate || new Date()} // Start with selected date or today
          />
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Date*</Label>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              type="button" // Important to prevent form submission
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Select date"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md p-0 sm:max-w-lg">
            <MobileCalendar />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time">Time*</Label>
        <Input 
          id="time" 
          type="time" 
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          required
          className="h-10 text-base" // Larger touch target for mobile
        />
      </div>
    </div>
  );
};

export default DateTimeSelectors;