
import React from "react";
import { Card } from "@/components/ui/card";
import { SocialEvent } from "@/types/events";
import { EventPreparation } from "@/types/events";
import EventPreparation from "@/components/social-navigation/EventPreparation";
import EnergyPlanning from "@/components/social-navigation/EnergyPlanning";
import ConversationStarters from "@/components/social-navigation/ConversationStarters";
import ExitStrategies from "@/components/social-navigation/ExitStrategies";
import Boundaries from "@/components/social-navigation/Boundaries";
import PreparationMemo from "@/components/social-navigation/PreparationMemo";

interface PreparationTabProps {
  activeEvent: SocialEvent | null;
  eventPreparation: EventPreparation | null;
  onGenerateConversationStarters: () => void;
  onGeneratePreparationMemo: () => void;
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
      <Card className="navigation-container-gradient p-6 text-center">
        <div className="py-8">
          <h3 className="text-lg font-medium mb-2">No Event Selected</h3>
          <p className="text-muted-foreground">
            Please select an event from the Events tab to prepare for it.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <EventPreparation event={activeEvent} />
      
      <EnergyPlanning 
        event={activeEvent} 
        batteryLevel={batteryLevel}
      />
      
      <ConversationStarters 
        event={activeEvent}
        preparation={eventPreparation}
        onGenerate={onGenerateConversationStarters}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExitStrategies event={activeEvent} />
        <Boundaries event={activeEvent} />
      </div>
      
      <PreparationMemo
        event={activeEvent}
        preparation={eventPreparation}
        onGenerate={onGeneratePreparationMemo}
      />
    </div>
  );
};

export default PreparationTab;
