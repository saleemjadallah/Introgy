
import { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Clock, 
  Heart,
  ThumbsUp
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { MindfulnessPractice } from "@/types/mindfulness";
import PracticeCompletionDialog from "./PracticeCompletionDialog";

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
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <div className="flex flex-wrap gap-2">
            {practice.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{practice.description}</p>
          </div>
          
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
          
          <div className="space-y-2">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              className="w-full"
              onValueChange={(values) => {
                setProgress(values[0]);
                setElapsedTime(Math.floor((values[0] / 100) * totalSeconds));
              }}
            />
            
            <div className="flex justify-center items-center gap-3">
              <Button variant="outline" size="icon" disabled>
                <SkipBack size={16} />
              </Button>
              
              <Button 
                size="icon" 
                className="h-12 w-12 rounded-full"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
              </Button>
              
              <Button variant="outline" size="icon" disabled>
                <SkipForward size={16} />
              </Button>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-6">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-8 w-8 bg-primary">
                <Heart size={14} />
              </Avatar>
              <div>
                <p className="text-sm font-medium">Energy Impact</p>
                <p className="text-xs text-muted-foreground">
                  {practice.energyImpact < 0 
                    ? "Calming" 
                    : practice.energyImpact > 0 
                      ? "Energizing" 
                      : "Neutral"}
                </p>
              </div>
            </div>
            
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 bottom-0 left-1/2 ${
                  practice.energyImpact < 0 
                    ? "bg-blue-500" 
                    : practice.energyImpact > 0 
                      ? "bg-amber-500" 
                      : "bg-green-500"
                }`}
                style={{
                  width: `${Math.abs(practice.energyImpact * 10)}%`,
                  left: practice.energyImpact <= 0 ? `${50 - Math.abs(practice.energyImpact * 10)}%` : "50%"
                }}
              />
              <div className="absolute top-0 bottom-0 left-1/2 w-1 -ml-0.5 bg-foreground" />
            </div>
            
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Calming</span>
              <span>Neutral</span>
              <span>Energizing</span>
            </div>
          </div>
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
