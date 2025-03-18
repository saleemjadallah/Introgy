
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Users, Clock, Battery, BookOpenText } from "lucide-react";
import { SocialEvent, EventPreparation as EventPreparationType } from "@/types/events";

interface EventOverviewProps {
  event: SocialEvent;
  preparation: EventPreparationType | null;
  countdown: string;
  batteryLevel: number;
  onGeneratePreparationMemo: () => Promise<void>;
  onGenerateConversationStarters: () => Promise<void>;
  setActiveTab: (tab: string) => void;
}

const EventOverview = ({
  event,
  preparation,
  countdown,
  batteryLevel,
  onGeneratePreparationMemo,
  onGenerateConversationStarters,
  setActiveTab
}: EventOverviewProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
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
              <BookOpenText className="h-4 w-4" />
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
    </div>
  );
};

export default EventOverview;
