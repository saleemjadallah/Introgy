
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialEvent } from "@/types/events";
import { useEvents } from "@/hooks/useEvents";
import EventsList from "@/components/social-navigation/EventsList";
import EventPreparation from "@/components/social-navigation/EventPreparation";
import EventForm from "@/components/social-navigation/EventForm";
import { Users, Calendar, MessageSquare, BookOpen } from "lucide-react";

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
    loadEventPreparation
  } = useEvents();
  
  const [selectedTab, setSelectedTab] = useState<string>("events");
  const [showAddForm, setShowAddForm] = useState(events.length === 0);
  
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
  
  const handleEventSelect = (event: SocialEvent) => {
    setActiveEvent(event);
  };
  
  const handleGenerateConversationStarters = async () => {
    if (!activeEvent?.id) return;
    await generateConversationStarters(activeEvent.id);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Social Navigation</h2>
        <p className="text-muted-foreground">Tools to navigate social situations with confidence</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="preparation" disabled={!activeEvent}>
            <Users className="h-4 w-4 mr-2" />
            Preparation
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="space-y-4 mt-4">
          {showAddForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Create Your First Event</CardTitle>
                <CardDescription>Add details about an upcoming social event you'll attend</CardDescription>
              </CardHeader>
              <CardContent>
                <EventForm 
                  onSubmit={(event) => {
                    addEvent(event);
                    setShowAddForm(false);
                  }}
                  onCancel={() => setShowAddForm(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <EventsList 
              events={events}
              onEventSelect={handleEventSelect}
              onAddEvent={addEvent}
              onUpdateEvent={updateEvent}
              onDeleteEvent={deleteEvent}
              selectedEventId={activeEvent?.id}
            />
          )}
        </TabsContent>
        
        <TabsContent value="preparation" className="space-y-4 mt-4">
          {activeEvent ? (
            <EventPreparation 
              event={activeEvent}
              preparation={eventPreparation}
              onGenerateConversationStarters={handleGenerateConversationStarters}
            />
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No event selected</h3>
                <p className="text-muted-foreground">
                  Select an event to start preparation
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversation Simulator
            </CardTitle>
            <CardDescription>Practice conversations in a safe environment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon in the next update!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Social Strategies
            </CardTitle>
            <CardDescription>Useful strategies for different social scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon in the next update!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialNavigation;
