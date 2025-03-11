
import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFilterBarProps {
  searchQuery: string;
  showFilters: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleFilters: () => void;
}

const SearchFilterBar = ({
  searchQuery,
  showFilters,
  onSearchChange,
  onToggleFilters,
}: SearchFilterBarProps) => {
  return (
    <div className="px-4 pb-2 flex items-center gap-2">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search strategies..."
          className="pl-8"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleFilters}
        className={showFilters ? "bg-primary/10" : ""}
      >
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchFilterBar;
