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
import { usePremium } from "@/contexts/premium";
import { PremiumFeatureGuard } from "@/components/premium/PremiumFeatureGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EducationCenter = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("glossary");
  const [searchQuery, setSearchQuery] = useState("");
  const [customTerm, setCustomTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { generateContent, isLoading } = useWellbeingContent();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  
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
            <TabsList className="min-w-max wellbeing-container-gradient shadow-md border border-white/40">
              <TabsTrigger value="glossary" className="whitespace-nowrap data-[state=active]:bg-white/60 data-[state=active]:text-blueteal hover:text-white">
                <Book className="h-4 w-4 mr-2 text-blueteal" />
                Psychology Glossary
              </TabsTrigger>
              <TabsTrigger value="mythbusters" className="whitespace-nowrap data-[state=active]:bg-white/60 data-[state=active]:text-blueteal hover:text-white">
                <AlertCircle className="h-4 w-4 mr-2 text-blueteal" />
                Mythbusters
              </TabsTrigger>
              <TabsTrigger value="famous" className="whitespace-nowrap data-[state=active]:bg-white/60 data-[state=active]:text-blueteal hover:text-white">
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
                <span className={isMobile ? "sr-only" : ""}>Generate New</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl max-w-[90vw] w-full sm:max-w-md bg-white/60 backdrop-blur-md border border-white/40 shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-center text-blueteal font-medium">Generate AI Content</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <p className="text-center font-medium">
                    Content type: <span className="text-blueteal capitalize">{activeTab}</span>
                  </p>
                  <p className="text-sm text-muted-foreground text-center px-2">
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
                    className="w-full rounded-lg border-blueteal/30 focus:border-blueteal"
                  />
                </div>
              </div>
              <DialogFooter className="flex sm:flex-row justify-center">
                <Button 
                  onClick={handleGenerateContent} 
                  disabled={isLoading || !customTerm.trim()}
                  className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-blueteal to-blueteal/80 hover:from-blueteal/90 hover:to-blueteal/70 text-white transition-all"
                >
                  {isLoading ? "Generating..." : "Generate Content"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {!isPremium && (
          <Alert className="mb-4 bg-muted/50 border border-primary/20">
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Free plan includes basic glossary and introvert fundamentals.</span>
              <Button 
                size="sm" 
                onClick={() => navigate("/profile?tab=pricing")}
                className="whitespace-nowrap"
              >
                <Star className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <TabsContent value="glossary">
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Introvert Psychology Glossary</h3>
            <IntrovertGlossary />
          </div>
        </TabsContent>
        
        <TabsContent value="mythbusters">
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Introvert Mythbusters</h3>
            {isPremium ? (
              <IntrovertMythbusters />
            ) : (
              <PremiumFeatureGuard
                feature="advanced-content"
                title="Premium Feature"
                description="Access to the complete Introvert Mythbusters gallery requires a premium subscription"
              >
                <IntrovertMythbusters />
              </PremiumFeatureGuard>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="famous">
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Famous Introverts Gallery</h3>
            {isPremium ? (
              <FamousIntrovertsGallery />
            ) : (
              <PremiumFeatureGuard
                feature="complete-galleries"
                title="Premium Feature" 
                description="Access to the Famous Introverts gallery requires a premium subscription"
              >
                <FamousIntrovertsGallery />
              </PremiumFeatureGuard>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationCenter;
