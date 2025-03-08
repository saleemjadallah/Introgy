
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Users, AlertTriangle, Coffee, Search } from "lucide-react";
import { Scenario, ScenarioType } from "@/types/conversation";
import { getScenarios } from "@/data/conversationScenarios";

interface ScenarioSelectionProps {
  onScenarioSelect: (scenario: Scenario) => void;
  selectedScenario: Scenario | null;
  batteryLevel: number;
}

const ScenarioSelection = ({ 
  onScenarioSelect, 
  selectedScenario,
  batteryLevel 
}: ScenarioSelectionProps) => {
  const [activeTab, setActiveTab] = useState<ScenarioType>("social");
  const [searchQuery, setSearchQuery] = useState("");
  const scenarios = getScenarios();
  
  // Filter scenarios by type and search query
  const filteredScenarios = scenarios.filter(scenario => {
    const matchesType = scenario.type === activeTab || activeTab === "all";
    const matchesSearch = scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          scenario.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });
  
  // Group scenarios by difficulty
  const groupedScenarios = filteredScenarios.reduce((acc, scenario) => {
    if (!acc[scenario.difficulty]) {
      acc[scenario.difficulty] = [];
    }
    acc[scenario.difficulty].push(scenario);
    return acc;
  }, {} as Record<string, Scenario[]>);
  
  // Check if scenario is available based on battery level
  const isScenarioAvailable = (difficulty: string) => {
    const batteryRequirements = {
      "beginner": 15,
      "intermediate": 30,
      "advanced": 50
    };
    
    return batteryLevel >= batteryRequirements[difficulty];
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search scenarios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab as any}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="professional">
            <Briefcase className="h-4 w-4 mr-1" />
            Work
          </TabsTrigger>
          <TabsTrigger value="social">
            <Users className="h-4 w-4 mr-1" />
            Social
          </TabsTrigger>
          <TabsTrigger value="challenging">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Difficult
          </TabsTrigger>
          <TabsTrigger value="daily">
            <Coffee className="h-4 w-4 mr-1" />
            Daily
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-6">
        {Object.entries(groupedScenarios).map(([difficulty, scenarios]) => (
          <div key={difficulty} className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              <Badge variant="outline" className="mr-2 capitalize">
                {difficulty}
              </Badge>
              {!isScenarioAvailable(difficulty) && (
                <span className="text-yellow-500 text-xs ml-2 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Requires {difficulty === "beginner" ? "15%" : difficulty === "intermediate" ? "30%" : "50%"} battery
                </span>
              )}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenarios.map((scenario) => (
                <Card 
                  key={scenario.id}
                  className={`cursor-pointer transition-all ${
                    selectedScenario?.id === scenario.id 
                      ? "border-primary" 
                      : "hover:border-primary/50"
                  } ${
                    !isScenarioAvailable(scenario.difficulty)
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                  onClick={() => isScenarioAvailable(scenario.difficulty) && onScenarioSelect(scenario)}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">{scenario.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {scenario.duration} • {scenario.personaType}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        
        {Object.keys(groupedScenarios).length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No scenarios found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find a conversation scenario.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioSelection;
