
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Info, Share, Bookmark, X } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger, 
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Myth {
  id: number;
  title: string;
  reality: string;
  evidence: string;
  examples?: string;
}

const mythsData: Myth[] = [
  {
    id: 1,
    title: "Introverts are shy or socially anxious",
    reality: "Introversion is about energy source, not social fear. Many introverts are socially confident but simply prefer deeper connections and need alone time to recharge. Shyness is about fear of social judgment, while introversion is about energy management.",
    evidence: "Research by Dr. Jennifer Grimes showing that 30% of introverts score low on social anxiety measures."
  },
  {
    id: 2,
    title: "Introverts don't like people",
    reality: "Introverts often deeply value and enjoy meaningful social connections but prefer quality over quantity in relationships. Many introverts are extremely loyal friends who invest deeply in select relationships.",
    evidence: "Studies showing introverts often maintain longer-lasting close friendships than extroverts."
  },
  {
    id: 3,
    title: "Introversion is something to overcome",
    reality: "Introversion is a natural temperament, not a deficiency. Each personality type has unique strengths and challenges. Introverts excel in careful decision-making, deep thinking, and focused work.",
    evidence: "Research on the evolutionary advantages of having both introverted and extroverted members in social groups."
  },
  {
    id: 4,
    title: "Introverts are poor leaders",
    reality: "Introverts often make exceptional leaders who listen carefully, think before acting, and lead through thoughtful vision rather than charisma alone. They typically empower team members rather than dominating conversations.",
    evidence: "Studies showing teams led by introverts often outperform in situations requiring careful analysis.",
    examples: "Successful introvert leaders like Bill Gates, Angela Merkel, and Warren Buffett."
  },
  {
    id: 5,
    title: "Introverts hate public speaking",
    reality: "Many introverts excel at prepared presentations because they invest time in thorough preparation. While spontaneous speaking might be draining, planned speaking on topics of expertise can be enjoyable.",
    evidence: "Research showing no significant performance difference between introverts and extroverts in prepared speaking.",
    examples: "Susan Cain's TED talk on introversion, which has over 30 million views."
  },
  {
    id: 6,
    title: "Introverts are always quiet and reserved",
    reality: "Many introverts can be quite talkative and animated about subjects that interest them or in comfortable settings. Their quietness is contextual, not constant.",
    evidence: "Studies on situational introversion showing the same person can display different levels of sociability depending on context and energy levels."
  },
  {
    id: 7,
    title: "Introverts don't enjoy parties or social events",
    reality: "Many introverts enjoy social gatherings but prefer different aspects of them—meaningful conversations rather than mingling, smaller gatherings, or events centered around shared interests.",
    evidence: "Survey data showing introverts rate satisfaction with social events based on depth of interaction, not quantity."
  },
  {
    id: 8,
    title: "Introverts are slow decision-makers who overthink everything",
    reality: "Introverts typically process information thoroughly, which can lead to more informed decisions. This reflective approach is a strength, not indecisiveness.",
    evidence: "Research showing introverts often make more accurate predictions when given time to analyze data."
  },
  {
    id: 9,
    title: "You can tell someone is an introvert by observing their behavior",
    reality: "Introversion exists on a spectrum, and many introverts develop social skills that mask their introversion in public. The key difference is where they get energy, not how they appear externally.",
    evidence: "Studies on 'the introvert chameleon effect' where introverts temporarily adapt to social situations despite energy drain."
  },
  {
    id: 10,
    title: "Introverts don't like teamwork",
    reality: "Introverts can be excellent team members, especially in smaller groups with clear roles where their contributions are valued. They often excel at collaborative deep work.",
    evidence: "Research showing introverts often shine in problem-solving teams when given space to process."
  },
  {
    id: 11,
    title: "Introverts are more intelligent than extroverts",
    reality: "There's no correlation between introversion and intelligence. Both personality types show similar IQ distributions, though they may apply their intelligence differently.",
    evidence: "Meta-analyses showing no significant intelligence differences between personality types."
  },
  {
    id: 12,
    title: "Introverts are too sensitive",
    reality: "While some introverts are also Highly Sensitive Persons (HSP), these are separate traits. Introvert sensitivity often manifests as thoughtful consideration rather than emotional reactivity.",
    evidence: "Elaine Aron's research distinguishing HSP from introversion."
  },
  {
    id: 13,
    title: "Introverts have fewer friends because they're less likable",
    reality: "Introverts typically prefer smaller, deeper social networks by choice, not due to likeability. Many people value the listening skills and authenticity introverts often bring to relationships.",
    evidence: "Social network studies showing introverts often have equally strong but less numerous connections."
  },
  {
    id: 14,
    title: "Introverts don't enjoy adventure or new experiences",
    reality: "Many introverts enjoy novelty and adventure but may approach it differently—researching beforehand, preferring one-on-one travel companions, or needing reflection time to process experiences.",
    evidence: "Studies on personality traits and travel preferences across different demographics.",
    examples: "Famous introvert explorers and adventurers like Charles Darwin."
  },
  {
    id: 15,
    title: "You can't be both introverted and extroverted",
    reality: "Many people are ambiverts with qualities of both introversion and extroversion, and most people exist somewhere on a spectrum rather than at the extremes.",
    evidence: "Distribution charts showing most people fall in the middle ranges of personality scales."
  }
];

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
    
    // In a real app, this would use the Web Share API or copy to clipboard
    const shareText = `Myth: "${myth.title}"\nReality: ${myth.reality}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Introvert Myth Debunked',
        text: shareText,
      }).catch(() => {
        // Fallback if sharing fails
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied myth to clipboard");
    }).catch(() => {
      toast.error("Failed to copy. Try manually selecting the text.");
    });
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
              <div key={myth.id} className="group">
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
                          onClick={(e) => handleSaveMyth(myth.id, e)}
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
                          onClick={(e) => handleShareMyth(myth, e)}
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
                          onClick={(e) => openMythDialog(myth, e)}
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
        <DialogContent className="max-w-md max-h-[80vh] overflow-auto">
          {selectedMyth && (
            <>
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
                    onClick={() => handleSaveMyth(selectedMyth.id, {} as React.MouseEvent)}
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
                    onClick={() => handleShareMyth(selectedMyth, {} as React.MouseEvent)}
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntrovertMythbusters;
