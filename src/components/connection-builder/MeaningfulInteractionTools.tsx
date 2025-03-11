
import React, { Suspense, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMeaningfulInteractions } from '@/hooks/useMeaningfulInteractions';
import { MessageSquare, MessageSquareText, Heart, Image } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const DeepQuestionsTab = React.lazy(() => import('./meaningful-interactions/DeepQuestionsTab'));
const MessageTemplatesTab = React.lazy(() => import('./meaningful-interactions/MessageTemplatesTab'));
const ConnectionRitualsTab = React.lazy(() => import('./meaningful-interactions/ConnectionRitualsTab'));
const SharedExperiencesTab = React.lazy(() => import('./meaningful-interactions/SharedExperiencesTab'));

// Meaningful Interaction Tools component
const MeaningfulInteractionTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('questions');
  const isMobile = useIsMobile();
  const { 
    questions,
    messageTemplates,
    rituals,
    experiences,
    isLoading,
    // Include other properties and functions as needed
  } = useMeaningfulInteractions();

  // Fallback component for lazy loading
  const LoadingFallback = () => (
    <div className="flex justify-center items-center p-12">
      <div className="space-y-2 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    </div>
  );

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Meaningful Interaction Tools</h2>
        <p className="text-muted-foreground">
          Tools and resources to create more meaningful connections with the people in your life
        </p>
      </div>
      
      <Tabs defaultValue="questions" onValueChange={handleTabChange} className="w-full">
        <TabsList className={`grid grid-cols-4 mb-4 ${isMobile ? 'h-auto p-2 gap-1' : ''}`}>
          <TabsTrigger value="questions" className={`${isMobile ? 'flex flex-col items-center gap-1 py-2 h-auto' : ''}`}>
            <MessageSquare className="h-4 w-4" />
            <span className={isMobile ? "text-xs mt-1" : "ml-2"}>Questions</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className={`${isMobile ? 'flex flex-col items-center gap-1 py-2 h-auto' : ''}`}>
            <MessageSquareText className="h-4 w-4" />
            <span className={isMobile ? "text-xs mt-1" : "ml-2"}>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="rituals" className={`${isMobile ? 'flex flex-col items-center gap-1 py-2 h-auto' : ''}`}>
            <Heart className="h-4 w-4" />
            <span className={isMobile ? "text-xs mt-1" : "ml-2"}>Rituals</span>
          </TabsTrigger>
          <TabsTrigger value="experiences" className={`${isMobile ? 'flex flex-col items-center gap-1 py-2 h-auto' : ''}`}>
            <Image className="h-4 w-4" />
            <span className={isMobile ? "text-xs mt-1" : "ml-2"}>Experiences</span>
          </TabsTrigger>
        </TabsList>
        
        <Suspense fallback={<LoadingFallback />}>
          <TabsContent value="questions" className="space-y-4">
            {activeTab === 'questions' && <DeepQuestionsTab questions={questions} />}
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            {activeTab === 'templates' && <MessageTemplatesTab templates={messageTemplates} />}
          </TabsContent>
          
          <TabsContent value="rituals" className="space-y-4">
            {activeTab === 'rituals' && <ConnectionRitualsTab rituals={rituals} />}
          </TabsContent>
          
          <TabsContent value="experiences" className="space-y-4">
            {activeTab === 'experiences' && <SharedExperiencesTab experiences={experiences} />}
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  );
};

export default MeaningfulInteractionTools;
