
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { HandPlatter, Clock, Users, Battery } from "lucide-react";

const SocialLimits = () => {
  const [limits, setLimits] = useState({
    weeklyEvents: 3,
    eventDuration: 120,
    groupSize: 5,
    recoveryTime: 24
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HandPlatter className="h-5 w-5" />
            Social Engagement Limits
          </CardTitle>
          <CardDescription>
            Set your comfortable limits for social interactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Weekly Social Events</Label>
                <span className="text-sm font-medium">{limits.weeklyEvents} events</span>
              </div>
              <Slider
                value={[limits.weeklyEvents]}
                onValueChange={(value) => setLimits({ ...limits, weeklyEvents: value[0] })}
                max={10}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Preferred Event Duration</Label>
                <span className="text-sm font-medium">{limits.eventDuration} minutes</span>
              </div>
              <Slider
                value={[limits.eventDuration]}
                onValueChange={(value) => setLimits({ ...limits, eventDuration: value[0] })}
                min={30}
                max={240}
                step={15}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Comfortable Group Size</Label>
                <span className="text-sm font-medium">{limits.groupSize} people</span>
              </div>
              <Slider
                value={[limits.groupSize]}
                onValueChange={(value) => setLimits({ ...limits, groupSize: value[0] })}
                min={1}
                max={15}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Recovery Time Needed</Label>
                <span className="text-sm font-medium">{limits.recoveryTime} hours</span>
              </div>
              <Slider
                value={[limits.recoveryTime]}
                onValueChange={(value) => setLimits({ ...limits, recoveryTime: value[0] })}
                min={1}
                max={72}
                step={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialLimits;
