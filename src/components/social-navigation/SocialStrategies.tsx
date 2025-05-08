
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocialStrategies } from "@/hooks/useSocialStrategies";

// Import the new components
import ScenarioTypeGrid from "./social-strategies/ScenarioTypeGrid";
import ScenarioTabs from "./social-strategies/ScenarioTabs";
import SearchFilterBar from "./social-strategies/SearchFilterBar";
import StrategyFilters from "./social-strategies/StrategyFilters";
import StrategyTabContent from "./social-strategies/StrategyTabContent";

const SocialStrategies = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    strategies, 
    filteredStrategies, 
    scenarioTypes, 
    activeScenario,
    loading, 
    filters,
    toggleFavorite,
    updateFilters, 
    setActiveScenario
  } = useSocialStrategies();

  const handleStrategySelect = (strategyId: string) => {
    setSelectedStrategy(strategyId);
  };
  
  const handleBackToList = () => {
    setSelectedStrategy(null);
  };

  const handleScenarioSelect = (scenarioId: string) => {
    setActiveTab(scenarioId);
    setActiveScenario(scenarioId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Card className="navigation-container-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-periwinkle" />
          Social Strategies
        </CardTitle>
        <CardDescription>
          Evidence-based strategies for different social scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Demo notice for the explanatory website */}
        <div className="bg-sky-50 dark:bg-sky-950/30 border-l-4 border-sky-500 p-4 mx-4 mb-4 mt-2">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-sky-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">App Feature Preview</h4>
              <p className="text-sm text-muted-foreground">
                In the full app, you'll have access to our complete library of social strategies tailored 
                to various scenarios like networking events, casual meetups, and work functions.
              </p>
              <Button 
                variant="link" 
                className="px-0 h-auto py-1 text-sky-600 dark:text-sky-400"
                onClick={() => window.location.href = "#download-app"}
              >
                Get the app to access all strategies →
              </Button>
            </div>
          </div>
        </div>

        {!activeTab ? (
          <ScenarioTypeGrid 
            scenarioTypes={scenarioTypes} 
            onSelectScenario={handleScenarioSelect} 
          />
        ) : (
          <>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <ScenarioTabs 
                scenarioTypes={scenarioTypes} 
                onSelectScenario={handleScenarioSelect} 
              />
              
              <SearchFilterBar 
                searchQuery={searchQuery}
                showFilters={showFilters}
                onSearchChange={handleSearchChange}
                onToggleFilters={handleToggleFilters}
              />

              {showFilters && (
                <div className="px-4 pb-2">
                  <StrategyFilters 
                    filters={filters} 
                    updateFilters={updateFilters} 
                  />
                </div>
              )}

              {/* Strategy content for each tab */}
              {scenarioTypes.map((scenario) => (
                <TabsContent key={scenario.id} value={scenario.id}>
                  <StrategyTabContent
                    scenarioName={scenario.name}
                    strategies={filteredStrategies}
                    selectedStrategy={selectedStrategy}
                    searchQuery={searchQuery}
                    onStrategySelect={handleStrategySelect}
                    onBackToList={handleBackToList}
                    toggleFavorite={toggleFavorite}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialStrategies;
