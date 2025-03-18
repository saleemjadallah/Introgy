
import React from "react";
import { BookOpen } from "lucide-react";

interface EmptyStrategiesListProps {
  isSearching?: boolean;
}

const EmptyStrategiesList = ({ isSearching = false }: EmptyStrategiesListProps) => {
  if (isSearching) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No strategies match your search criteria</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12 space-y-3">
      <div className="flex justify-center">
        <div className="bg-primary/10 rounded-full p-4">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
      </div>
      <h3 className="font-medium text-lg">Select a strategy type to get started</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Choose a category from above to explore evidence-based strategies that can help you navigate social situations
      </p>
    </div>
  );
};

export default EmptyStrategiesList;
