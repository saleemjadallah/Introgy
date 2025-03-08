
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bookmark, Share, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Myth } from "./mythsData";

interface MythDetailDialogProps {
  selectedMyth: Myth | null;
  savedMyths: number[];
  onSave: (mythId: number, event: React.MouseEvent) => void;
  onShare: (myth: Myth, event: React.MouseEvent) => void;
}

const MythDetailDialog = ({ 
  selectedMyth, 
  savedMyths, 
  onSave, 
  onShare 
}: MythDetailDialogProps) => {
  if (!selectedMyth) return null;
  
  return (
    <DialogContent className="max-w-md max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="pr-6">Myth: {selectedMyth.title}</DialogTitle>
        <DialogDescription>
          Debunking common misconceptions about introverts
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 mt-2">
        <div>
          <h4 className="font-semibold text-sm">Reality:</h4>
          <p className="text-sm mt-1">{selectedMyth.reality}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm">Evidence:</h4>
          <p className="text-sm mt-1">{selectedMyth.evidence}</p>
        </div>
        
        {selectedMyth.examples && (
          <div>
            <h4 className="font-semibold text-sm">Examples:</h4>
            <p className="text-sm mt-1">{selectedMyth.examples}</p>
          </div>
        )}
        
        <div className="flex justify-between pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSave(selectedMyth.id, {} as React.MouseEvent)}
            className="gap-1.5"
          >
            <Bookmark 
              className={cn(
                "h-4 w-4", 
                savedMyths.includes(selectedMyth.id) ? "fill-primary text-primary" : ""
              )} 
            />
            {savedMyths.includes(selectedMyth.id) ? "Saved" : "Save"}
          </Button>
          
          <Button 
            onClick={() => onShare(selectedMyth, {} as React.MouseEvent)}
            size="sm"
            className="gap-1.5"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  );
};

export default MythDetailDialog;
