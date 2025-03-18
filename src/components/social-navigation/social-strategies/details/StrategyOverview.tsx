
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Battery, Clock, Heart, Zap } from "lucide-react";
import { Strategy } from "@/types/social-strategies";

interface StrategyOverviewProps {
  strategy: Strategy;
}

const StrategyOverview = ({ strategy }: StrategyOverviewProps) => {
  // Strategy type icon
  const getStrategyTypeIcon = () => {
    switch (strategy.type) {
      case "quick": return <Zap className="h-4 w-4" />;
      case "preparation": return <Clock className="h-4 w-4" />;
      case "recovery": return <Battery className="h-4 w-4" />;
      case "energy-conservation": return <Battery className="h-4 w-4" />;
      case "connection": return <Heart className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  // Energy level class
  const getEnergyLevelClass = () => {
    switch (strategy.energyLevel) {
      case "low": return "bg-green-500/10 text-green-600";
      case "medium": return "bg-yellow-500/10 text-yellow-600";
      case "high": return "bg-red-500/10 text-red-600";
      default: return "";
    }
  };

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold">{strategy.title}</h3>
        <p className="text-muted-foreground mt-1">{strategy.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className={`flex items-center gap-1 ${getEnergyLevelClass()}`}
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
          {getStrategyTypeIcon()}
          <span className="capitalize">{strategy.type.replace("-", " ")}</span>
        </Badge>
      </div>
    </>
  );
};

export default StrategyOverview;
