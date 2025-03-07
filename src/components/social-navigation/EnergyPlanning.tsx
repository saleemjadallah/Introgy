import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BatteryCharging, Clock, Brain, Coffee, Utensils, Moon, AlertCircle } from "lucide-react";
import { format, addMinutes, subMinutes } from "date-fns";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSocialBattery } from "@/hooks/useSocialBattery";

interface EnergyPlanningProps {
  energyCost: number;
  eventDate: Date;
  eventDuration: number;
  batteryLevel?: number; // Added batteryLevel as an optional prop
}

const EnergyPlanning = ({ energyCost, eventDate, eventDuration, batteryLevel: externalBatteryLevel }: EnergyPlanningProps) => {
  const [quietTimeBefore, setQuietTimeBefore] = useState(60); // minutes
  const [quietTimeAfter, setQuietTimeAfter] = useState(90); // minutes
  const { batteryLevel: internalBatteryLevel, handleActivitySelect } = useSocialBattery();
  const [showEnergyWarning, setShowEnergyWarning] = useState(false);
  
  // Use external battery level if provided, otherwise use the one from the hook
  const currentBatteryLevel = externalBatteryLevel !== undefined ? externalBatteryLevel : internalBatteryLevel;
  
  // Check if the user has enough energy for the event
  useEffect(() => {
    // Show warning if energy cost is higher than 70% of current battery level
    setShowEnergyWarning(energyCost * 10 > currentBatteryLevel * 0.7);
  }, [energyCost, currentBatteryLevel]);
  
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

  // Handle planning user energy for this event
  const handleEnergyPlanning = () => {
    // Create a custom recharge activity for the quiet time before
    const preEventRecharge = {
      id: 9999, // A unique ID that won't conflict
      name: "Quiet Time Before Event",
      duration: quietTimeBefore,
      energyGain: Math.min(25, quietTimeBefore / 3), // 1 point per 3 minutes up to 25
      isCustom: true
    };
    
    // Create a custom depleting activity for the event
    const eventDepletion = {
      id: 9998,
      name: "Social Event: " + (eventDate ? format(eventDate, "MMM d") : "Upcoming"),
      duration: eventDuration,
      energyLoss: energyCost * 10, // Convert 1-10 scale to percentage
      isCustom: true
    };
    
    // Schedule these in the social battery
    handleActivitySelect(preEventRecharge);
    handleActivitySelect(eventDepletion);
    
    toast.success("Energy plan added to your Social Battery", {
      description: `Your social battery will be updated with this event's energy impact.`
    });
  };

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
        
        <div className="flex justify-between items-center pt-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">Current Battery Level:</span>
            <span className="text-sm font-medium">{currentBatteryLevel}%</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEnergyPlanning}
            className="text-xs"
          >
            Apply To Battery
          </Button>
        </div>
        
        {showEnergyWarning && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-500">Low Energy Warning</p>
              <p className="text-muted-foreground">This event may drain most of your current social battery. Consider scheduling more recharge time.</p>
            </div>
          </div>
        )}
        
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
