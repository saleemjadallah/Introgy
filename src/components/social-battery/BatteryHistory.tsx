
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BatteryHistoryEntry {
  date: Date;
  level: number;
}

interface BatteryHistoryProps {
  history: BatteryHistoryEntry[];
}

export const BatteryHistory = ({ history }: BatteryHistoryProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent History</CardTitle>
      <CardDescription>How your energy has changed recently</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {history.length > 0 ? (
          history.slice(-5).reverse().map((entry, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>
                {entry.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <Progress value={entry.level} className="w-2/3 h-2" />
              <span>{entry.level}%</span>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground text-sm">No history yet</p>
        )}
      </div>
    </CardContent>
  </Card>
);
