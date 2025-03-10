
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Activity, PlusCircle, MinusCircle } from "lucide-react";
import { RechargeActivity, DepletingActivity } from "@/types/activity";

interface ActivityCardProps {
  activity: RechargeActivity | DepletingActivity;
  onSelect: (activity: RechargeActivity | DepletingActivity) => void;
}

export const RechargeActivityCard = ({ activity, onSelect }: { activity: RechargeActivity; onSelect: ActivityCardProps["onSelect"] }) => (
  <Card className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => onSelect(activity)}>
    <CardHeader className="p-3">
      <CardTitle className="text-base flex items-center gap-2">
        <PlusCircle className="h-4 w-4 text-green-500" />
        {activity.name}
      </CardTitle>
      {activity.description && (
        <CardDescription className="text-xs mt-1">{activity.description}</CardDescription>
      )}
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

export const DepletingActivityCard = ({ activity, onSelect }: { activity: DepletingActivity; onSelect: ActivityCardProps["onSelect"] }) => (
  <Card className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => onSelect(activity)}>
    <CardHeader className="p-3">
      <CardTitle className="text-base flex items-center gap-2">
        <MinusCircle className="h-4 w-4 text-red-500" />
        {activity.name}
      </CardTitle>
      {activity.description && (
        <CardDescription className="text-xs mt-1">{activity.description}</CardDescription>
      )}
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
