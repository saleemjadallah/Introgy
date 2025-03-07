
import { RechargeActivity, DepletingActivity, rechargeActivities, depletingActivities } from "@/types/activity";
import { RechargeActivityCard, DepletingActivityCard } from "./ActivityCards";

interface ActivityListsProps {
  onActivitySelect: (activity: RechargeActivity | DepletingActivity) => void;
}

export const RechargeActivitiesList = ({ onActivitySelect }: ActivityListsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {rechargeActivities.map(activity => (
      <RechargeActivityCard key={activity.id} activity={activity} onSelect={onActivitySelect} />
    ))}
  </div>
);

export const DepletingActivitiesList = ({ onActivitySelect }: ActivityListsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {depletingActivities.map(activity => (
      <DepletingActivityCard key={activity.id} activity={activity} onSelect={onActivitySelect} />
    ))}
  </div>
);
