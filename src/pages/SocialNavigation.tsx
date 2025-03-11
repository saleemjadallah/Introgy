
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useSocialBattery } from "@/hooks/useSocialBattery";
import EventsTab from "@/components/social-navigation/tabs/EventsTab";
import PreparationTab from "@/components/social-navigation/tabs/PreparationTab";
import ComingSoonFeatures from "@/components/social-navigation/ComingSoonFeatures";
import LowBatteryWarning from "@/components/social-navigation/LowBatteryWarning";

const SocialNavigation = () => {
  const { 
    events, 
    isLoading, 
    activeEvent, 
    eventPreparation, 
    setActiveEvent, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    generateConversationStarters,
    generatePreparationMemo,
    loadEventPreparation
  } = useEvents();
  
  const { batteryLevel } = useSocialBattery();
  const [selectedTab, setSelectedTab] = useState<string>("events");
  
  useEffect(() => {
    // If user selects an event, switch to preparation tab
    if (activeEvent && selectedTab === "events") {
      setSelectedTab("preparation");
    }
    
    // If user has an active event, load its preparation
    if (activeEvent?.id) {
      loadEventPreparation(activeEvent.id);
    }
  }, [activeEvent]);
  
  const handleEventSelect = (event) => {
    setActiveEvent(event);
  };
  
  const handleGenerateConversationStarters = async () => {
    if (!activeEvent?.id) return;
    await generateConversationStarters(activeEvent.id);
  };
  
  const handleGeneratePreparationMemo = async () => {
    if (!activeEvent?.id) return;
    await generatePreparationMemo(activeEvent.id);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Social Navigation</h2>
        <p className="text-muted-foreground">Tools to navigate social situations with confidence</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 navigation-container-gradient">
          <TabsTrigger value="events" className="data-[state=active]:bg-white/60">
            <Calendar className="h-4 w-4 mr-2 text-periwinkle" />
            Events
          </TabsTrigger>
          <TabsTrigger value="preparation" disabled={!activeEvent} className="data-[state=active]:bg-white/60">
            <Users className="h-4 w-4 mr-2 text-periwinkle" />
            Preparation
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="space-y-4 mt-4">
          <EventsTab 
            events={events}
            onEventSelect={handleEventSelect}
            onAddEvent={addEvent}
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
            selectedEventId={activeEvent?.id}
          />
        </TabsContent>
        
        <TabsContent value="preparation" className="space-y-4 mt-4">
          {batteryLevel < 30 && <LowBatteryWarning />}
          <PreparationTab 
            activeEvent={activeEvent}
            eventPreparation={eventPreparation}
            onGenerateConversationStarters={handleGenerateConversationStarters}
            onGeneratePreparationMemo={handleGeneratePreparationMemo}
            batteryLevel={batteryLevel}
          />
        </TabsContent>
      </Tabs>

      <ComingSoonFeatures />
    </div>
  );
};

export default SocialNavigation;
