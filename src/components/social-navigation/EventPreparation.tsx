
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { SocialEvent, EventPreparation as EventPreparationType } from "@/types/events";
import { useCountdown } from "./event-preparation/useCountdown";
import EventHeader from "./event-preparation/EventHeader";
import EventTabs from "./event-preparation/EventTabs";

interface EventPreparationProps {
  event: SocialEvent;
  preparation: EventPreparationType | null;
  onGenerateConversationStarters: () => Promise<void>;
  onGeneratePreparationMemo: () => Promise<void>;
  batteryLevel: number;
}

const EventPreparation = ({ 
  event, 
  preparation,
  onGenerateConversationStarters,
  onGeneratePreparationMemo,
  batteryLevel
}: EventPreparationProps) => {
  const countdown = useCountdown(new Date(event.date));
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-4">
      {/* Display low battery warning if needed */}
      {batteryLevel < 30 && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-500">Low Social Battery</h3>
              <p className="text-sm text-muted-foreground">Your social battery is currently low. Consider rescheduling or ensuring you have enough recharge time.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event header with key details */}
      <EventHeader 
        event={event} 
        countdown={countdown} 
        batteryLevel={batteryLevel} 
      />

      {/* Tabs for different preparation aspects */}
      <EventTabs 
        event={event}
        preparation={preparation}
        countdown={countdown}
        batteryLevel={batteryLevel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGenerateConversationStarters={onGenerateConversationStarters}
        onGeneratePreparationMemo={onGeneratePreparationMemo}
      />
    </div>
  );
};

export default EventPreparation;
