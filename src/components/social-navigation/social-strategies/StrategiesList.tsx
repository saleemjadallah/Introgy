
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/types/social-strategies";
import { Clock, Zap, Battery, Heart, Calendar, BatteryCharging } from "lucide-react";

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
  const filteredStrategies = searchQuery.trim() !== '' 
    ? strategies.filter(
        (strategy) =>
          strategy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          strategy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          strategy.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : strategies;

  console.log("StrategiesList - Filtered strategies:", filteredStrategies.length);

  if (filteredStrategies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No strategies match your search criteria</p>
      </div>
    );
  }

  // Strategy type icons
  const strategyTypeIcons = {
    "quick": <Zap className="h-4 w-4" />,
    "preparation": <Calendar className="h-4 w-4" />,
    "recovery": <Battery className="h-4 w-4" />,
    "energy-conservation": <BatteryCharging className="h-4 w-4" />,
    "connection": <Heart className="h-4 w-4" />
  };

  // Energy level colors
  const energyLevelColors = {
    "low": "bg-green-500/10 text-green-600",
    "medium": "bg-yellow-500/10 text-yellow-600",
    "high": "bg-red-500/10 text-red-600"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {filteredStrategies.map((strategy) => (
        <Card
          key={strategy.id}
          className="border hover:border-primary/50 transition-colors"
          id={strategy.id}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-2">
              <h4 className="font-medium mb-1">{strategy.title}</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(strategy.id);
                }}
              >
                <Heart
                  className={`h-4 w-4 ${
                    strategy.isFavorite ? "fill-primary text-primary" : ""
                  }`}
                />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {strategy.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge
                variant="outline"
                className={`flex items-center gap-1 ${
                  energyLevelColors[strategy.energyLevel] || ""
                }`}
              >
                <Battery className="h-3 w-3" />
                <span className="capitalize">{strategy.energyLevel}</span> energy
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1"
              >
                <Clock className="h-3 w-3" />
                {strategy.prepTime} min
              </Badge>
              <Badge className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20">
                {strategyTypeIcons[strategy.type] || <Zap className="h-3 w-3" />}
                <span className="capitalize">{strategy.type.replace("-", " ")}</span>
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                console.log("Selecting strategy:", strategy.id);
                onStrategySelect(strategy.id);
              }}
            >
              View Strategy
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StrategiesList;
