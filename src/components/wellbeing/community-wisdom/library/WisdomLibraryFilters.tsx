
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WisdomFilter, WisdomCategory, SituationType, EnergyLevel } from "@/types/community-wisdom";

interface WisdomLibraryFiltersProps {
  filters: WisdomFilter;
  activeFilterCount: number;
  onSearchChange: (searchTerm: string) => void;
  onCategoryToggle: (category: WisdomCategory) => void;
  onSituationToggle: (situation: SituationType) => void;
  onEnergyLevelToggle: (level: EnergyLevel) => void;
  onResetFilters: () => void;
}

const WisdomLibraryFilters = ({
  filters,
  activeFilterCount,
  onSearchChange,
  onCategoryToggle,
  onSituationToggle,
  onEnergyLevelToggle,
  onResetFilters,
}: WisdomLibraryFiltersProps) => {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search wisdom by content or tags..."
          className="pl-8"
          value={filters.searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Categories</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.categories.includes('practical-strategies')}
            onCheckedChange={() => onCategoryToggle('practical-strategies')}
          >
            Practical Strategies
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.categories.includes('personal-insights')}
            onCheckedChange={() => onCategoryToggle('personal-insights')}
          >
            Personal Insights
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.categories.includes('success-stories')}
            onCheckedChange={() => onCategoryToggle('success-stories')}
          >
            Success Stories
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.categories.includes('coping-techniques')}
            onCheckedChange={() => onCategoryToggle('coping-techniques')}
          >
            Coping Techniques
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.categories.includes('resources')}
            onCheckedChange={() => onCategoryToggle('resources')}
          >
            Resources
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Situations</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.situations.includes('work')}
            onCheckedChange={() => onSituationToggle('work')}
          >
            Work
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.situations.includes('social')}
            onCheckedChange={() => onSituationToggle('social')}
          >
            Social
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.situations.includes('family')}
            onCheckedChange={() => onSituationToggle('family')}
          >
            Family
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.situations.includes('education')}
            onCheckedChange={() => onSituationToggle('education')}
          >
            Education
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.situations.includes('daily-life')}
            onCheckedChange={() => onSituationToggle('daily-life')}
          >
            Daily Life
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Energy Required</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.energyLevels.includes('low')}
            onCheckedChange={() => onEnergyLevelToggle('low')}
          >
            Low Energy
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.energyLevels.includes('medium')}
            onCheckedChange={() => onEnergyLevelToggle('medium')}
          >
            Medium Energy
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.energyLevels.includes('high')}
            onCheckedChange={() => onEnergyLevelToggle('high')}
          >
            High Energy
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <div className="p-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onResetFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default WisdomLibraryFilters;
