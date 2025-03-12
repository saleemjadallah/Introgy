
import { useState } from "react";
import { WisdomItem } from "@/types/community-wisdom";
import { X } from "lucide-react";
import WisdomLibraryFilters from "./library/WisdomLibraryFilters";
import ActiveFiltersDisplay from "./library/ActiveFiltersDisplay";
import EmptyLibraryMessage from "./library/EmptyLibraryMessage";
import WisdomDetailView from "./library/WisdomDetailView";
import WisdomGrid from "./library/WisdomGrid";
import { useWisdomFilters } from "./library/useWisdomFilters";
import { usePremium } from "@/contexts/premium/PremiumContext";
import { PremiumFeatureGuard } from "@/components/premium/PremiumFeatureGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WisdomLibraryProps {
  wisdomItems: WisdomItem[];
  savedItems: string[];
  onToggleSave: (id: string) => void;
  onMarkHelpful: (id: string) => void;
  filterSaved: boolean;
}

const MAX_FREE_WISDOM_ITEMS = 10;

const WisdomLibrary = ({
  wisdomItems,
  savedItems,
  onToggleSave,
  onMarkHelpful,
  filterSaved,
}: WisdomLibraryProps) => {
  const [selectedWisdom, setSelectedWisdom] = useState<WisdomItem | null>(null);
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  
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

  // Limit items for free users
  const limitedItems = isPremium ? filteredItems : filteredItems.slice(0, MAX_FREE_WISDOM_ITEMS);
  const isLimited = !isPremium && filteredItems.length > MAX_FREE_WISDOM_ITEMS;

  if (selectedWisdom) {
    const canViewDetails = isPremium || savedItems.includes(selectedWisdom.id) || wisdomItems.indexOf(selectedWisdom) < MAX_FREE_WISDOM_ITEMS;
    
    if (!canViewDetails) {
      return (
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => setSelectedWisdom(null)}
          >
            <X className="h-4 w-4 mr-2" />
            Back to wisdom library
          </Button>
          
          <PremiumFeatureGuard
            feature="full-community-participation"
            title="Premium Community Access"
            description="Access to the full community wisdom library requires a premium subscription"
          >
            <WisdomDetailView
              selectedWisdom={selectedWisdom}
              savedItems={savedItems}
              onToggleSave={onToggleSave}
              onMarkHelpful={onMarkHelpful}
              onBack={() => setSelectedWisdom(null)}
              onSelectSimilar={setSelectedWisdom}
              getSimilarWisdom={getSimilarWisdom}
            />
          </PremiumFeatureGuard>
        </div>
      );
    }
    
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

      {isLimited && (
        <Alert className="bg-muted/50 border border-primary/20">
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>Free plan limits you to {MAX_FREE_WISDOM_ITEMS} wisdom items. Upgrade to premium for unlimited access.</span>
            <Button 
              size="sm" 
              onClick={() => navigate("/profile?tab=pricing")}
              className="whitespace-nowrap"
            >
              <Star className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {limitedItems.length > 0 ? (
        <WisdomGrid
          items={limitedItems}
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
