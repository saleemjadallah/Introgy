
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BookOpen, ExternalLink, Search, X } from "lucide-react";
import { famousIntrovertsData } from "./famousIntroverts/introvertsData";
import type { FamousIntrovert } from "./famousIntroverts/introvertsData";

const FamousIntrovertsGallery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIntrovert, setSelectedIntrovert] = useState<FamousIntrovert | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter introverts based on search
  const filteredIntroverts = famousIntrovertsData.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    person.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.contributions.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (introvert: FamousIntrovert) => {
    setSelectedIntrovert(introvert);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4 font-poppins">
      <div className="text-sm text-muted-foreground mb-4">
        Explore this gallery of notable introverts who have made significant contributions across various fields.
        Their stories demonstrate how introvert traits can be powerful strengths when understood and embraced.
      </div>
      
      <div className="relative">
        <Input
          type="text"
          placeholder="Search by name, profession..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-4">
          {filteredIntroverts.map((person) => (
            <Card 
              key={person.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick(person)}
            >
              <div className="aspect-[3/2] relative overflow-hidden">
                <img 
                  src={person.imageUrl} 
                  alt={person.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-3 text-white">
                    <h3 className="font-semibold">{person.name}</h3>
                    <p className="text-sm text-white/80">{person.profession}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {filteredIntroverts.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No introverts match your search.
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Introvert Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-auto">
          {selectedIntrovert && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-6 font-poppins">{selectedIntrovert.name}</DialogTitle>
                <DialogDescription className="font-poppins">
                  {selectedIntrovert.profession}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-2">
                <div className="aspect-video overflow-hidden rounded-md">
                  <img 
                    src={selectedIntrovert.imageUrl} 
                    alt={selectedIntrovert.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm">Introvert Traits:</h4>
                  <p className="text-sm mt-1">{selectedIntrovert.introvertTraits}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm">Notable Contributions:</h4>
                  <p className="text-sm mt-1">{selectedIntrovert.contributions}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm">How Their Introversion Helped:</h4>
                  <p className="text-sm mt-1">{selectedIntrovert.howIntroversionHelped}</p>
                </div>
                
                {selectedIntrovert.quote && (
                  <div className="border-l-4 border-primary/20 pl-3 italic text-sm">
                    "{selectedIntrovert.quote}"
                  </div>
                )}
                
                {selectedIntrovert.learnMoreUrl && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-1.5 w-full mt-2"
                    onClick={() => window.open(selectedIntrovert.learnMoreUrl, '_blank')}
                  >
                    <BookOpen className="h-4 w-4" />
                    Learn More
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
              
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
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

export default FamousIntrovertsGallery;
