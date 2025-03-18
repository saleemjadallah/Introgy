
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BoundaryTemplates from "./BoundaryTemplates";
import SocialLimits from "./SocialLimits";
import CommunicationGuide from "./CommunicationGuide";
import { useIsMobile } from "@/hooks/use-mobile";
import { Book, PlusCircle, MessageCircle } from "lucide-react";

const BoundaryManager = () => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">Boundary Manager</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create and manage your social boundaries with AI assistance
        </p>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList className={`grid grid-cols-3 w-full ${isMobile ? 'h-auto p-1 gap-1' : ''}`}>
          <TabsTrigger 
            value="templates" 
            className={`${isMobile ? 'flex flex-col items-center gap-1 py-2 h-auto' : ''}`}
          >
            <PlusCircle className="h-4 w-4" />
            <span className={isMobile ? "text-xs mt-1" : "ml-2"}>Templates</span>
          </TabsTrigger>
          <TabsTrigger 
            value="limits" 
            className={`${isMobile ? 'flex flex-col items-center gap-1 py-2 h-auto' : ''}`}
          >
            <Book className="h-4 w-4" />
            <span className={isMobile ? "text-xs mt-1" : "ml-2"}>Limits</span>
          </TabsTrigger>
          <TabsTrigger 
            value="communication" 
            className={`${isMobile ? 'flex flex-col items-center gap-1 py-2 h-auto' : ''}`}
          >
            <MessageCircle className="h-4 w-4" />
            <span className={isMobile ? "text-xs mt-1" : "ml-2"}>Guide</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <BoundaryTemplates />
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <SocialLimits />
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <CommunicationGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BoundaryManager;
