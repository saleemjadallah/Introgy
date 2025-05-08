
import { Battery } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { getBatteryStatusMessage, getBatteryColor } from "@/hooks/social-battery/batteryUtils";
import { AnimatedProgress } from "@/components/animations/AnimatedProgress";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BatteryStatusProps {
  batteryLevel: number;
  onLevelChange: (value: number[]) => void;
}

export const BatteryStatus = ({ batteryLevel, onLevelChange }: BatteryStatusProps) => (
  <motion.div
    initial={{ scale: 0.98, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    whileHover={{ scale: 1.01 }}
    className="w-full"
  >
    <Card className="battery-container-gradient shadow-md hover:shadow-lg transition-shadow">
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
            <span className="text-sm font-medium">Battery Demo</span>
            <span className="text-sm font-medium">{batteryLevel}%</span>
          </div>
          <AnimatedProgress
            value={batteryLevel}
            className="my-1"
            barClassName="battery-indicator-gradient"
            showWaveEffect={true}
            pulseOnChange={true}
            celebrateOnMax={true}
            height={16}
          />
        </div>

        <div>
          <div className="mb-2">
            <span className="text-sm font-medium">Try Adjusting the Level</span>
          </div>
          <Slider
            value={[batteryLevel]}
            min={0}
            max={100}
            step={1}
            onValueChange={onLevelChange}
            className="[&>.relative>div]:bg-[#7DAA92]"
          />
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md text-sm">
          <p className="text-muted-foreground">
            In the Introgy app, your battery level is updated automatically based on your activities, 
            social interactions, and recharge periods. You can also manually adjust it as needed.
          </p>
        </div>
        
        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = "#download-app"}>
            Learn More in the App
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
