
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MessageSquare, DoorOpen, BatteryCharging, BookOpenText } from "lucide-react";
import { SocialEvent, EventPreparation as EventPreparationType } from "@/types/events";

import EventOverview from "./EventOverview";
import PreparationMemo from "../PreparationMemo";
import ConversationStarters from "../ConversationStarters";
import ExitStrategies from "../ExitStrategies";
import EnergyPlanning from "../EnergyPlanning";
import Boundaries from "../Boundaries";

interface EventTabsProps {
  event: SocialEvent;
  preparation: EventPreparationType | null;
  countdown: string;
  batteryLevel: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onGenerateConversationStarters: () => Promise<void>;
  onGeneratePreparationMemo: () => Promise<void>;
}

const EventTabs = ({
  event,
  preparation,
  countdown,
  batteryLevel,
  activeTab,
  setActiveTab,
  onGenerateConversationStarters,
  onGeneratePreparationMemo
}: EventTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full grid grid-cols-5">
        <TabsTrigger value="overview" className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span className="hidden md:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="memo" className="flex items-center gap-1">
          <BookOpenText className="h-4 w-4" />
          <span className="hidden md:inline">Memo</span>
        </TabsTrigger>
        <TabsTrigger value="conversation" className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden md:inline">Conversation</span>
        </TabsTrigger>
        <TabsTrigger value="exit" className="flex items-center gap-1">
          <DoorOpen className="h-4 w-4" />
          <span className="hidden md:inline">Exit</span>
        </TabsTrigger>
        <TabsTrigger value="energy" className="flex items-center gap-1">
          <BatteryCharging className="h-4 w-4" />
          <span className="hidden md:inline">Energy</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4 space-y-4">
        <EventOverview
          event={event}
          preparation={preparation}
          countdown={countdown}
          batteryLevel={batteryLevel}
          onGeneratePreparationMemo={onGeneratePreparationMemo}
          onGenerateConversationStarters={onGenerateConversationStarters}
          setActiveTab={setActiveTab}
        />
      </TabsContent>

      <TabsContent value="memo" className="mt-4">
        <PreparationMemo 
          eventId={event.id as string}
          memo={preparation?.aiMemo}
          onGenerate={onGeneratePreparationMemo}
        />
      </TabsContent>

      <TabsContent value="conversation" className="mt-4">
        <ConversationStarters 
          eventId={event.id as string} 
          starters={preparation?.conversationStarters || []} 
          onGenerate={onGenerateConversationStarters}
        />
      </TabsContent>

      <TabsContent value="exit" className="mt-4">
        <ExitStrategies eventType={event.eventType} />
      </TabsContent>

      <TabsContent value="energy" className="mt-4 space-y-4">
        <EnergyPlanning 
          energyCost={event.energyCost} 
          eventDate={new Date(event.date)}
          eventDuration={event.duration || 120}
          batteryLevel={batteryLevel}
        />
        
        <Boundaries />
      </TabsContent>
    </Tabs>
  );
};

export default EventTabs;
