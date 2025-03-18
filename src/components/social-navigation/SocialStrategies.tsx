
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
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
        <CardDescription>Evidence-based strategies for different social scenarios</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
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
