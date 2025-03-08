
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Play, Settings, Award, Brain, X, SendHorizontal, Lightbulb, Pause, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScenarioSelection from "./conversation-simulator/ScenarioSelection";
import ChatInterface from "./conversation-simulator/ChatInterface";
import SimulationFeedback from "./conversation-simulator/SimulationFeedback";
import { Scenario, Difficulty, ConversationLength, PersonaType, Message } from "@/types/conversation";
import { useSocialBattery } from "@/hooks/useSocialBattery";

const ConversationSimulator = () => {
  const [activeTab, setActiveTab] = useState<string>("scenarios");
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [simulationInProgress, setSimulationInProgress] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedback, setFeedback] = useState<any>(null);
  const { batteryLevel } = useSocialBattery();
  
  const handleScenarioSelect = (scenario: Scenario) => {
    setActiveScenario(scenario);
  };
  
  const handleStartSimulation = () => {
    if (!activeScenario) return;
    
    setMessages([
      {
        id: "system-1",
        role: "system",
        content: `You are now starting a conversation in the "${activeScenario.name}" scenario. ${activeScenario.description}`,
        timestamp: new Date()
      },
      {
        id: activeScenario.id + "-intro",
        role: "assistant",
        content: activeScenario.initialMessage,
        timestamp: new Date()
      }
    ]);
    
    setSimulationInProgress(true);
    setActiveTab("simulation");
  };
  
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Simulate AI thinking
    setTimeout(async () => {
      // In a real implementation, this would call an API
      // For now, we'll simulate a response based on the scenario
      const aiResponse = await simulateAIResponse(content, activeScenario!, messages);
      
      setMessages((prev) => [...prev, {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      }]);
    }, 1000);
  };
  
  const simulateAIResponse = async (
    userMessage: string, 
    scenario: Scenario, 
    conversationHistory: Message[]
  ): Promise<string> => {
    // This is a placeholder. In production, this would call an LLM API
    const responseOptions = [
      `That's an interesting point about ${userMessage.split(' ').slice(-3).join(' ')}. What made you think of that?`,
      `I understand what you're saying about ${userMessage.split(' ').slice(0, 3).join(' ')}. Could you elaborate?`,
      `That's a good perspective. In this ${scenario.type} situation, I've found that communication is key.`,
      `I see where you're coming from. How do you usually handle these kinds of conversations?`,
      `That's a valid approach. Have you considered alternative ways to express that?`
    ];
    
    return responseOptions[Math.floor(Math.random() * responseOptions.length)];
  };
  
  const handleEndSimulation = () => {
    // Generate feedback based on the conversation
    setFeedback({
      strengths: [
        "Maintained a positive tone throughout the conversation",
        "Asked good follow-up questions",
        "Expressed your viewpoint clearly"
      ],
      improvementAreas: [
        "Consider using more open-ended questions",
        "Try acknowledging the other person's perspective more directly",
        "You could practice more concise responses for this scenario type"
      ],
      overallScore: 78,
      engagementLevel: "Good",
      conversationFlow: "Natural",
      keyLearnings: "You showed strength in maintaining the conversation flow. With more practice, you'll develop greater confidence in this scenario."
    });
    
    setSimulationInProgress(false);
    setActiveTab("feedback");
  };
  
  const handleReset = () => {
    setActiveScenario(null);
    setMessages([]);
    setFeedback(null);
    setSimulationInProgress(false);
    setActiveTab("scenarios");
  };
  
  // Determine if user can start a simulation based on battery level
  const canStartSimulation = batteryLevel >= 15;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Conversation Simulator
        </CardTitle>
        <CardDescription>
          Practice conversations in a safe environment with our AI-powered simulator
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scenarios" disabled={simulationInProgress}>
              <Settings className="h-4 w-4 mr-2" />
              Scenarios
            </TabsTrigger>
            <TabsTrigger 
              value="simulation" 
              disabled={!activeScenario || (!simulationInProgress && activeTab !== "feedback")}
            >
              <Play className="h-4 w-4 mr-2" />
              Simulation
            </TabsTrigger>
            <TabsTrigger value="feedback" disabled={!feedback}>
              <Award className="h-4 w-4 mr-2" />
              Feedback
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scenarios" className="p-4 min-h-[400px]">
            <ScenarioSelection 
              onScenarioSelect={handleScenarioSelect}
              selectedScenario={activeScenario}
              batteryLevel={batteryLevel}
            />
            
            {activeScenario && (
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleStartSimulation}
                  disabled={!canStartSimulation}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Simulation
                </Button>
              </div>
            )}
            
            {!canStartSimulation && activeScenario && (
              <div className="mt-4 bg-yellow-500/10 p-3 rounded-md text-sm text-yellow-600 dark:text-yellow-400 flex items-start gap-2">
                <Brain className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Your social battery is too low</p>
                  <p>Conversations require at least 15% battery. Take some time to recharge before practicing.</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="simulation" className="p-0 min-h-[500px]">
            <ChatInterface 
              messages={messages}
              onSendMessage={handleSendMessage}
              onEndSimulation={handleEndSimulation}
              scenario={activeScenario}
              isActive={simulationInProgress}
            />
          </TabsContent>
          
          <TabsContent value="feedback" className="p-4 min-h-[400px]">
            <SimulationFeedback 
              feedback={feedback}
              scenario={activeScenario}
              onReset={handleReset}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ConversationSimulator;
