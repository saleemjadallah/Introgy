
import { Card, CardContent } from "@/components/ui/card";
import { SocialEvent, EventPreparation as EventPreparationType } from "@/types/events";
import { Users } from "lucide-react";
import EventPreparation from "@/components/social-navigation/EventPreparation";

interface PreparationTabProps {
  activeEvent: SocialEvent | null;
  eventPreparation: EventPreparationType | null;
  onGenerateConversationStarters: () => Promise<void>;
  onGeneratePreparationMemo: () => Promise<void>;
  batteryLevel: number;
}

const PreparationTab = ({ 
  activeEvent, 
  eventPreparation, 
  onGenerateConversationStarters,
  onGeneratePreparationMemo,
  batteryLevel 
}: PreparationTabProps) => {
  if (!activeEvent) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No event selected</h3>
          <p className="text-muted-foreground">
            Select an event to start preparation
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <EventPreparation 
      event={activeEvent}
      preparation={eventPreparation}
      onGenerateConversationStarters={onGenerateConversationStarters}
      onGeneratePreparationMemo={onGeneratePreparationMemo}
      batteryLevel={batteryLevel}
    />
  );
};

export default PreparationTab;
