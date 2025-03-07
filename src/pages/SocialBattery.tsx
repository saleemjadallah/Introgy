
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BatteryStatus } from "@/components/social-battery/BatteryStatus";
import { BatteryHistory } from "@/components/social-battery/BatteryHistory";
import { RechargeActivitiesList, DepletingActivitiesList } from "@/components/social-battery/ActivityLists";
import { RechargeActivity, DepletingActivity, isRechargeActivity } from "@/types/activity";

const SocialBattery = () => {
  const [batteryLevel, setBatteryLevel] = useState(() => {
    const saved = localStorage.getItem("socialBatteryLevel");
    return saved ? parseInt(saved, 10) : 70;
  });
  
  const [batteryHistory, setBatteryHistory] = useState<{date: Date, level: number}[]>(() => {
    const saved = localStorage.getItem("batteryHistory");
    return saved ? JSON.parse(saved).map((item: any) => ({
      ...item,
      date: new Date(item.date)
    })) : [];
  });
  
  const [selectedTab, setSelectedTab] = useState("current");

  // Save battery level to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("socialBatteryLevel", batteryLevel.toString());
    
    // Add to history when battery level changes significantly
    if (batteryHistory.length === 0 || 
        Math.abs(batteryHistory[batteryHistory.length-1].level - batteryLevel) >= 5) {
      const newHistory = [...batteryHistory, {date: new Date(), level: batteryLevel}];
      setBatteryHistory(newHistory);
      localStorage.setItem("batteryHistory", JSON.stringify(newHistory));
    }
  }, [batteryLevel]);

  const handleSliderChange = (value: number[]) => {
    setBatteryLevel(value[0]);
  };

  const handleActivitySelect = (activity: RechargeActivity | DepletingActivity) => {
    let energyChange: number;
    let isRecharge: boolean;
    
    if (isRechargeActivity(activity)) {
      energyChange = activity.energyGain;
      isRecharge = true;
    } else {
      energyChange = activity.energyLoss;
      isRecharge = false;
    }
    
    const newLevel = isRecharge 
      ? Math.min(100, batteryLevel + energyChange) 
      : Math.max(0, batteryLevel - energyChange);
    
    setBatteryLevel(newLevel);
    
    toast(
      isRecharge 
        ? `Battery recharged by ${energyChange}%` 
        : `Battery depleted by ${energyChange}%`,
      {
        description: `${activity.name} (${activity.duration} min)`,
      }
    );
  };

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
          <BatteryStatus 
            batteryLevel={batteryLevel} 
            onLevelChange={handleSliderChange} 
          />
          <BatteryHistory history={batteryHistory} />
        </TabsContent>

        <TabsContent value="recharge" className="space-y-4 mt-4">
          <RechargeActivitiesList onActivitySelect={handleActivitySelect} />
        </TabsContent>

        <TabsContent value="activities" className="space-y-4 mt-4">
          <DepletingActivitiesList onActivitySelect={handleActivitySelect} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialBattery;
