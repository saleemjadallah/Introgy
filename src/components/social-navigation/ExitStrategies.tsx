
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EventType } from "@/types/events";
import { DoorOpen, Clock, MessagesSquare, Phone, Coffee, HeartPulse } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExitStrategiesProps {
  eventType: EventType;
}

const ExitStrategies = ({ eventType }: ExitStrategiesProps) => {
  // Default exit strategies for all event types
  const strategies = [
    {
      title: "The Time Check",
      description: "Glance at your watch/phone and say: 'I'm sorry, I need to head out soon to make it to another commitment.'",
      duration: "complete",
      icon: <Clock className="h-5 w-5" />,
      context: ["work function", "casual gathering", "formal event", "networking"]
    },
    {
      title: "The Refreshment Break",
      description: "Say you're going to get a drink/snack. You can return later or use this as an opportunity to join another conversation.",
      duration: "brief",
      icon: <Coffee className="h-5 w-5" />,
      context: ["casual gathering", "formal event", "family gathering"]
    },
    {
      title: "The Introduction Handoff",
      description: "Introduce the person to someone else with a shared interest, then excuse yourself.",
      duration: "medium",
      icon: <MessagesSquare className="h-5 w-5" />,
      context: ["networking", "work function", "formal event"]
    },
    {
      title: "The Important Call",
      description: "Say you need to take an important call or check an email. This works best with a pre-set phone alarm.",
      duration: "medium",
      icon: <Phone className="h-5 w-5" />,
      context: ["work function", "casual gathering", "networking"]
    },
    {
      title: "The Energy Acknowledgment",
      description: "Be honest: 'I've enjoyed our conversation, but I'm feeling a bit drained and need some time to recharge.'",
      duration: "complete",
      icon: <HeartPulse className="h-5 w-5" />,
      context: ["casual gathering", "family gathering", "date"]
    }
  ];
  
  // Filter strategies to prioritize those appropriate for the current event type, 
  // but show all as options
  const prioritizedStrategies = [
    ...strategies.filter(s => s.context.includes(eventType)),
    ...strategies.filter(s => !s.context.includes(eventType))
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DoorOpen className="h-5 w-5" />
          Exit Strategies
        </CardTitle>
        <CardDescription>
          Graceful ways to exit conversations or the event when needed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {prioritizedStrategies.map((strategy, index) => (
          <Card key={index} className={`border ${strategy.context.includes(eventType) ? 'border-primary/20' : 'border-muted'}`}>
            <CardHeader className="p-4 pb-2 flex flex-row items-start space-y-0 gap-3">
              <div className={`p-2 rounded-md ${strategy.context.includes(eventType) ? 'bg-primary/10' : 'bg-muted'}`}>
                {strategy.icon}
              </div>
              <div>
                <CardTitle className="text-base">{strategy.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className="capitalize">
                    {strategy.duration === "brief" ? "Brief Pause" : 
                     strategy.duration === "medium" ? "Medium Break" : 
                     "Complete Exit"}
                  </Badge>
                  {strategy.context.includes(eventType) && (
                    <Badge className="bg-primary/20 text-primary border-primary/20">
                      Recommended for this event
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm">{strategy.description}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default ExitStrategies;
