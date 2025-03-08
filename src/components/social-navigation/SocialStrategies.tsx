
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Filter, Briefcase, PartyPopper, User, House, Bus, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import StrategiesList from "./social-strategies/StrategiesList";
import StrategyFilters from "./social-strategies/StrategyFilters";
import StrategyDetail from "./social-strategies/StrategyDetail";
import { useSocialStrategies } from "@/hooks/useSocialStrategies";

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

  const scenarioIcons = {
    "professional": <Briefcase className="h-4 w-4" />,
    "social-gatherings": <PartyPopper className="h-4 w-4" />,
    "one-on-one": <User className="h-4 w-4" />,
    "family-events": <House className="h-4 w-4" />,
    "public-spaces": <Bus className="h-4 w-4" />,
    "digital-communication": <Video className="h-4 w-4" />
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Social Strategies
        </CardTitle>
        <CardDescription>Evidence-based strategies for different social scenarios</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {!activeTab ? (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Select a scenario type to explore strategies
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {scenarioTypes.map((scenario) => (
                <Button
                  key={scenario.id}
                  variant="outline"
                  className="flex flex-col items-center justify-center gap-2 h-auto py-4"
                  onClick={() => {
                    setActiveTab(scenario.id);
                    setActiveScenario(scenario.id);
                  }}
                >
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    {scenarioIcons[scenario.id] || <BookOpen className="h-5 w-5" />}
                  </div>
                  <span className="text-sm font-medium">{scenario.name}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Tabs for different scenario types */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="px-4 pt-4">
                <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4">
                  {scenarioTypes.map((scenario) => (
                    <TabsTrigger
                      key={scenario.id}
                      value={scenario.id}
                      className="flex flex-col items-center gap-1 h-auto py-2"
                      onClick={() => setActiveScenario(scenario.id)}
                    >
                      <div>
                        {scenarioIcons[scenario.id] || <BookOpen className="h-4 w-4" />}
                      </div>
                      <span className="text-xs">{scenario.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Search and filter bar */}
              <div className="px-4 pb-2 flex items-center gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search strategies..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-primary/10" : ""}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters section (collapsible) */}
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
                <TabsContent key={scenario.id} value={scenario.id} className="px-4 pb-4">
                  {selectedStrategy ? (
                    <StrategyDetail
                      strategyId={selectedStrategy}
                      onBack={handleBackToList}
                      toggleFavorite={toggleFavorite}
                    />
                  ) : (
                    <>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium">{scenario.name} Strategies</h3>
                        <Badge variant="outline">
                          {filteredStrategies.length} strategies
                        </Badge>
                      </div>
                      <StrategiesList
                        strategies={filteredStrategies}
                        onStrategySelect={handleStrategySelect}
                        searchQuery={searchQuery}
                        toggleFavorite={toggleFavorite}
                      />
                    </>
                  )}
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
