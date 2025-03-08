
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useConversationSimulator } from "@/hooks/useConversationSimulator";
import { useSocialBattery } from "@/hooks/useSocialBattery";
import SimulatorTabs from "./conversation-simulator/SimulatorTabs";
import { getScenarios } from "@/data/conversationScenarios";

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

  // Social battery must be at least 15% to use the simulator
  const canStartSimulation = batteryLevel >= 15;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Conversation Simulator
        </CardTitle>
        <CardDescription>
          Practice social interactions in different scenarios
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
