
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecurringFrequency } from "@/types/events";

interface RecurringEventOptionsProps {
  isRecurring: boolean;
  recurringFrequency: RecurringFrequency | undefined;
  onRecurringChange: (value: boolean) => void;
  onFrequencyChange: (value: RecurringFrequency) => void;
}

const recurringFrequencies: RecurringFrequency[] = [
  'daily', 
  'weekly', 
  'biweekly', 
  'monthly', 
  'custom'
];

const RecurringEventOptions = ({
  isRecurring,
  recurringFrequency,
  onRecurringChange,
  onFrequencyChange
}: RecurringEventOptionsProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch 
          checked={isRecurring}
          onCheckedChange={(checked) => onRecurringChange(checked)}
        />
        <Label>This is a recurring event</Label>
      </div>
      
      {isRecurring && (
        <div className="space-y-2">
          <Label htmlFor="recurringFrequency">Frequency</Label>
          <Select 
            value={recurringFrequency || "weekly"}
            onValueChange={(value: RecurringFrequency) => onFrequencyChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {recurringFrequencies.map((frequency) => (
                <SelectItem key={frequency} value={frequency}>
                  {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};

export default RecurringEventOptions;
