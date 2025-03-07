
import { useState, useEffect } from "react";
import { Battery, Clock, Activity, PlusCircle, MinusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Mock data for recharge activities
const rechargeActivities = [
  { id: 1, name: "Read a book", duration: 30, energyGain: 15 },
  { id: 2, name: "Take a walk alone", duration: 20, energyGain: 10 },
  { id: 3, name: "Listen to calming music", duration: 15, energyGain: 8 },
  { id: 4, name: "Meditate", duration: 10, energyGain: 12 },
  { id: 5, name: "Make a cup of tea", duration: 5, energyGain: 5 },
];

// Mock data for depleting activities
const depletingActivities = [
  { id: 1, name: "Team meeting", duration: 60, energyLoss: 20 },
  { id: 2, name: "Social gathering", duration: 120, energyLoss: 35 },
  { id: 3, name: "Phone call", duration: 15, energyLoss: 10 },
  { id: 4, name: "Video conference", duration: 45, energyLoss: 25 },
  { id: 5, name: "Shopping in crowded store", duration: 30, energyLoss: 15 },
];

const SocialBattery = () => {
  const [batteryLevel, setBatteryLevel] = useState(() => {
    const saved = localStorage.getItem("socialBatteryLevel");
    return saved ? parseInt(saved, 10) : 70;
  });
  
  const [batteryHistory, setBatteryHistory] = useState<{date: Date, level: number}[]>([]);
  const [selectedTab, setSelectedTab] = useState("current");

  // Save battery level to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("socialBatteryLevel", batteryLevel.toString());
    
    // Add to history when battery level changes significantly
    if (batteryHistory.length === 0 || 
        Math.abs(batteryHistory[batteryHistory.length-1].level - batteryLevel) >= 5) {
      setBatteryHistory(prev => [...prev, {date: new Date(), level: batteryLevel}]);
    }
  }, [batteryLevel]);

  const handleSliderChange = (value: number[]) => {
    setBatteryLevel(value[0]);
  };

  const handleActivitySelect = (activity: typeof rechargeActivities[0], isRecharge: boolean) => {
    const newLevel = isRecharge 
      ? Math.min(100, batteryLevel + activity.energyGain) 
      : Math.max(0, batteryLevel - activity.energyLoss);
    
    setBatteryLevel(newLevel);
    
    toast(
      isRecharge 
        ? `Battery recharged by ${activity.energyGain}%` 
        : `Battery depleted by ${activity.energyLoss}%`,
      {
        description: `${activity.name} (${activity.duration} min)`,
      }
    );
  };

  const getBatteryColor = () => {
    if (batteryLevel < 20) return "bg-red-500";
    if (batteryLevel < 50) return "bg-orange-500";
    return "bg-green-500";
  };

  const getBatteryStatusMessage = () => {
    if (batteryLevel < 20) return "Critical - Time to recharge!";
    if (batteryLevel < 40) return "Low - Consider taking a break soon";
    if (batteryLevel < 60) return "Moderate - Be mindful of your energy";
    if (batteryLevel < 80) return "Good - You have plenty of social energy";
    return "Excellent - Your social battery is fully charged";
  };

  const RechargeActivity = ({ activity }: { activity: typeof rechargeActivities[0] }) => (
    <Card className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => handleActivitySelect(activity, true)}>
      <CardHeader className="p-3">
        <CardTitle className="text-base flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-green-500" />
          {activity.name}
        </CardTitle>
      </CardHeader>
      <CardFooter className="p-3 pt-0 flex justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {activity.duration} min
        </span>
        <span className="flex items-center gap-1">
          <Activity className="h-3 w-3" /> +{activity.energyGain}%
        </span>
      </CardFooter>
    </Card>
  );

  const DepletingActivity = ({ activity }: { activity: typeof depletingActivities[0] }) => (
    <Card className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => handleActivitySelect(activity, false)}>
      <CardHeader className="p-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MinusCircle className="h-4 w-4 text-red-500" />
          {activity.name}
        </CardTitle>
      </CardHeader>
      <CardFooter className="p-3 pt-0 flex justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {activity.duration} min
        </span>
        <span className="flex items-center gap-1">
          <Activity className="h-3 w-3" /> -{activity.energyLoss}%
        </span>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Social Battery</h2>
        <p className="text-muted-foreground">Monitor and manage your social energy</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Status</TabsTrigger>
          <TabsTrigger value="recharge">Recharge</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="h-5 w-5" />
                Battery Status
              </CardTitle>
              <CardDescription>{getBatteryStatusMessage()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current Level</span>
                  <span className="text-sm font-medium">{batteryLevel}%</span>
                </div>
                <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getBatteryColor()} transition-all duration-500`} 
                    style={{ width: `${batteryLevel}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2">
                  <span className="text-sm font-medium">Adjust Level Manually</span>
                </div>
                <Slider
                  value={[batteryLevel]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleSliderChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent History</CardTitle>
              <CardDescription>How your energy has changed recently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {batteryHistory.length > 0 ? (
                  batteryHistory.slice(-5).reverse().map((entry, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>
                        {entry.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <Progress value={entry.level} className="w-2/3 h-2" />
                      <span>{entry.level}%</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground text-sm">No history yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recharge" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rechargeActivities.map(activity => (
              <RechargeActivity key={activity.id} activity={activity} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {depletingActivities.map(activity => (
              <DepletingActivity key={activity.id} activity={activity} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialBattery;
