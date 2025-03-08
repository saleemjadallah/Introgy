
import React from "react";
import { Strategy } from "@/types/social-strategies";
import StrategyCard from "./list/StrategyCard";
import EmptyStrategiesList from "./list/EmptyStrategiesList";
import { filterStrategiesBySearchQuery } from "./list/strategyUtils";

interface StrategiesListProps {
  strategies: Strategy[];
  searchQuery: string;
  onStrategySelect: (strategyId: string) => void;
  toggleFavorite: (strategyId: string) => void;
}

const StrategiesList = ({ 
  strategies, 
  searchQuery, 
  onStrategySelect, 
  toggleFavorite 
}: StrategiesListProps) => {
  // Filter strategies based on search query
  const filteredStrategies = filterStrategiesBySearchQuery(strategies, searchQuery);

  console.log("StrategiesList - Filtered strategies:", filteredStrategies.length);

  if (filteredStrategies.length === 0) {
    return <EmptyStrategiesList isSearching={searchQuery.length > 0} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {filteredStrategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          onStrategySelect={onStrategySelect}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
};

export default StrategiesList;
