
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntrovertGlossary from "@/components/wellbeing/IntrovertGlossary";
import IntrovertMythbusters from "@/components/wellbeing/IntrovertMythbusters";
import FamousIntrovertsGallery from "@/components/wellbeing/FamousIntrovertsGallery";
import { Book, AlertCircle, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

const EducationCenter = () => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="glossary" className="w-full">
        <div className="relative overflow-x-auto pb-2">
          <ScrollArea 
            className="w-full" 
            type="scroll" 
            orientation="horizontal"
          >
            <TabsList className="min-w-max wellbeing-container-gradient">
              <TabsTrigger value="glossary" className="whitespace-nowrap data-[state=active]:bg-white/60">
                <Book className="h-4 w-4 mr-2 text-blueteal" />
                Psychology Glossary
              </TabsTrigger>
              <TabsTrigger value="mythbusters" className="whitespace-nowrap data-[state=active]:bg-white/60">
                <AlertCircle className="h-4 w-4 mr-2 text-blueteal" />
                Mythbusters
              </TabsTrigger>
              <TabsTrigger value="famous" className="whitespace-nowrap data-[state=active]:bg-white/60">
                <User className="h-4 w-4 mr-2 text-blueteal" />
                Famous Introverts
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
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
