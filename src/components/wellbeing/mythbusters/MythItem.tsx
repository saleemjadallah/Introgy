
import { useState } from "react";
import { Bookmark, Info, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { type Myth } from "./mythsData";

interface MythItemProps {
  myth: Myth;
  openPopoverId: number | null;
  setOpenPopoverId: (id: number | null) => void;
  savedMyths: number[];
  onSave: (mythId: number, event: React.MouseEvent) => void;
  onShare: (myth: Myth, event: React.MouseEvent) => void;
  onViewFull: (myth: Myth, event: React.MouseEvent) => void;
}

const MythItem = ({
  myth,
  openPopoverId,
  setOpenPopoverId,
  savedMyths,
  onSave,
  onShare,
  onViewFull
}: MythItemProps) => {
  return (
    <div className="group">
      <Popover 
        open={openPopoverId === myth.id} 
        onOpenChange={(open) => {
          setOpenPopoverId(open ? myth.id : null);
        }}
      >
        <PopoverTrigger asChild>
          <button className="text-sm font-medium w-full text-left hover:text-primary border-b border-border py-2 flex items-center justify-between group-hover:border-primary transition-colors duration-200">
            <div className="flex items-center gap-1.5">
              <span className="line-clamp-1">
                {myth.title}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground inline-flex" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Click to view details</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={(e) => onSave(myth.id, e)}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Bookmark 
                      className={cn(
                        "h-3.5 w-3.5", 
                        savedMyths.includes(myth.id) ? "fill-primary text-primary" : "text-muted-foreground"
                      )} 
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">
                      {savedMyths.includes(myth.id) ? "Remove from favorites" : "Save to favorites"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={(e) => onShare(myth, e)}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Share className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Share this myth</p>
                  </TooltipContent>
                </Tooltip>
              </Button>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="max-w-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Myth: {myth.title}</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => onViewFull(myth, e)}
              >
                View Full
              </Button>
            </div>
            <p className="text-sm">
              <span className="font-medium">Reality: </span>
              {myth.reality}
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MythItem;
