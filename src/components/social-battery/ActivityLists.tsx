
import { useState, useEffect } from "react";
import { 
  RechargeActivity, 
  DepletingActivity, 
  rechargeActivities as defaultRechargeActivities, 
  depletingActivities as defaultDepletingActivities,
  CUSTOM_RECHARGE_ACTIVITIES_KEY,
  CUSTOM_DEPLETING_ACTIVITIES_KEY,
  getStoredCustomActivities
} from "@/types/activity";
import { RechargeActivityCard, DepletingActivityCard } from "./ActivityCards";
import CustomActivityForm from "./CustomActivityForm";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveCustomActivities } from "@/types/activity";
import { toast } from "sonner";

interface ActivityListsProps {
  onActivitySelect: (activity: RechargeActivity | DepletingActivity) => void;
}

export const RechargeActivitiesList = ({ onActivitySelect }: ActivityListsProps) => {
  const [customActivities, setCustomActivities] = useState<RechargeActivity[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    const customRechargeActivities = getStoredCustomActivities<RechargeActivity>(CUSTOM_RECHARGE_ACTIVITIES_KEY);
    setCustomActivities(customRechargeActivities);
  }, [refreshKey]);
  
  const handleDeleteCustomActivity = (id: number) => {
    const filtered = customActivities.filter(activity => activity.id !== id);
    saveCustomActivities(CUSTOM_RECHARGE_ACTIVITIES_KEY, filtered);
    setCustomActivities(filtered);
    toast.success("Activity deleted");
  };

  const handleActivityAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      <CustomActivityForm onActivityAdded={handleActivityAdded} />
      
      <h3 className="text-lg font-medium">Default Activities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defaultRechargeActivities.map(activity => (
          <RechargeActivityCard key={activity.id} activity={activity} onSelect={onActivitySelect} />
        ))}
      </div>
      
      {customActivities.length > 0 && (
        <>
          <h3 className="text-lg font-medium mt-6">Custom Activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customActivities.map(activity => (
              <div key={activity.id} className="relative group">
                <RechargeActivityCard activity={activity} onSelect={onActivitySelect} />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCustomActivity(activity.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const DepletingActivitiesList = ({ onActivitySelect }: ActivityListsProps) => {
  const [customActivities, setCustomActivities] = useState<DepletingActivity[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    const customDepletingActivities = getStoredCustomActivities<DepletingActivity>(CUSTOM_DEPLETING_ACTIVITIES_KEY);
    setCustomActivities(customDepletingActivities);
  }, [refreshKey]);
  
  const handleDeleteCustomActivity = (id: number) => {
    const filtered = customActivities.filter(activity => activity.id !== id);
    saveCustomActivities(CUSTOM_DEPLETING_ACTIVITIES_KEY, filtered);
    setCustomActivities(filtered);
    toast.success("Activity deleted");
  };

  const handleActivityAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      <CustomActivityForm onActivityAdded={handleActivityAdded} />
      
      <h3 className="text-lg font-medium">Default Activities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defaultDepletingActivities.map(activity => (
          <DepletingActivityCard key={activity.id} activity={activity} onSelect={onActivitySelect} />
        ))}
      </div>
      
      {customActivities.length > 0 && (
        <>
          <h3 className="text-lg font-medium mt-6">Custom Activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customActivities.map(activity => (
              <div key={activity.id} className="relative group">
                <DepletingActivityCard activity={activity} onSelect={onActivitySelect} />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCustomActivity(activity.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
