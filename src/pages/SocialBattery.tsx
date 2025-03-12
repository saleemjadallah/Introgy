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
import { PremiumFeatureGuard } from "@/components/premium/PremiumFeatureGuard";
import { usePremium } from "@/contexts/premium";

const SocialBattery = () => {
  const { batteryLevel, batteryHistory, handleSliderChange, handleActivitySelect } = useSocialBattery();
  const [selectedTab, setSelectedTab] = useState("current");
  const showWarning = batteryLevel < 20;
  const [showOvernightBadge, setShowOvernightBadge] = useState(false);
  const { isPremium } = usePremium();

  useEffect(() => {
    const lastRechargeStr = localStorage.getItem("lastNightlyRecharge");
    if (lastRechargeStr) {
      const lastRecharge = new Date(lastRechargeStr);
      const today = new Date();
      
      if (lastRecharge.getDate() === today.getDate() && 
          lastRecharge.getMonth() === today.getMonth() && 
          lastRecharge.getFullYear() === today.getFullYear()) {
        setShowOvernightBadge(true);
        
        setTimeout(() => setShowOvernightBadge(false), 15000);
      }
    }
  }, []);

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
          {isPremium ? (
            <RechargeActivitiesList onActivitySelect={handleActivitySelect} />
          ) : (
            <PremiumFeatureGuard 
              feature="advanced-tracking"
              title="Advanced Recharge Tracking"
              description="Unlock custom recharge activities and advanced tracking by upgrading to premium"
            >
              <RechargeActivitiesList onActivitySelect={handleActivitySelect} />
            </PremiumFeatureGuard>
          )}
        </TabsContent>

        <TabsContent value="activities" className="space-y-4 mt-4">
          {isPremium ? (
            <DepletingActivitiesList onActivitySelect={handleActivitySelect} />
          ) : (
            <PremiumFeatureGuard 
              feature="custom-activities"
              title="Custom Activities"
              description="Create unlimited custom activities with premium"
            >
              <DepletingActivitiesList onActivitySelect={handleActivitySelect} />
            </PremiumFeatureGuard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialBattery;
