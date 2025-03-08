
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BatteryStatus } from "@/components/social-battery/BatteryStatus";
import { BatteryHistory } from "@/components/social-battery/BatteryHistory";
import { RechargeActivitiesList, DepletingActivitiesList } from "@/components/social-battery/ActivityLists";
import { useSocialBattery } from "@/hooks/useSocialBattery";
import LowBatteryWarning from "@/components/social-navigation/LowBatteryWarning";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { BatteryCharging } from "lucide-react";
import { SleepQualityDialog } from "@/components/social-battery/SleepQualityDialog";

const SocialBattery = () => {
  const { batteryLevel, batteryHistory, handleSliderChange, handleActivitySelect } = useSocialBattery();
  const [selectedTab, setSelectedTab] = useState("current");
  const showWarning = batteryLevel < 20;
  const [showOvernightBadge, setShowOvernightBadge] = useState(false);

  // Check if there was a recent overnight recharge
  useEffect(() => {
    const lastRechargeStr = localStorage.getItem("lastNightlyRecharge");
    if (lastRechargeStr) {
      const lastRecharge = new Date(lastRechargeStr);
      const today = new Date();
      
      // Show badge if the last recharge was today
      if (lastRecharge.getDate() === today.getDate() && 
          lastRecharge.getMonth() === today.getMonth() && 
          lastRecharge.getFullYear() === today.getFullYear()) {
        setShowOvernightBadge(true);
        
        // Hide badge after 15 seconds
        setTimeout(() => setShowOvernightBadge(false), 15000);
      }
    }
  }, []);

  // Toast notification when battery level reaches critical levels
  useEffect(() => {
    if (batteryLevel <= 20) {
      toast.warning("Critical Battery Level", {
        description: "Your social battery is critically low. Consider recharging soon.",
      });
    }
  }, [batteryLevel]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Social Battery</h2>
          <p className="text-muted-foreground">Monitor and manage your social energy</p>
        </div>
        
        {showOvernightBadge && (
          <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1 py-1 px-3">
            <BatteryCharging className="h-3.5 w-3.5" />
            Overnight Recharge Applied
          </Badge>
        )}
      </div>

      {showWarning && <LowBatteryWarning />}
      <SleepQualityDialog />

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
