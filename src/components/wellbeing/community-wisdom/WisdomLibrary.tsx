
import { useState } from "react";
import { WisdomItem, WisdomFilter, WisdomCategory, SituationType, EnergyLevel } from "@/types/community-wisdom";
import WisdomCard from "./WisdomCard";
import WisdomDetail from "./WisdomDetail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WisdomLibraryProps {
  wisdomItems: WisdomItem[];
  savedItems: string[];
  onToggleSave: (id: string) => void;
  onMarkHelpful: (id: string) => void;
  filterSaved: boolean;
}

const WisdomLibrary = ({
  wisdomItems,
  savedItems,
  onToggleSave,
  onMarkHelpful,
  filterSaved,
}: WisdomLibraryProps) => {
  const [selectedWisdom, setSelectedWisdom] = useState<WisdomItem | null>(null);
  const [filters, setFilters] = useState<WisdomFilter>({
    categories: [],
    situations: [],
    energyLevels: [],
    searchTerm: "",
  });

  // Filtered items
  const filteredItems = wisdomItems.filter((item) => {
    // Filter by saved
    if (filterSaved && !savedItems.includes(item.id)) {
      return false;
    }

    // Filter by categories
    if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
      return false;
    }

    // Filter by situations
    if (filters.situations.length > 0 && !filters.situations.includes(item.situation)) {
      return false;
    }

    // Filter by energy levels
    if (filters.energyLevels.length > 0 && !filters.energyLevels.includes(item.energyLevel)) {
      return false;
    }

    // Filter by search term
    if (filters.searchTerm && !item.content.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      const matchesTags = item.tags.some((tag) =>
        tag.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
      if (!matchesTags) {
        return false;
      }
    }

    return true;
  });

  // Get similar wisdom items for recommendations
  const getSimilarWisdom = (item: WisdomItem): WisdomItem[] => {
    return wisdomItems
      .filter(
        (w) =>
          w.id !== item.id &&
          (w.category === item.category ||
            w.situation === item.situation ||
            w.tags.some((tag) => item.tags.includes(tag)))
      )
      .slice(0, 3);
  };

  // Generate active filter count for the button
  const activeFilterCount =
    filters.categories.length +
    filters.situations.length +
    filters.energyLevels.length;

  const handleCategoryToggle = (category: WisdomCategory) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (updated.categories.includes(category)) {
        updated.categories = updated.categories.filter((c) => c !== category);
      } else {
        updated.categories = [...updated.categories, category];
      }
      return updated;
    });
  };

  const handleSituationToggle = (situation: SituationType) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (updated.situations.includes(situation)) {
        updated.situations = updated.situations.filter((s) => s !== situation);
      } else {
        updated.situations = [...updated.situations, situation];
      }
      return updated;
    });
  };

  const handleEnergyLevelToggle = (level: EnergyLevel) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (updated.energyLevels.includes(level)) {
        updated.energyLevels = updated.energyLevels.filter((l) => l !== level);
      } else {
        updated.energyLevels = [...updated.energyLevels, level];
      }
      return updated;
    });
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      situations: [],
      energyLevels: [],
      searchTerm: "",
    });
  };

  return (
    <div className="space-y-6">
      {selectedWisdom ? (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedWisdom(null)}
            className="mb-2"
          >
            ← Back to library
          </Button>
          <WisdomDetail
            wisdom={selectedWisdom}
            isSaved={savedItems.includes(selectedWisdom.id)}
            onToggleSave={onToggleSave}
            onMarkHelpful={onMarkHelpful}
            similarWisdom={getSimilarWisdom(selectedWisdom)}
            onSelectSimilar={(item) => setSelectedWisdom(item)}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search wisdom by content or tags..."
                  className="pl-8"
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchTerm: e.target.value,
                    }))
                  }
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
                    onCheckedChange={() => handleCategoryToggle('practical-strategies')}
                  >
                    Practical Strategies
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.categories.includes('personal-insights')}
                    onCheckedChange={() => handleCategoryToggle('personal-insights')}
                  >
                    Personal Insights
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.categories.includes('success-stories')}
                    onCheckedChange={() => handleCategoryToggle('success-stories')}
                  >
                    Success Stories
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.categories.includes('coping-techniques')}
                    onCheckedChange={() => handleCategoryToggle('coping-techniques')}
                  >
                    Coping Techniques
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.categories.includes('resources')}
                    onCheckedChange={() => handleCategoryToggle('resources')}
                  >
                    Resources
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Situations</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.situations.includes('work')}
                    onCheckedChange={() => handleSituationToggle('work')}
                  >
                    Work
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.situations.includes('social')}
                    onCheckedChange={() => handleSituationToggle('social')}
                  >
                    Social
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.situations.includes('family')}
                    onCheckedChange={() => handleSituationToggle('family')}
                  >
                    Family
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.situations.includes('education')}
                    onCheckedChange={() => handleSituationToggle('education')}
                  >
                    Education
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.situations.includes('daily-life')}
                    onCheckedChange={() => handleSituationToggle('daily-life')}
                  >
                    Daily Life
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Energy Required</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.energyLevels.includes('low')}
                    onCheckedChange={() => handleEnergyLevelToggle('low')}
                  >
                    Low Energy
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.energyLevels.includes('medium')}
                    onCheckedChange={() => handleEnergyLevelToggle('medium')}
                  >
                    Medium Energy
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.energyLevels.includes('high')}
                    onCheckedChange={() => handleEnergyLevelToggle('high')}
                  >
                    High Energy
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={resetFilters}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reset Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active filters display */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.categories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="gap-1"
                  >
                    {category.replace('-', ' ')}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleCategoryToggle(category)}
                    />
                  </Badge>
                ))}
                {filters.situations.map((situation) => (
                  <Badge
                    key={situation}
                    variant="secondary"
                    className="gap-1"
                  >
                    {situation}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleSituationToggle(situation)}
                    />
                  </Badge>
                ))}
                {filters.energyLevels.map((level) => (
                  <Badge
                    key={level}
                    variant="secondary"
                    className="gap-1"
                  >
                    {level} energy
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleEnergyLevelToggle(level)}
                    />
                  </Badge>
                ))}
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-6 px-2"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            )}
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <WisdomCard
                  key={item.id}
                  wisdom={item}
                  isSaved={savedItems.includes(item.id)}
                  onSelect={() => setSelectedWisdom(item)}
                  onToggleSave={() => onToggleSave(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {filterSaved
                  ? "You haven't saved any wisdom items yet."
                  : "No wisdom found matching your filters."}
              </p>
              {!filterSaved && activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="mt-4"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WisdomLibrary;
