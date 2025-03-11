
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeepQuestionsTab from './meaningful-interactions/DeepQuestionsTab';
import MessageTemplatesTab from './meaningful-interactions/MessageTemplatesTab';
import ConnectionRitualsTab from './meaningful-interactions/ConnectionRitualsTab';
import SharedExperiencesTab from './meaningful-interactions/SharedExperiencesTab';
import { DeepQuestion, MessageTemplate, ConnectionRitual, SharedExperience } from '@/types/meaningful-interactions';
import { useAIMeaningfulInteractions } from '@/hooks/useAIMeaningfulInteractions';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, MessageSquare, Users, Sparkles } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

const MeaningfulInteractionTools = () => {
  const [activeTab, setActiveTab] = useState("questions");
  const [interactionData, setInteractionData] = useState<{
    questions: DeepQuestion[];
    templates: MessageTemplate[];
    rituals: ConnectionRitual[];
    experiences: SharedExperience[];
  }>({
    questions: [],
    templates: [],
    rituals: [],
    experiences: []
  });

  const { generateInteraction, isLoading } = useAIMeaningfulInteractions();

  const generateQuestion = async () => {
    const context = "building deeper connections with friends";
    const data = await generateInteraction('question', context);
    
    if (data) {
      const newQuestion: DeepQuestion = {
        id: uuidv4(),
        text: data.content,
        category: "Personal Growth",
        depthLevel: 2,
        topics: ["connection", "friendship"],
        relationshipTypes: ["friend", "family"],
        energyRequired: 3,
        followUps: []
      };
      
      setInteractionData(prev => ({
        ...prev,
        questions: [newQuestion, ...prev.questions]
      }));
    }
  };

  const generateTemplate = async () => {
    const context = "expressing gratitude to a friend";
    const data = await generateInteraction('template', context);
    
    if (data) {
      const newTemplate: MessageTemplate = {
        id: uuidv4(),
        purpose: "Gratitude Expression",
        baseTemplate: data.content,
        variables: [],
        tone: "warm",
        energyRequired: 2,
        relationshipStage: "established"
      };
      
      setInteractionData(prev => ({
        ...prev,
        templates: [newTemplate, ...prev.templates]
      }));
    }
  };

  const generateRitual = async () => {
    const context = "maintaining friendship connections";
    const data = await generateInteraction('ritual', context);
    
    if (data) {
      const newRitual: ConnectionRitual = {
        id: uuidv4(),
        name: "Friendship Check-in",
        description: data.content,
        frequency: { unit: "weeks", value: 2, flexibility: 2 },
        interactionType: "call",
        duration: 30,
        structure: "Casual conversation with specific topics",
        prompts: [],
        energyCost: 3,
        relationshipTypes: ["friend"]
      };
      
      setInteractionData(prev => ({
        ...prev,
        rituals: [newRitual, ...prev.rituals]
      }));
    }
  };

  const generateExperience = async () => {
    const context = "shared experiences with friends";
    const data = await generateInteraction('experience', context);
    
    if (data) {
      const newExperience: SharedExperience = {
        id: uuidv4(),
        title: "Shared Experience",
        category: "Activity",
        description: data.content,
        interestTags: ["friendship", "connection"],
        timeRequired: 60,
        energyRequired: 3,
        discussionPrompts: [],
        relationshipTypes: ["friend", "family"]
      };
      
      setInteractionData(prev => ({
        ...prev,
        experiences: [newExperience, ...prev.experiences]
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Meaningful Interaction Tools</h2>
        <p className="text-muted-foreground">
          AI-powered tools to create deeper connections with less effort
        </p>
      </div>

      <Tabs defaultValue="questions" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="questions" className="flex items-center gap-1.5">
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">Deep Questions</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Message Templates</span>
          </TabsTrigger>
          <TabsTrigger value="rituals" className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Connection Rituals</span>
          </TabsTrigger>
          <TabsTrigger value="experiences" className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Shared Experiences</span>
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="pt-6">
            <TabsContent value="questions" className="mt-0">
              <DeepQuestionsTab 
                questions={interactionData.questions} 
                onGenerate={generateQuestion}
                isLoading={isLoading && activeTab === "questions"}
              />
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              <MessageTemplatesTab 
                templates={interactionData.templates} 
                onGenerate={generateTemplate}
                isLoading={isLoading && activeTab === "templates"}
              />
            </TabsContent>

            <TabsContent value="rituals" className="mt-0">
              <ConnectionRitualsTab 
                rituals={interactionData.rituals} 
                onGenerate={generateRitual}
                isLoading={isLoading && activeTab === "rituals"}
              />
            </TabsContent>

            <TabsContent value="experiences" className="mt-0">
              <SharedExperiencesTab 
                experiences={interactionData.experiences} 
                onGenerate={generateExperience}
                isLoading={isLoading && activeTab === "experiences"}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default MeaningfulInteractionTools;
