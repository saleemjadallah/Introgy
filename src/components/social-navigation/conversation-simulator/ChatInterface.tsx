
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Scenario, Message } from "@/types/conversation";
import { SendHorizontal, Lightbulb, Pause, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onEndSimulation: () => void;
  scenario: Scenario | null;
  isActive: boolean;
  isProcessing?: boolean;
}

const ChatInterface = ({ 
  messages, 
  onSendMessage, 
  onEndSimulation,
  scenario,
  isActive,
  isProcessing = false
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim() || !isActive || isProcessing) return;
    
    onSendMessage(inputValue);
    setInputValue("");
    setShowHint(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const generateHint = () => {
    // Generate context-aware hints based on the scenario type
    const hintsMap = {
      professional: [
        "Try using more formal language appropriate for this professional setting.",
        "Consider acknowledging their expertise or position in your response.",
        "This might be a good time to ask about specific goals or timelines.",
        "Try to focus on solutions rather than problems in this professional context.",
        "Consider how your response might impact the professional relationship."
      ],
      social: [
        "This is a casual setting - try asking about their interests or hobbies.",
        "Consider sharing a related personal anecdote to build rapport.",
        "This might be a good moment to find common ground on a shared interest.",
        "Try using more casual, friendly language in this social context.",
        "Consider asking an open-ended question about their weekend or recent activities."
      ],
      challenging: [
        "Remember to acknowledge their feelings first before stating your perspective.",
        "Try using 'I' statements rather than 'you' statements to avoid sounding accusatory.",
        "Consider offering a specific compromise that meets both your needs.",
        "This might be a good moment to set a boundary clearly but respectfully.",
        "Try to focus on the specific issue rather than generalizing the problem."
      ],
      daily: [
        "Everyday interactions benefit from warm, friendly language.",
        "Consider how you can make this mundane interaction more personal.",
        "Try asking a question that shows interest in them as a person.",
        "Consider if humor might lighten this everyday interaction.",
        "This is a good opportunity to practice active listening by acknowledging what they've said."
      ]
    };
    
    const scenarioType = scenario?.type || "social";
    const hints = hintsMap[scenarioType as keyof typeof hintsMap] || hintsMap.social;
    
    setHint(hints[Math.floor(Math.random() * hints.length)]);
    setShowHint(true);
  };
  
  return (
    <div className="flex flex-col h-[600px]">
      {/* Scenario header */}
      {scenario && (
        <div className="bg-muted/50 p-3 border-b">
          <h3 className="text-sm font-medium">{scenario.name}</h3>
          <p className="text-xs text-muted-foreground">{scenario.personaType} • {scenario.difficulty} • {scenario.duration}</p>
        </div>
      )}
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.filter(m => m.role !== "system").map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex flex-col max-w-[80%] space-y-1",
              message.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div
              className={cn(
                "rounded-lg px-4 py-2",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {message.content}
            </div>
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex max-w-[80%] mr-auto">
            <div className="bg-muted rounded-lg px-4 py-2 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-.3s]" />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-.5s]" />
            </div>
          </div>
        )}
        
        {/* Hint message */}
        {showHint && (
          <div className="flex max-w-[90%] mx-auto">
            <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg px-4 py-2 flex items-start gap-2">
              <Lightbulb className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Conversation Hint</p>
                <p className="text-sm">{hint}</p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      {isActive ? (
        <div className="border-t p-3 space-y-3">
          <div className="flex items-start gap-3">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response..."
              className="flex-1 min-h-[80px] resize-none"
              disabled={isProcessing}
            />
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleSendMessage} 
                size="icon" 
                disabled={!inputValue.trim() || isProcessing}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
              <Button
                onClick={generateHint}
                variant="outline"
                size="icon"
                type="button"
                disabled={isProcessing}
              >
                <Lightbulb className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={onEndSimulation}
              className="text-xs"
              disabled={isProcessing}
            >
              <Pause className="h-3 w-3 mr-1" />
              End Simulation
            </Button>
            
            <span className="text-xs text-muted-foreground">
              {isProcessing ? "AI is responding..." : "Press Enter to send"}
            </span>
          </div>
        </div>
      ) : (
        <div className="border-t p-4 text-center">
          <p className="text-muted-foreground mb-2">This simulation has ended</p>
          <Button onClick={onEndSimulation} variant="secondary">
            View Feedback
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
