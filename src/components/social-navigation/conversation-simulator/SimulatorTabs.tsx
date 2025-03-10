
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Play, Award, Brain } from "lucide-react";
import { Scenario, Message } from "@/types/conversation";
import ScenarioSelection from "./ScenarioSelection";
import ChatInterface from "./ChatInterface";
import SimulationFeedback from "./SimulationFeedback";
import { SimulationFeedback as SimulationFeedbackType } from "@/hooks/useConversationSimulator";
import { Button } from "@/components/ui/button";

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
      
      {activeTab ? (
        <>
          {activeTab === "scenarios" && (
            <TabsContent value="scenarios" className="p-4 min-h-[400px]">
              <ScenarioSelection 
                onScenarioSelect={onScenarioSelect}
                selectedScenario={activeScenario}
                batteryLevel={batteryLevel}
              />
              
              {activeScenario && (
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{activeScenario.name}</span> • 
                    <span className="ml-1">{activeScenario.difficulty}</span> • 
                    <span className="ml-1">{activeScenario.duration}</span>
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
              
              {!canStartSimulation && activeScenario && (
                <LowBatteryWarning />
              )}
            </TabsContent>
          )}
          
          {activeTab === "simulation" && (
            <TabsContent value="simulation" className="p-0 min-h-[500px]">
              <ChatInterface 
                messages={messages}
                onSendMessage={onSendMessage}
                onEndSimulation={onEndSimulation}
                scenario={activeScenario}
                isActive={simulationInProgress}
              />
            </TabsContent>
          )}
          
          {activeTab === "feedback" && (
            <TabsContent value="feedback" className="p-4 min-h-[400px]">
              <SimulationFeedback 
                feedback={feedback}
                scenario={activeScenario}
                onReset={onReset}
              />
            </TabsContent>
          )}
        </>
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          <p>Select a tab above to get started</p>
        </div>
      )}
    </Tabs>
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

export default SimulatorTabs;
