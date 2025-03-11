
import React from "react";
import { Card } from "@/components/ui/card";
import { SocialEvent } from "@/types/events";
import { EventPreparation as EventPreparationType } from "@/types/events";
import EnergyPlanning from "@/components/social-navigation/EnergyPlanning";
import ConversationStarters from "@/components/social-navigation/ConversationStarters";
import ExitStrategies from "@/components/social-navigation/ExitStrategies";
import Boundaries from "@/components/social-navigation/Boundaries";
import PreparationMemo from "@/components/social-navigation/PreparationMemo";

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

  // Wrap non-Promise functions with async to return Promises
  const handleGenerateConversationStarters = async () => {
    return onGenerateConversationStarters();
  };

  const handleGeneratePreparationMemo = async () => {
    return onGeneratePreparationMemo();
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{activeEvent.name || "Unnamed Event"}</h3>
            <p className="text-muted-foreground">
              {new Date(activeEvent.date).toLocaleDateString()} at {activeEvent.location || "Location TBD"}
            </p>
          </div>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-periwinkle/10 text-periwinkle">
              {activeEvent.eventType}
            </span>
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-periwinkle/10 text-periwinkle">
              {activeEvent.peopleCount}
            </span>
          </div>
        </div>
      </div>
      
      <EnergyPlanning 
        energyCost={activeEvent.energyCost}
        eventDate={new Date(activeEvent.date)}
        eventDuration={activeEvent.duration || 120}
        batteryLevel={batteryLevel}
      />
      
      <ConversationStarters 
        eventId={activeEvent.id as string}
        starters={eventPreparation?.conversationStarters || []}
        onGenerate={handleGenerateConversationStarters}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExitStrategies eventType={activeEvent.eventType} />
        <Boundaries />
      </div>
      
      <PreparationMemo
        eventId={activeEvent.id as string}
        memo={eventPreparation?.aiMemo}
        onGenerate={handleGeneratePreparationMemo}
      />
    </div>
  );
};

export default PreparationTab;
