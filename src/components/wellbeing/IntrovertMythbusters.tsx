
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import { mythsData } from "./mythbusters/mythsData";
import MythItem from "./mythbusters/MythItem";
import MythDetailDialog from "./mythbusters/MythDetailDialog";
import { shareMyth } from "./mythbusters/shareUtils";
import type { Myth } from "./mythbusters/mythsData";

const IntrovertMythbusters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const [selectedMyth, setSelectedMyth] = useState<Myth | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [savedMyths, setSavedMyths] = useState<number[]>([]);
  
  // Filter myths based on search
  const filteredMyths = mythsData.filter(myth => 
    myth.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    myth.reality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveMyth = (mythId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (savedMyths.includes(mythId)) {
      setSavedMyths(savedMyths.filter(id => id !== mythId));
      toast.success("Myth removed from favorites");
    } else {
      setSavedMyths([...savedMyths, mythId]);
      toast.success("Myth saved to favorites");
    }
  };

  const handleShareMyth = (myth: Myth, event: React.MouseEvent) => {
    event.stopPropagation();
    shareMyth(myth);
  };

  const openMythDialog = (myth: Myth, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedMyth(myth);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Many misconceptions about introverts persist in our society, affecting how introverts are 
        perceived and sometimes how they perceive themselves. Explore these common myths and 
        discover the evidence-based reality behind each one.
      </div>
      
      <div className="relative">
        <Input
          type="text"
          placeholder="Search myths..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <TooltipProvider>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {filteredMyths.map((myth) => (
              <MythItem
                key={myth.id}
                myth={myth}
                openPopoverId={openPopoverId}
                setOpenPopoverId={setOpenPopoverId}
                savedMyths={savedMyths}
                onSave={handleSaveMyth}
                onShare={handleShareMyth}
                onViewFull={openMythDialog}
              />
            ))}
            
            {filteredMyths.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No myths match your search.
              </div>
            )}
          </div>
        </ScrollArea>
      </TooltipProvider>

      {/* Full myth detail dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <MythDetailDialog
          selectedMyth={selectedMyth}
          savedMyths={savedMyths}
          onSave={handleSaveMyth}
          onShare={handleShareMyth}
        />
      </Dialog>
    </div>
  );
};

export default IntrovertMythbusters;
