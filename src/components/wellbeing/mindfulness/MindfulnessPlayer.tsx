
import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MindfulnessPractice } from "@/types/mindfulness";
import PracticeCompletionDialog from "./PracticeCompletionDialog";
import PlayerControls from "./player/PlayerControls";
import ProgressDisplay from "./player/ProgressDisplay";
import EnergyImpactVisual from "./player/EnergyImpactVisual";
import PracticeInfo from "./player/PracticeInfo";

interface MindfulnessPlayerProps {
  practice: MindfulnessPractice;
  onComplete: (effectivenessRating: number, energyChange: number, notes?: string) => void;
  isPreviouslyCompleted: boolean;
}

const MindfulnessPlayer = ({ 
  practice,
  onComplete,
  isPreviouslyCompleted
}: MindfulnessPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Simulated player functionality
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Start progress simulation
      const interval = setInterval(() => {
        setProgress(current => {
          if (current >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            setIsDialogOpen(true);
            return 100;
          }
          
          const newProgress = current + (100 / (practice.duration * 60));
          setElapsedTime(Math.floor((newProgress / 100) * practice.duration * 60));
          return newProgress;
        });
      }, 1000);
      
      // Store interval ID to clear on component unmount
      return () => clearInterval(interval);
    }
  };
  
  const handleProgressChange = (values: number[]) => {
    setProgress(values[0]);
    setElapsedTime(Math.floor((values[0] / 100) * totalSeconds));
  };
  
  const totalSeconds = practice.duration * 60;
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{practice.title}</CardTitle>
              <CardDescription>
                {practice.category} • {practice.duration} min
              </CardDescription>
            </div>
            {isPreviouslyCompleted && (
              <Badge variant="outline" className="flex items-center gap-1">
                <ThumbsUp size={12} />
                <span>Completed</span>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <PracticeInfo practice={practice} />
          
          <ProgressDisplay 
            elapsedTime={elapsedTime}
            totalSeconds={totalSeconds}
            progress={progress}
            onProgressChange={handleProgressChange}
          />
          
          <PlayerControls 
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
          
          <EnergyImpactVisual energyImpact={practice.energyImpact} />
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(true)}>
            Mark as Completed
          </Button>
        </CardFooter>
      </Card>
      
      <PracticeCompletionDialog
        practice={practice}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onComplete={onComplete}
      />
    </>
  );
};

export default MindfulnessPlayer;
