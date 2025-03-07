
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface LowBatteryWarningProps {
  className?: string;
}

const LowBatteryWarning = ({ className = "mb-4" }: LowBatteryWarningProps) => {
  return (
    <Card className={`bg-red-500/10 border-red-500/20 ${className}`}>
      <CardContent className="p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-500">Low Social Battery</h3>
          <p className="text-sm text-muted-foreground">Your social battery is currently low. Consider rescheduling or ensuring you have enough recharge time.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LowBatteryWarning;
