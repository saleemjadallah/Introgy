
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SocialEvent } from "@/types/events";
import { Calendar, MapPin, Users, Clock, Battery } from "lucide-react";

interface EventHeaderProps {
  event: SocialEvent;
  countdown: string;
  batteryLevel: number;
}

const EventHeader = ({ event, countdown, batteryLevel }: EventHeaderProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{event.name}</CardTitle>
            <CardDescription>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(event.date), "PPp")}
              </div>
              {event.location && (
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.location}
                </div>
              )}
              <div className="flex items-center mt-1">
                <Users className="h-4 w-4 mr-1" />
                {event.peopleCount}
              </div>
              {event.duration && (
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {event.duration} minutes
                </div>
              )}
            </CardDescription>
          </div>
          <div className="bg-accent p-3 rounded-lg text-center min-w-[100px]">
            <div className="text-sm text-muted-foreground">Countdown</div>
            <div className="text-lg font-semibold">{countdown}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Social Energy Cost</span>
            <span className="text-sm font-medium">{event.energyCost}/10</span>
          </div>
          <Progress value={event.energyCost * 10} className="h-2" />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Battery className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Current Battery</span>
              <span className="text-sm font-medium">{batteryLevel}%</span>
            </div>
            <Progress 
              value={batteryLevel} 
              className="h-2" 
              indicatorClassName={
                batteryLevel < 30 
                  ? "bg-red-500" 
                  : batteryLevel < 60 
                    ? "bg-amber-500" 
                    : "bg-green-500"
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventHeader;
