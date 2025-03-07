
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BatteryStatus } from "@/components/social-battery/BatteryStatus";
import { BatteryHistory } from "@/components/social-battery/BatteryHistory";
import { RechargeActivitiesList, DepletingActivitiesList } from "@/components/social-battery/ActivityLists";
import { useSocialBattery } from "@/hooks/useSocialBattery";

const SocialBattery = () => {
  const { batteryLevel, batteryHistory, handleSliderChange, handleActivitySelect } = useSocialBattery();
  const [selectedTab, setSelectedTab] = useState("current");

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
