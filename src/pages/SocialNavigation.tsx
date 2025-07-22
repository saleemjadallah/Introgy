
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Download, Info } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { Button } from "@/components/ui/button";
import EventsTab from "@/components/social-navigation/tabs/EventsTab";
import PreparationTab from "@/components/social-navigation/tabs/PreparationTab";
import ComingSoonFeatures from "@/components/social-navigation/ComingSoonFeatures";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

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
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  
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
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Social Navigation</h2>
        <p className="text-muted-foreground">Tools to navigate social situations with confidence</p>
      </div>

      <Card className="navigation-container-gradient">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Social Navigation in Your Pocket</CardTitle>
          <CardDescription className="text-base">
            Preparing for social events has never been easier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-sky-50 dark:bg-sky-950/30 border-l-4 border-sky-500 p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-sky-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">About This Feature</h4>
                <p className="text-sm text-muted-foreground">
                  Social Navigation helps you plan and prepare for social events, reducing anxiety
                  and making social interactions more manageable. This is a preview of what's 
                  available in the full Introgy app.
                </p>
              </div>
            </div>
          </div>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 navigation-container-gradient">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/60 hover:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-white/60 hover:text-white">
                <Calendar className="h-4 w-4 mr-2 text-periwinkle" />
                Events
              </TabsTrigger>
              <TabsTrigger value="preparation" className="data-[state=active]:bg-white/60 hover:text-white">
                <Users className="h-4 w-4 mr-2 text-periwinkle" />
                Preparation
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                      <div>
                        <span className="font-medium">Event Planning</span>
                        <p className="text-sm text-muted-foreground">Create and manage upcoming social events with details like energy cost and attendees</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                      <div>
                        <span className="font-medium">Conversation Starters</span>
                        <p className="text-sm text-muted-foreground">AI-generated topics tailored to your event type and interests</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                      <div>
                        <span className="font-medium">Energy Planning</span>
                        <p className="text-sm text-muted-foreground">Schedule recharge time before and after events to manage your social battery</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                      <div>
                        <span className="font-medium">Exit Strategies</span>
                        <p className="text-sm text-muted-foreground">Graceful ways to leave conversations or events when your energy gets low</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                  <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6">
                    <li className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-800">
                        1
                      </span>
                      <h4 className="font-semibold text-lg">Create an Event</h4>
                      <p className="text-sm text-muted-foreground">Add details about upcoming social situations you'll face</p>
                    </li>
                    <li className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-800">
                        2
                      </span>
                      <h4 className="font-semibold text-lg">Get Prepared</h4>
                      <p className="text-sm text-muted-foreground">Access conversation starters, exit strategies, and preparation notes</p>
                    </li>
                    <li className="ml-6">
                      <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-800">
                        3
                      </span>
                      <h4 className="font-semibold text-lg">Manage Energy</h4>
                      <p className="text-sm text-muted-foreground">Plan your social battery usage and recovery time</p>
                    </li>
                  </ol>
                </div>
              </div>
              
              <div className="text-center pt-6">
                <Button 
                  onClick={() => window.location.href = "#download-app"} 
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  iOS App Coming Soon
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="space-y-4 mt-4">
              <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-md p-4">
                <h3 className="font-medium mb-2">Event Planning Preview</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  In the full app, you can create and manage upcoming social events, 
                  track their energy impact, and prepare strategies for each one.
                </p>
                <EventsTab 
                  events={events}
                  onEventSelect={handleEventSelect}
                  onAddEvent={addEvent}
                  onUpdateEvent={updateEvent}
                  onDeleteEvent={deleteEvent}
                  selectedEventId={activeEvent?.id}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="preparation" className="space-y-4 mt-4">
              <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-md p-4">
                <h3 className="font-medium mb-2">Event Preparation Preview</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you've created events, you can prepare for them with AI-generated conversation starters,
                  exit strategies, energy planning, and more.
                </p>
                <PreparationTab 
                  activeEvent={activeEvent}
                  eventPreparation={eventPreparation}
                  onGenerateConversationStarters={handleGenerateConversationStarters}
                  onGeneratePreparationMemo={handleGeneratePreparationMemo}
                  batteryLevel={batteryLevel}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ComingSoonFeatures />
    </motion.div>
  );
};

export default SocialNavigation;
