
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MindfulMoment } from "@/types/mindfulness";
import { Clock, Pause, Play, SkipForward, Bookmark, X } from "lucide-react";

interface MomentPlayerModalProps {
  isOpen: boolean;
  moment: MindfulMoment | null;
  onClose: () => void;
  onComplete: (momentId: string) => void;
}

const MomentPlayerModal = ({ isOpen, moment, onClose, onComplete }: MomentPlayerModalProps) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (moment) {
      setRemainingTime(moment.duration);
      setProgress(0);
    }
  }, [moment]);
  
  useEffect(() => {
    if (isPlaying && moment) {
      // Start the timer
      intervalRef.current = window.setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsPlaying(false);
            setProgress(100);
            return 0;
          }
          return prev - 1;
        });
        
        setProgress(prev => {
          const newProgress = ((moment.duration - (remainingTime - 1)) / moment.duration) * 100;
          return Math.min(newProgress, 100);
        });
      }, 1000);
      
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [isPlaying, moment, remainingTime]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleSkip = () => {
    if (moment) {
      setProgress(100);
      setRemainingTime(0);
      setIsPlaying(false);
    }
  };
  
  const handleComplete = () => {
    if (moment) {
      onComplete(moment.id);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (!moment) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{moment.title}</DialogTitle>
          <DialogDescription>
            {moment.content.instructions}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(remainingTime)} remaining
              </span>
              <span className="text-muted-foreground">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} />
          </div>
          
          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleSkip}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Guidance text */}
          <div className="bg-muted rounded-md p-4 text-sm max-h-[200px] overflow-y-auto">
            {moment.content.script}
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleComplete}>
            Mark as Completed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MomentPlayerModal;
