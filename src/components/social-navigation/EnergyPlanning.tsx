
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BatteryCharging, Clock, Brain, Coffee, Utensils, Moon } from "lucide-react";
import { format, addMinutes, subMinutes } from "date-fns";
import { useState } from "react";

interface EnergyPlanningProps {
  energyCost: number;
  eventDate: Date;
  eventDuration: number;
}

const EnergyPlanning = ({ energyCost, eventDate, eventDuration }: EnergyPlanningProps) => {
  const [quietTimeBefore, setQuietTimeBefore] = useState(60); // minutes
  const [quietTimeAfter, setQuietTimeAfter] = useState(90); // minutes
  
  const rechargeActivities = [
    {
      name: "Meditation",
      icon: <Brain className="h-5 w-5" />,
      description: "Guided meditation to center your thoughts",
      time: "10-15 minutes"
    },
    {
      name: "Reading",
      icon: <Moon className="h-5 w-5" />,
      description: "Read something enjoyable to relax",
      time: "20+ minutes"
    },
    {
      name: "Caffeine Break",
      icon: <Coffee className="h-5 w-5" />,
      description: "Have tea or coffee in a quiet space",
      time: "15 minutes"
    },
    {
      name: "Light Meal",
      icon: <Utensils className="h-5 w-5" />,
      description: "Eat something light but energizing",
      time: "20 minutes"
    }
  ];
  
  // Calculate the pre and post event quiet times
  const quietTimeStart = subMinutes(eventDate, quietTimeBefore);
  const eventEndTime = addMinutes(eventDate, eventDuration);
  const recoveryTimeEnd = addMinutes(eventEndTime, quietTimeAfter);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BatteryCharging className="h-5 w-5" />
          Energy Planning
        </CardTitle>
        <CardDescription>
          Manage your social battery before and after the event
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Expected Social Energy Cost</span>
            <span className="text-sm font-medium">{energyCost}/10</span>
          </div>
          <Progress value={energyCost * 10} className="h-2" />
          <p className="mt-2 text-sm text-muted-foreground">
            {energyCost <= 3 ? "Low energy event, should be manageable" :
             energyCost <= 6 ? "Moderate energy event, plan for some recovery time" :
             "High energy event, ensure you plan for significant recharge time"}
          </p>
        </div>
        
        <div className="space-y-4 pt-2 border-t">
          <h3 className="text-base font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" /> Schedule Your Recharge Time
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Quiet Time Before Event</Label>
                <span className="text-sm">{quietTimeBefore} min</span>
              </div>
              <Slider 
                value={[quietTimeBefore]} 
                min={15} 
                max={180}
                step={15}
                onValueChange={(value) => setQuietTimeBefore(value[0])}
              />
              <div className="text-sm text-muted-foreground">
                Start quiet time at: {format(quietTimeStart, "h:mm a")}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Recovery Time After Event</Label>
                <span className="text-sm">{quietTimeAfter} min</span>
              </div>
              <Slider 
                value={[quietTimeAfter]} 
                min={30} 
                max={240}
                step={30}
                onValueChange={(value) => setQuietTimeAfter(value[0])}
              />
              <div className="text-sm text-muted-foreground">
                Event ends at approximately: {format(eventEndTime, "h:mm a")}
                <br />
                Recovery time until: {format(recoveryTimeEnd, "h:mm a")}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 pt-2 border-t">
          <h3 className="text-base font-medium">Recommended Recharge Activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rechargeActivities.map((activity, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    {activity.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{activity.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                    <p className="text-xs mt-1">{activity.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyPlanning;
