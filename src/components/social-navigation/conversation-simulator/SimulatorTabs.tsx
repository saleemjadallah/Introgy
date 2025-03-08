
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Play, Award } from "lucide-react";
import { Scenario, Message } from "@/types/conversation";
import ScenarioSelection from "./ScenarioSelection";
import ChatInterface from "./ChatInterface";
import SimulationFeedback from "./SimulationFeedback";
import { SimulationFeedback as SimulationFeedbackType } from "@/hooks/useConversationSimulator";

interface SimulatorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeScenario: Scenario | null;
  simulationInProgress: boolean;
  messages: Message[];
  feedback: SimulationFeedbackType | null;
  batteryLevel: number;
  canStartSimulation: boolean;
  onScenarioSelect: (scenario: Scenario) => void;
  onStartSimulation: () => void;
  onSendMessage: (content: string) => void;
  onEndSimulation: () => void;
  onReset: () => void;
}

const SimulatorTabs: React.FC<SimulatorTabsProps> = ({
  activeTab,
  setActiveTab,
  activeScenario,
  simulationInProgress,
  messages,
  feedback,
  batteryLevel,
  canStartSimulation,
  onScenarioSelect,
  onStartSimulation,
  onSendMessage,
  onEndSimulation,
  onReset
}) => {
  return (
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
        <ScenarioSelectionTab 
          onScenarioSelect={onScenarioSelect}
          selectedScenario={activeScenario}
          batteryLevel={batteryLevel}
          canStartSimulation={canStartSimulation}
          onStartSimulation={onStartSimulation}
        />
      </TabsContent>
      
      <TabsContent value="simulation" className="p-0 min-h-[500px]">
        <ChatInterface 
          messages={messages}
          onSendMessage={onSendMessage}
          onEndSimulation={onEndSimulation}
          scenario={activeScenario}
          isActive={simulationInProgress}
        />
      </TabsContent>
      
      <TabsContent value="feedback" className="p-4 min-h-[400px]">
        <SimulationFeedback 
          feedback={feedback}
          scenario={activeScenario}
          onReset={onReset}
        />
      </TabsContent>
    </Tabs>
  );
};

// Separate component for the scenario selection tab content
const ScenarioSelectionTab: React.FC<{
  onScenarioSelect: (scenario: Scenario) => void;
  selectedScenario: Scenario | null;
  batteryLevel: number;
  canStartSimulation: boolean;
  onStartSimulation: () => void;
}> = ({ 
  onScenarioSelect, 
  selectedScenario, 
  batteryLevel, 
  canStartSimulation,
  onStartSimulation 
}) => {
  return (
    <>
      <ScenarioSelection 
        onScenarioSelect={onScenarioSelect}
        selectedScenario={selectedScenario}
        batteryLevel={batteryLevel}
      />
      
      {selectedScenario && (
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{selectedScenario.name}</span> • 
            <span className="ml-1">{selectedScenario.difficulty}</span> • 
            <span className="ml-1">{selectedScenario.duration}</span>
          </div>
          
          <Button 
            onClick={onStartSimulation}
            disabled={!canStartSimulation}
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Simulation
          </Button>
        </div>
      )}
      
      {!canStartSimulation && selectedScenario && (
        <LowBatteryWarning />
      )}
    </>
  );
};

// Low battery warning component
const LowBatteryWarning = () => (
  <div className="mt-2 bg-yellow-500/10 p-2 rounded-md text-xs text-yellow-600 dark:text-yellow-400 flex items-start gap-2">
    <Brain className="h-4 w-4 flex-shrink-0 mt-0.5" />
    <div>
      <p className="font-medium">Your social battery is too low</p>
      <p>Conversations require at least 15% battery. Take some time to recharge.</p>
    </div>
  </div>
);

// Add missing import
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export default SimulatorTabs;
