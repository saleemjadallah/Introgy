
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
}

const PlayerControls = ({ isPlaying, onPlayPause }: PlayerControlsProps) => {
  return (
    <div className="flex justify-center items-center gap-3">
      <Button variant="outline" size="icon" disabled>
        <SkipBack size={16} />
      </Button>
      
      <Button 
        size="icon" 
        className="h-12 w-12 rounded-full"
        onClick={onPlayPause}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
      </Button>
      
      <Button variant="outline" size="icon" disabled>
        <SkipForward size={16} />
      </Button>
    </div>
  );
};

export default PlayerControls;
