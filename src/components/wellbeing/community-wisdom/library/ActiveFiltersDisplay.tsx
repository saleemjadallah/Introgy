
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WisdomCategory, SituationType, EnergyLevel } from "@/types/community-wisdom";

interface ActiveFiltersDisplayProps {
  categories: WisdomCategory[];
  situations: SituationType[];
  energyLevels: EnergyLevel[];
  activeFilterCount: number;
  onCategoryToggle: (category: WisdomCategory) => void;
  onSituationToggle: (situation: SituationType) => void;
  onEnergyLevelToggle: (level: EnergyLevel) => void;
  onResetFilters: () => void;
}

const ActiveFiltersDisplay = ({
  categories,
  situations,
  energyLevels,
  activeFilterCount,
  onCategoryToggle,
  onSituationToggle,
  onEnergyLevelToggle,
  onResetFilters,
}: ActiveFiltersDisplayProps) => {
  if (activeFilterCount === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Badge
          key={category}
          variant="secondary"
          className="gap-1"
        >
          {category.replace('-', ' ')}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onCategoryToggle(category)}
          />
        </Badge>
      ))}
      {situations.map((situation) => (
        <Badge
          key={situation}
          variant="secondary"
          className="gap-1"
        >
          {situation}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onSituationToggle(situation)}
          />
        </Badge>
      ))}
      {energyLevels.map((level) => (
        <Badge
          key={level}
          variant="secondary"
          className="gap-1"
        >
          {level} energy
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onEnergyLevelToggle(level)}
          />
        </Badge>
      ))}
      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="h-6 px-2"
        >
          Clear all
        </Button>
      )}
    </div>
  );
};

export default ActiveFiltersDisplay;
