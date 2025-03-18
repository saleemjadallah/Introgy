
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { format, addMinutes, subMinutes } from "date-fns";

interface TimeSchedulerProps {
  quietTimeBefore: number;
  quietTimeAfter: number;
  eventDate: Date;
  eventDuration: number;
  onQuietTimeBeforeChange: (value: number) => void;
  onQuietTimeAfterChange: (value: number) => void;
}

const TimeScheduler = ({
  quietTimeBefore,
  quietTimeAfter,
  eventDate,
  eventDuration,
  onQuietTimeBeforeChange,
  onQuietTimeAfterChange,
}: TimeSchedulerProps) => {
  // Calculate the pre and post event quiet times
  const quietTimeStart = subMinutes(eventDate, quietTimeBefore);
  const eventEndTime = addMinutes(eventDate, eventDuration);
  const recoveryTimeEnd = addMinutes(eventEndTime, quietTimeAfter);

  return (
    <div className="space-y-4 pt-2 border-t">
      <h3 className="text-base font-medium flex items-center gap-2">
        <Clock className="h-4 w-4" /> Schedule Your Recharge Time
      </h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Quiet Time Before Event</Label>
            <span className="text-sm">{quietTimeBefore} min</span>
          </div>
          <Slider 
            value={[quietTimeBefore]} 
            min={15} 
            max={180}
            step={15}
            onValueChange={(value) => onQuietTimeBeforeChange(value[0])}
          />
          <div className="text-sm text-muted-foreground">
            Start quiet time at: {format(quietTimeStart, "h:mm a")}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Recovery Time After Event</Label>
            <span className="text-sm">{quietTimeAfter} min</span>
          </div>
          <Slider 
            value={[quietTimeAfter]} 
            min={30} 
            max={240}
            step={30}
            onValueChange={(value) => onQuietTimeAfterChange(value[0])}
          />
          <div className="text-sm text-muted-foreground">
            Event ends at approximately: {format(eventEndTime, "h:mm a")}
            <br />
            Recovery time until: {format(recoveryTimeEnd, "h:mm a")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeScheduler;
