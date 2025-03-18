import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BatteryCharging } from "lucide-react";
import { toast } from "sonner";
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { format } from "date-fns";

// Import the refactored components
import EnergyCostDisplay from "./energy-planning/EnergyCostDisplay";
import BatteryLevelDisplay from "./energy-planning/BatteryLevelDisplay";
import LowEnergyWarning from "./energy-planning/LowEnergyWarning";
import TimeScheduler from "./energy-planning/TimeScheduler";
import RechargeActivitiesList from "./energy-planning/RechargeActivitiesList";
import { getRechargeActivities } from "./energy-planning/rechargeActivitiesData";

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
  
  const rechargeActivities = getRechargeActivities();

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
        {/* Energy cost display component */}
        <EnergyCostDisplay energyCost={energyCost} />
        
        {/* Battery level display component */}
        <BatteryLevelDisplay 
          batteryLevel={currentBatteryLevel} 
          onPlanEnergy={handleEnergyPlanning} 
        />
        
        {/* Conditional warning component */}
        {showEnergyWarning && <LowEnergyWarning />}
        
        {/* Time scheduler component */}
        <TimeScheduler 
          quietTimeBefore={quietTimeBefore}
          quietTimeAfter={quietTimeAfter}
          eventDate={eventDate}
          eventDuration={eventDuration}
          onQuietTimeBeforeChange={setQuietTimeBefore}
          onQuietTimeAfterChange={setQuietTimeAfter}
        />
        
        <div className="space-y-4 pt-2 border-t">
          <h3 className="text-base font-medium">Recommended Recharge Activities</h3>
          <RechargeActivitiesList activities={rechargeActivities} />
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyPlanning;
