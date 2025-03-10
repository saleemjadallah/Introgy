
import { useState } from "react";
import { WisdomFilter, WisdomCategory, SituationType, EnergyLevel, WisdomItem } from "@/types/community-wisdom";

export const useWisdomFilters = (wisdomItems: WisdomItem[], savedItems: string[], filterSaved: boolean) => {
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
  
  const handleSearchChange = (searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm,
    }));
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      situations: [],
      energyLevels: [],
      searchTerm: "",
    });
  };

  return {
    filters,
    filteredItems,
    activeFilterCount,
    handleCategoryToggle,
    handleSituationToggle,
    handleEnergyLevelToggle,
    handleSearchChange,
    resetFilters
  };
};
