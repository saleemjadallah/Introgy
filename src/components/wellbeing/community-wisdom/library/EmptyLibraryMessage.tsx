
import { Button } from "@/components/ui/button";

interface EmptyLibraryMessageProps {
  filterSaved: boolean;
  activeFilterCount: number;
  onResetFilters: () => void;
}

const EmptyLibraryMessage = ({
  filterSaved,
  activeFilterCount,
  onResetFilters,
}: EmptyLibraryMessageProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-lg text-muted-foreground">
        {filterSaved
          ? "You haven't saved any wisdom items yet."
          : "No wisdom found matching your filters."}
      </p>
      {!filterSaved && activeFilterCount > 0 && (
        <Button
          variant="outline"
          onClick={onResetFilters}
          className="mt-4"
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
};

export default EmptyLibraryMessage;
