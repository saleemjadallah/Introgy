
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntrovertGlossary from "@/components/wellbeing/IntrovertGlossary";
import IntrovertMythbusters from "@/components/wellbeing/IntrovertMythbusters";
import FamousIntrovertsGallery from "@/components/wellbeing/FamousIntrovertsGallery";
import { Book, AlertCircle, User, Search, PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWellbeingContent } from "@/hooks/useWellbeingContent";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const EducationCenter = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("glossary");
  const [searchQuery, setSearchQuery] = useState("");
  const [customTerm, setCustomTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { generateContent, isLoading } = useWellbeingContent();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search based on active tab
    console.log(`Searching for ${searchQuery} in ${activeTab}`);
  };
  
  const handleGenerateContent = async () => {
    if (!customTerm.trim()) return;
    
    const contentType = activeTab as 'glossary' | 'mythbuster' | 'famous';
    await generateContent(contentType, customTerm);
    setIsDialogOpen(false);
    setCustomTerm("");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="glossary" onValueChange={setActiveTab} className="w-full">
        <div className="relative overflow-x-auto pb-2">
          <ScrollArea 
            className="w-full" 
            type="scroll" 
            orientation="horizontal"
          >
            <TabsList className="min-w-max wellbeing-container-gradient">
              <TabsTrigger value="glossary" className="whitespace-nowrap data-[state=active]:bg-white/60 hover:text-white">
                <Book className="h-4 w-4 mr-2 text-blueteal" />
                Psychology Glossary
              </TabsTrigger>
              <TabsTrigger value="mythbusters" className="whitespace-nowrap data-[state=active]:bg-white/60 hover:text-white">
                <AlertCircle className="h-4 w-4 mr-2 text-blueteal" />
                Mythbusters
              </TabsTrigger>
              <TabsTrigger value="famous" className="whitespace-nowrap data-[state=active]:bg-white/60 hover:text-white">
                <User className="h-4 w-4 mr-2 text-blueteal" />
                Famous Introverts
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>
        
        <div className="flex items-center justify-between my-4 gap-2">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline">Search</Button>
          </form>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                <span>Generate New</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate AI Content</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <p>Content type: <span className="font-medium capitalize">{activeTab}</span></p>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "glossary" ? 
                      "Enter a psychology term to define" : 
                     activeTab === "mythbusters" ? 
                      "Enter a myth about introverts to debunk" : 
                      "Enter the name of a famous introvert to profile"}
                  </p>
                  <Input 
                    value={customTerm}
                    onChange={(e) => setCustomTerm(e.target.value)}
                    placeholder={activeTab === "glossary" ? 
                      "e.g., Ambivert" : 
                     activeTab === "mythbusters" ? 
                      "e.g., Introverts don't like people" : 
                      "e.g., Albert Einstein"}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleGenerateContent} disabled={isLoading || !customTerm.trim()}>
                  {isLoading ? "Generating..." : "Generate Content"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <TabsContent value="glossary">
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Introvert Psychology Glossary</h3>
            <IntrovertGlossary />
          </div>
        </TabsContent>
        
        <TabsContent value="mythbusters">
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Introvert Mythbusters</h3>
            <IntrovertMythbusters />
          </div>
        </TabsContent>
        
        <TabsContent value="famous">
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Famous Introverts Gallery</h3>
            <FamousIntrovertsGallery />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationCenter;
