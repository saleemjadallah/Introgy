
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { MindfulnessPractice } from "@/types/mindfulness";

interface PracticeCompletionDialogProps {
  practice: MindfulnessPractice;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (effectivenessRating: number, energyChange: number, notes?: string) => void;
}

const PracticeCompletionDialog = ({
  practice,
  isOpen,
  onClose,
  onComplete
}: PracticeCompletionDialogProps) => {
  const [effectivenessRating, setEffectivenessRating] = useState(3);
  const [energyChange, setEnergyChange] = useState(0);
  const [notes, setNotes] = useState("");
  
  const handleSubmit = () => {
    onComplete(effectivenessRating, energyChange, notes || undefined);
    onClose();
    
    // Reset form
    setEffectivenessRating(3);
    setEnergyChange(0);
    setNotes("");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Your Practice</DialogTitle>
          <DialogDescription>
            Share how {practice.title} worked for you
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              How effective was this practice? ({effectivenessRating}/5)
            </label>
            <Slider
              value={[effectivenessRating]}
              min={1}
              max={5}
              step={1}
              onValueChange={(values) => setEffectivenessRating(values[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Not effective</span>
              <span>Very effective</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              How did your energy change?
            </label>
            <Slider
              value={[energyChange]}
              min={-5}
              max={5}
              step={1}
              onValueChange={(values) => setEnergyChange(values[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>More calm</span>
              <span>No change</span>
              <span>More energized</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes (optional)
            </label>
            <Textarea
              id="notes"
              placeholder="Record any insights or experiences..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PracticeCompletionDialog;
