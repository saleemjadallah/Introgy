
import React, { Suspense, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMeaningfulInteractions } from '@/hooks/useMeaningfulInteractions';

const DeepQuestionsTab = React.lazy(() => import('./meaningful-interactions/DeepQuestionsTab'));
const MessageTemplatesTab = React.lazy(() => import('./meaningful-interactions/MessageTemplatesTab'));
const ConnectionRitualsTab = React.lazy(() => import('./meaningful-interactions/ConnectionRitualsTab'));
const SharedExperiencesTab = React.lazy(() => import('./meaningful-interactions/SharedExperiencesTab'));

// Meaningful Interaction Tools component
const MeaningfulInteractionTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('questions');
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
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="questions">Deep Questions</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="rituals">Connection Rituals</TabsTrigger>
          <TabsTrigger value="experiences">Shared Experiences</TabsTrigger>
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
