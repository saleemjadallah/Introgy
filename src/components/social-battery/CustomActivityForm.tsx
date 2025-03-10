
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
import { Plus } from "lucide-react";
import { toast } from "sonner";

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4 w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Activity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Activity</DialogTitle>
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
      </DialogContent>
    </Dialog>
  );
};

export default CustomActivityForm;
