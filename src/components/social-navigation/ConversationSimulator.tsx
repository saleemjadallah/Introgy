
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useConversationSimulator } from "@/hooks/useConversationSimulator";
import SimulatorTabs from "./conversation-simulator/SimulatorTabs";
import { useSocialBattery } from "@/hooks/useSocialBattery";

const ConversationSimulator = () => {
  const { batteryLevel } = useSocialBattery();
  const {
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
  } = useConversationSimulator();
  
  // Determine if user can start a simulation based on battery level
  const canStartSimulation = batteryLevel >= 15;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Conversation Simulator
        </CardTitle>
        <CardDescription>
          Practice conversations in a safe environment with our AI-powered simulator
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <SimulatorTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeScenario={activeScenario}
          simulationInProgress={simulationInProgress}
          messages={messages}
          feedback={feedback}
          batteryLevel={batteryLevel}
          canStartSimulation={canStartSimulation}
          onScenarioSelect={handleScenarioSelect}
          onStartSimulation={handleStartSimulation}
          onSendMessage={handleSendMessage}
          onEndSimulation={handleEndSimulation}
          onReset={handleReset}
        />
      </CardContent>
    </Card>
  );
};

export default ConversationSimulator;
