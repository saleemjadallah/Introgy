
import { Battery } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface BatteryStatusProps {
  batteryLevel: number;
  onLevelChange: (value: number[]) => void;
}

export const getBatteryStatusMessage = (batteryLevel: number) => {
  if (batteryLevel < 20) return "Critical - Time to recharge!";
  if (batteryLevel < 40) return "Low - Consider taking a break soon";
  if (batteryLevel < 60) return "Moderate - Be mindful of your energy";
  if (batteryLevel < 80) return "Good - You have plenty of social energy";
  return "Excellent - Your social battery is fully charged";
};

export const getBatteryColor = (batteryLevel: number) => {
  if (batteryLevel < 20) return "bg-red-500";
  if (batteryLevel < 50) return "bg-orange-500";
  return "bg-green-500";
};

export const BatteryStatus = ({ batteryLevel, onLevelChange }: BatteryStatusProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Battery className="h-5 w-5" />
        Battery Status
      </CardTitle>
      <CardDescription>{getBatteryStatusMessage(batteryLevel)}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Current Level</span>
          <span className="text-sm font-medium">{batteryLevel}%</span>
        </div>
        <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full ${getBatteryColor(batteryLevel)} transition-all duration-500`} 
            style={{ width: `${batteryLevel}%` }}
          />
        </div>
      </div>

      <div>
        <div className="mb-2">
          <span className="text-sm font-medium">Adjust Level Manually</span>
        </div>
        <Slider
          value={[batteryLevel]}
          min={0}
          max={100}
          step={1}
          onValueChange={onLevelChange}
        />
      </div>
    </CardContent>
  </Card>
);
