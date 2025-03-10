
import { useState } from "react";
import { WisdomItem } from "@/types/community-wisdom";
import { X } from "lucide-react";
import WisdomLibraryFilters from "./library/WisdomLibraryFilters";
import ActiveFiltersDisplay from "./library/ActiveFiltersDisplay";
import EmptyLibraryMessage from "./library/EmptyLibraryMessage";
import WisdomDetailView from "./library/WisdomDetailView";
import WisdomGrid from "./library/WisdomGrid";
import { useWisdomFilters } from "./library/useWisdomFilters";

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
  
  const {
    filters,
    filteredItems,
    activeFilterCount,
    handleCategoryToggle,
    handleSituationToggle,
    handleEnergyLevelToggle,
    handleSearchChange,
    resetFilters
  } = useWisdomFilters(wisdomItems, savedItems, filterSaved);

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

  if (selectedWisdom) {
    return (
      <WisdomDetailView
        selectedWisdom={selectedWisdom}
        savedItems={savedItems}
        onToggleSave={onToggleSave}
        onMarkHelpful={onMarkHelpful}
        onBack={() => setSelectedWisdom(null)}
        onSelectSimilar={setSelectedWisdom}
        getSimilarWisdom={getSimilarWisdom}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <WisdomLibraryFilters
          filters={filters}
          activeFilterCount={activeFilterCount}
          onSearchChange={handleSearchChange}
          onCategoryToggle={handleCategoryToggle}
          onSituationToggle={handleSituationToggle}
          onEnergyLevelToggle={handleEnergyLevelToggle}
          onResetFilters={resetFilters}
        />

        <ActiveFiltersDisplay
          categories={filters.categories}
          situations={filters.situations}
          energyLevels={filters.energyLevels}
          activeFilterCount={activeFilterCount}
          onCategoryToggle={handleCategoryToggle}
          onSituationToggle={handleSituationToggle}
          onEnergyLevelToggle={handleEnergyLevelToggle}
          onResetFilters={resetFilters}
        />
      </div>

      {filteredItems.length > 0 ? (
        <WisdomGrid
          items={filteredItems}
          savedItems={savedItems}
          onSelect={setSelectedWisdom}
          onToggleSave={onToggleSave}
        />
      ) : (
        <EmptyLibraryMessage
          filterSaved={filterSaved}
          activeFilterCount={activeFilterCount}
          onResetFilters={resetFilters}
        />
      )}
    </div>
  );
};

export default WisdomLibrary;
