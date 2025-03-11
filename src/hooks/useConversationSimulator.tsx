
import { useState } from "react";
import { Scenario, Message } from "@/types/conversation";
import { supabase } from "@/integrations/supabase/client";

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
  const [isProcessing, setIsProcessing] = useState(false);
  
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
    if (!content.trim() || isProcessing) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Show processing state
    setIsProcessing(true);
    
    try {
      // Get conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Send conversation to our edge function or generate locally
      let aiResponse: string;
      
      try {
        // Try to use the edge function for AI-powered responses
        const response = await supabase.functions.invoke("generate-conversation-response", {
          body: {
            userMessage: content,
            scenario: activeScenario,
            conversationHistory
          }
        });
        
        if (response.error) throw new Error(response.error.message);
        
        aiResponse = response.data.response;
      } catch (error) {
        console.warn("Error calling AI function, falling back to local simulation:", error);
        // Fallback to local simulation if edge function fails
        aiResponse = await simulateAIResponse(content, activeScenario!, conversationHistory);
      }
      
      // Add AI response with slight delay to feel more natural
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: aiResponse,
          timestamp: new Date()
        }]);
        setIsProcessing(false);
      }, 800);
    } catch (error) {
      console.error("Error generating response:", error);
      setIsProcessing(false);
    }
  };
  
  const simulateAIResponse = async (
    userMessage: string, 
    scenario: Scenario, 
    conversationHistory: { role: string; content: string }[]
  ): Promise<string> => {
    // This is a fallback that simulates contextual responses when the edge function is unavailable
    
    // Extract key themes from the user's message
    const userMessageLower = userMessage.toLowerCase();
    const userMentionedTopics = [
      "work", "job", "career", "project", "team", "meeting", "interview", 
      "friend", "family", "relationship", "party", "social", "event",
      "boundary", "time", "busy", "stress", "pressure", "help", "support",
      "conflict", "disagreement", "problem", "issue", "challenge"
    ].filter(topic => userMessageLower.includes(topic));
    
    // Generate a response based on scenario context and conversation flow
    let response = "";
    
    // Check if this is early in the conversation (fewer than 4 messages)
    const isEarlyConversation = conversationHistory.filter(msg => msg.role !== "system").length < 4;
    
    // Check if user is asking a question
    const isQuestion = userMessageLower.includes("?") || 
                       userMessageLower.startsWith("what") || 
                       userMessageLower.startsWith("how") || 
                       userMessageLower.startsWith("why") || 
                       userMessageLower.startsWith("when") || 
                       userMessageLower.startsWith("where") || 
                       userMessageLower.startsWith("who") || 
                       userMessageLower.startsWith("can you");
    
    // Responses based on scenario types
    if (scenario.type === "professional") {
      if (isEarlyConversation) {
        if (isQuestion) {
          response = `That's a good question about ${userMentionedTopics[0] || "this topic"}. In a professional context like this, I would say ${scenario.personaType === "direct communicator" ? "it's important to be straightforward." : "we should consider multiple perspectives."}`;
        } else {
          response = `I appreciate your thoughts on ${userMentionedTopics[0] || "this matter"}. Given this ${scenario.name} scenario, could you elaborate more on your ${userMentionedTopics[0] || "approach"}?`;
        }
      } else {
        if (scenario.difficulty === "advanced") {
          response = `That's an interesting perspective. A more nuanced way to look at ${userMentionedTopics[0] || "this"} in this professional setting might involve considering long-term implications. What would that mean for your team?`;
        } else {
          response = `I see your point about ${userMentionedTopics[0] || "that"}. In this professional context, how do you typically handle similar situations?`;
        }
      }
    } else if (scenario.type === "social") {
      if (isEarlyConversation) {
        response = `I really connect with what you're saying about ${userMentionedTopics[0] || "that"}! What else do you enjoy about ${userMentionedTopics[0] || "these kinds of social gatherings"}?`;
      } else {
        response = `That's fascinating! It reminds me of something similar I experienced. How long have you been interested in ${userMentionedTopics[0] || "this"}?`;
      }
    } else if (scenario.type === "challenging") {
      response = `I understand this is important to you, but I need to be clear about ${userMentionedTopics[0] || "my boundaries"}. Perhaps we can find a compromise that works for both of us?`;
    } else if (scenario.type === "daily") {
      response = `I appreciate you bringing that up. In these everyday interactions, it's the small details that matter. Have you considered ${userMentionedTopics[0] ? "other aspects of " + userMentionedTopics[0] : "alternative approaches"}?`;
    }
    
    // If no specific response was generated, use a generic one
    if (!response) {
      const genericResponses = [
        `That's interesting. Could you tell me more about your thoughts on ${userMentionedTopics[0] || "this topic"}?`,
        `I see where you're coming from. How does that relate to your experience with ${userMentionedTopics[0] || "similar situations"}?`,
        `That's a valid point. In my experience, these kinds of ${scenario.type} situations often require careful consideration. What do you think?`,
        `I appreciate your perspective on this. What would you do differently next time in a similar ${scenario.name} scenario?`
      ];
      response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
    
    return response;
  };
  
  const handleEndSimulation = () => {
    // Generate more meaningful feedback based on the conversation
    const messageCount = messages.filter(m => m.role === "user").length;
    let strengths = [];
    let improvementAreas = [];
    let overallScore = 0;
    
    // Extract more meaningful feedback based on conversation patterns
    if (messages.some(m => m.role === "user" && m.content.includes("?"))) {
      strengths.push("Asked good questions to keep the conversation flowing");
    } else {
      improvementAreas.push("Consider asking more questions to engage the other person");
    }
    
    if (messages.some(m => m.role === "user" && m.content.length > 100)) {
      strengths.push("Provided detailed and thorough responses");
    } else {
      strengths.push("Kept responses concise and to the point");
    }
    
    if (messageCount >= 5) {
      strengths.push("Maintained the conversation well with multiple exchanges");
      overallScore += 25;
    } else {
      improvementAreas.push("Work on extending conversations with follow-up comments");
    }
    
    // Add scenario-specific feedback
    if (activeScenario) {
      if (activeScenario.type === "professional") {
        strengths.push("Maintained appropriate professional tone throughout the conversation");
      } else if (activeScenario.type === "challenging") {
        strengths.push("Engaged effectively in a difficult conversational scenario");
        overallScore += 20;
      }
      
      // Difficulty-based feedback
      if (activeScenario.difficulty === "advanced") {
        overallScore += 15;
      }
    }
    
    // Calculate overall score (base 50 + additions)
    overallScore = Math.min(98, Math.max(60, 50 + overallScore + (messageCount * 3)));
    
    // If we don't have enough custom feedback, add some generic ones
    if (strengths.length < 3) {
      const additionalStrengths = [
        "Expressed your viewpoint clearly",
        "Responded appropriately to the conversation context",
        "Demonstrated active listening skills"
      ];
      while (strengths.length < 3) {
        const newStrength = additionalStrengths[strengths.length];
        if (!strengths.includes(newStrength)) {
          strengths.push(newStrength);
        }
      }
    }
    
    if (improvementAreas.length < 3) {
      const additionalImprovements = [
        "Consider acknowledging the other person's perspective more directly",
        "Try using more open-ended questions",
        "Practice more concise responses for this scenario type"
      ];
      while (improvementAreas.length < 3) {
        const newImprovement = additionalImprovements[improvementAreas.length];
        if (!improvementAreas.includes(newImprovement)) {
          improvementAreas.push(newImprovement);
        }
      }
    }
    
    // Set feedback
    setFeedback({
      strengths,
      improvementAreas,
      overallScore,
      engagementLevel: overallScore > 80 ? "Excellent" : overallScore > 70 ? "Good" : "Satisfactory",
      conversationFlow: messageCount > 4 ? "Natural" : "Developing",
      keyLearnings: `You showed ${activeScenario?.difficulty === "advanced" ? "impressive skills" : "strength"} in navigating this ${activeScenario?.type || "conversation"} scenario. With more practice, you'll develop greater confidence in similar situations.`
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
    isProcessing,
    setActiveTab,
    handleScenarioSelect,
    handleStartSimulation,
    handleSendMessage,
    handleEndSimulation,
    handleReset
  };
}
