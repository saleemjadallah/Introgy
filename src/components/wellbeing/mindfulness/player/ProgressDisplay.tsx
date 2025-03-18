
import { Clock, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ProgressDisplayProps {
  elapsedTime: number;
  totalSeconds: number;
  progress: number;
  onProgressChange: (values: number[]) => void;
}

const ProgressDisplay = ({ 
  elapsedTime, 
  totalSeconds, 
  progress, 
  onProgressChange 
}: ProgressDisplayProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {formatTime(elapsedTime)} / {formatTime(totalSeconds)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Volume2 size={16} className="text-muted-foreground" />
          <Slider
            defaultValue={[70]}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>
      
      <Slider
        value={[progress]}
        max={100}
        step={0.1}
        className="w-full"
        onValueChange={onProgressChange}
      />
    </div>
  );
};

export default ProgressDisplay;
