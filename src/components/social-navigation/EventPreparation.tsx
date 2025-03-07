
import React, { useState, useEffect } from "react";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialEvent, EventPreparation as EventPreparationType } from "@/types/events";
import { Battery, Calendar, MapPin, Users, Clock, MessageSquare, DoorOpen, BatteryCharging, Bell, BookOpenText } from "lucide-react";
import ConversationStarters from "./ConversationStarters";
import ExitStrategies from "./ExitStrategies";
import EnergyPlanning from "./EnergyPlanning";
import Boundaries from "./Boundaries";
import PreparationMemo from "./PreparationMemo";

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
  const [countdown, setCountdown] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const eventDate = new Date(event.date);
      
      if (eventDate <= now) {
        setCountdown("Event has started");
        return;
      }
      
      const days = differenceInDays(eventDate, now);
      const hours = differenceInHours(eventDate, now) % 24;
      const minutes = differenceInMinutes(eventDate, now) % 60;
      
      if (days > 0) {
        setCountdown(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m`);
      } else {
        setCountdown(`${minutes}m`);
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [event.date]);

  return (
    <div className="space-y-4">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preparation Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span>Review Event Details</span>
                  <span className="text-green-500">✓</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Generate AI Preparation Memo</span>
                  <span>{preparation?.aiMemo ? "✓" : "Pending"}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Explore Conversation Starters</span>
                  <span>{preparation?.conversationStarters?.length ? "✓" : "Pending"}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Plan Exit Strategies</span>
                  <span>{preparation?.exitStrategies?.length ? "✓" : "Pending"}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Manage Energy Levels</span>
                  <span>{preparation?.energyPlan?.preEventActivities?.length ? "✓" : "Pending"}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Set Personal Boundaries</span>
                  <span>{preparation?.boundaries?.length ? "✓" : "Pending"}</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Complete these steps to prepare for your event.
              </div>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpenText className="h-4 w-4" />
                  AI Preparation Memo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {preparation?.aiMemo 
                    ? "Your AI-generated preparation memo is ready"
                    : "Generate a detailed preparation guide for this event"}
                </p>
                <Button 
                  onClick={() => {
                    if (!preparation?.aiMemo) {
                      onGeneratePreparationMemo();
                    }
                    setActiveTab("memo");
                  }} 
                  size="sm"
                >
                  {preparation?.aiMemo ? "View Memo" : "Generate Memo"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-4 w-4" />
                  Conversation Starters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {preparation?.conversationStarters?.length 
                    ? `You have ${preparation.conversationStarters.length} conversation topics ready`
                    : "Generate topics to discuss at this event"}
                </p>
                <Button 
                  onClick={() => {
                    if (!preparation?.conversationStarters?.length) {
                      onGenerateConversationStarters();
                    }
                    setActiveTab("conversation");
                  }} 
                  size="sm"
                >
                  {preparation?.conversationStarters?.length ? "View Topics" : "Generate Topics"}
                </Button>
              </CardContent>
            </Card>
          </div>
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
    </div>
  );
};

export default EventPreparation;
