import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RechargeActivity, 
  DepletingActivity, 
  CUSTOM_RECHARGE_ACTIVITIES_KEY,
  CUSTOM_DEPLETING_ACTIVITIES_KEY,
  getStoredCustomActivities,
  saveCustomActivities,
  getNextCustomActivityId
} from "@/types/activity";
import { Plus, Lock } from "lucide-react";
import { toast } from "sonner";
import { usePremium } from "@/contexts/premium";
import { useNavigate } from "react-router-dom";

const CustomActivityForm = ({ 
  onActivityAdded 
}: { 
  onActivityAdded: () => void 
}) => {
  const [open, setOpen] = useState(false);
  const [activityType, setActivityType] = useState<"recharge" | "depleting">("recharge");
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(15);
  const [energyValue, setEnergyValue] = useState(10);
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  
  const customActivitiesCount = () => {
    const rechargeActivities = getStoredCustomActivities<RechargeActivity>(CUSTOM_RECHARGE_ACTIVITIES_KEY);
    const depletingActivities = getStoredCustomActivities<DepletingActivity>(CUSTOM_DEPLETING_ACTIVITIES_KEY);
    return rechargeActivities.length + depletingActivities.length;
  };
  
  const isLimitReached = !isPremium && customActivitiesCount() >= 2;

  const handleAddClick = () => {
    if (isLimitReached) {
      toast.error("Free plan limit reached", {
        description: "Upgrade to premium for unlimited custom activities"
      });
      return;
    }
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter an activity name");
      return;
    }

    if (duration <= 0) {
      toast.error("Duration must be greater than 0");
      return;
    }

    if (energyValue <= 0) {
      toast.error("Energy value must be greater than 0");
      return;
    }

    if (activityType === "recharge") {
      const customRechargeActivities = getStoredCustomActivities<RechargeActivity>(CUSTOM_RECHARGE_ACTIVITIES_KEY);
      
      // Check free plan limits
      if (!isPremium && customRechargeActivities.length >= 1) {
        toast.error("Free plan limit reached", {
          description: "Upgrade to premium for unlimited recharge activities"
        });
        return;
      }
      
      const newActivity: RechargeActivity = {
        id: getNextCustomActivityId([...customRechargeActivities]),
        name: name.trim(),
        duration,
        energyGain: energyValue,
        isCustom: true
      };
      saveCustomActivities(CUSTOM_RECHARGE_ACTIVITIES_KEY, [...customRechargeActivities, newActivity]);
      toast.success("Recharge activity added");
    } else {
      const customDepletingActivities = getStoredCustomActivities<DepletingActivity>(CUSTOM_DEPLETING_ACTIVITIES_KEY);
      
      // Check free plan limits
      if (!isPremium && customDepletingActivities.length >= 1) {
        toast.error("Free plan limit reached", {
          description: "Upgrade to premium for unlimited depleting activities"
        });
        return;
      }
      
      const newActivity: DepletingActivity = {
        id: getNextCustomActivityId([...customDepletingActivities]),
        name: name.trim(),
        duration,
        energyLoss: energyValue,
        isCustom: true
      };
      saveCustomActivities(CUSTOM_DEPLETING_ACTIVITIES_KEY, [...customDepletingActivities, newActivity]);
      toast.success("Depleting activity added");
    }

    // Reset form
    setName("");
    setDuration(15);
    setEnergyValue(10);
    
    // Close dialog
    setOpen(false);
    
    // Notify parent for reloading activities
    onActivityAdded();
  };

  const handleUpgradeClick = () => {
    setOpen(false);
    navigate("/profile?tab=pricing");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        variant="outline" 
        className="mb-4 w-full"
        onClick={handleAddClick}
      >
        {isLimitReached ? (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Upgrade for More Activities
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Add Custom Activity {!isPremium && `(${customActivitiesCount()}/2)`}
          </>
        )}
      </Button>
      <DialogContent>
        {isLimitReached ? (
          <>
            <DialogHeader>
              <DialogTitle>Premium Feature</DialogTitle>
            </DialogHeader>
            <div className="py-6 text-center">
              <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Free Plan Limit Reached</h3>
              <p className="text-muted-foreground mb-4">
                You've reached the limit of 2 custom activities on the free plan.
                Upgrade to Premium for unlimited custom activities and advanced tracking.
              </p>
              <Button onClick={handleUpgradeClick} className="w-full">
                Upgrade to Premium
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add Custom Activity {!isPremium && `(${customActivitiesCount()}/2)`}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <Tabs value={activityType} onValueChange={(value) => setActivityType(value as "recharge" | "depleting")}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="recharge">Recharge</TabsTrigger>
                  <TabsTrigger value="depleting">Depleting</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Activity Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Take a nap"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="energy">
                    {activityType === "recharge" ? "Energy Gain (%)" : "Energy Loss (%)"}
                  </Label>
                  <Input
                    id="energy"
                    type="number"
                    min="1"
                    max="100"
                    value={energyValue}
                    onChange={(e) => setEnergyValue(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Activity</Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomActivityForm;
