
import { Battery } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { getBatteryStatusMessage, getBatteryColor } from "@/hooks/social-battery/batteryUtils";

interface BatteryStatusProps {
  batteryLevel: number;
  onLevelChange: (value: number[]) => void;
}

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
            className={`h-full transition-all duration-500 ${
              batteryLevel > 60 
                ? "bg-[#3E9D9D]" // Soft teal for high battery
                : batteryLevel > 30 
                  ? "bg-[#F5B85E]" // Amber for medium battery
                  : "bg-[#E57373]" // Red for low battery
            }`}
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
          className="[&>.relative>div]:bg-[#3E9D9D]"
        />
      </div>
    </CardContent>
  </Card>
);
