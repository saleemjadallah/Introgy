
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Coffee, Utensils, Moon } from "lucide-react";

interface RechargeActivity {
  name: string;
  icon: React.ReactNode;
  description: string;
  time: string;
}

interface RechargeActivitiesListProps {
  activities: RechargeActivity[];
}

const RechargeActivitiesList = ({ activities }: RechargeActivitiesListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {activities.map((activity, index) => (
        <Card key={index} className="border-muted">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              {activity.icon}
            </div>
            <div>
              <h4 className="font-medium">{activity.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
              <p className="text-xs mt-1">{activity.time}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RechargeActivitiesList;
