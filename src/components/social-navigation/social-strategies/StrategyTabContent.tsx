
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/types/social-strategies";
import StrategiesList from "./StrategiesList";
import StrategyDetail from "./StrategyDetail";

interface StrategyTabContentProps {
  scenarioName: string;
  strategies: Strategy[];
  selectedStrategy: string | null;
  searchQuery: string;
  onStrategySelect: (strategyId: string) => void;
  onBackToList: () => void;
  toggleFavorite: (strategyId: string) => void;
}

const StrategyTabContent = ({
  scenarioName,
  strategies,
  selectedStrategy,
  searchQuery,
  onStrategySelect,
  onBackToList,
  toggleFavorite,
}: StrategyTabContentProps) => {
  return (
    <div className="px-4 pb-4">
      {selectedStrategy ? (
        <StrategyDetail
          strategyId={selectedStrategy}
          onBack={onBackToList}
          toggleFavorite={toggleFavorite}
        />
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-medium">{scenarioName} Strategies</h3>
            <Badge variant="outline">
              {strategies.length} strategies
            </Badge>
          </div>
          <StrategiesList
            strategies={strategies}
            onStrategySelect={onStrategySelect}
            searchQuery={searchQuery}
            toggleFavorite={toggleFavorite}
          />
        </>
      )}
    </div>
  );
};

export default StrategyTabContent;
