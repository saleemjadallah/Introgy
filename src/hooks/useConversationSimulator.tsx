
import { useState } from "react";
import { Scenario, Message } from "@/types/conversation";

export interface SimulationFeedback {
  strengths: string[];
  improvementAreas: string[];
  overallScore: number;
  engagementLevel: string;
  conversationFlow: string;
  keyLearnings: string;
}

export function useConversationSimulator() {
  const [activeTab, setActiveTab] = useState<string>("");
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [simulationInProgress, setSimulationInProgress] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedback, setFeedback] = useState<SimulationFeedback | null>(null);
  
  const handleScenarioSelect = (scenario: Scenario) => {
    setActiveScenario(scenario);
  };
  
  const handleStartSimulation = () => {
    if (!activeScenario) return;
    
    // Reset feedback when starting a new simulation
    setFeedback(null);
    
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
    setActiveTab("");
  };
  
  return {
    activeTab,
    activeScenario,
    simulationInProgress,
    messages,
    feedback,
    setActiveTab,
    handleScenarioSelect,
    handleStartSimulation,
    handleSendMessage,
    handleEndSimulation,
    handleReset
  };
}
