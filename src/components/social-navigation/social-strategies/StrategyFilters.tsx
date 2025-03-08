
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { StrategyFilters as FiltersType } from "@/types/social-strategies";
import { Label } from "@/components/ui/label";

interface StrategyFiltersProps {
  filters: FiltersType;
  updateFilters: (filters: Partial<FiltersType>) => void;
}

const StrategyFilters = ({ filters, updateFilters }: StrategyFiltersProps) => {
  const strategyTypes = [
    { id: "quick", label: "Quick Tactics" },
    { id: "preparation", label: "Preparation" },
    { id: "recovery", label: "Recovery" },
    { id: "energy-conservation", label: "Energy Conservation" },
    { id: "connection", label: "Connection Methods" }
  ];

  return (
    <div className="space-y-4 bg-muted/40 p-3 rounded-md">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm">Energy Level (Max)</Label>
          <Badge variant="outline">{filters.maxEnergy}/10</Badge>
        </div>
        <Slider
          value={[filters.maxEnergy]}
          min={1}
          max={10}
          step={1}
          className="mt-2"
          onValueChange={(value) => updateFilters({ maxEnergy: value[0] })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm">Preparation Time (Max)</Label>
          <Badge variant="outline">{filters.maxPrepTime} min</Badge>
        </div>
        <Slider
          value={[filters.maxPrepTime]}
          min={0}
          max={60}
          step={5}
          className="mt-2"
          onValueChange={(value) => updateFilters({ maxPrepTime: value[0] })}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm block mb-2">Strategy Types</Label>
        <div className="grid grid-cols-2 gap-2">
          {strategyTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Switch
                id={`filter-${type.id}`}
                checked={filters.types.includes(type.id)}
                onCheckedChange={(checked) => {
                  const newTypes = checked
                    ? [...filters.types, type.id]
                    : filters.types.filter((t) => t !== type.id);
                  updateFilters({ types: newTypes });
                }}
              />
              <Label htmlFor={`filter-${type.id}`} className="text-sm">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="filter-favorites"
          checked={filters.favoritesOnly}
          onCheckedChange={(checked) => 
            updateFilters({ favoritesOnly: checked })
          }
        />
        <Label htmlFor="filter-favorites" className="text-sm">
          Show favorites only
        </Label>
      </div>
    </div>
  );
};

export default StrategyFilters;
