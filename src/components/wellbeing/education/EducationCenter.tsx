
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntrovertGlossary from "@/components/wellbeing/IntrovertGlossary";
import IntrovertMythbusters from "@/components/wellbeing/IntrovertMythbusters";
import FamousIntrovertsGallery from "@/components/wellbeing/FamousIntrovertsGallery";
import { Book, AlertCircle, User } from "lucide-react";

const EducationCenter = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="glossary" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="glossary">
            <Book className="h-4 w-4 mr-2" />
            Psychology Glossary
          </TabsTrigger>
          <TabsTrigger value="mythbusters">
            <AlertCircle className="h-4 w-4 mr-2" />
            Mythbusters
          </TabsTrigger>
          <TabsTrigger value="famous">
            <User className="h-4 w-4 mr-2" />
            Famous Introverts
          </TabsTrigger>
        </TabsList>
        
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
