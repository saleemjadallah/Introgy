
import { MindfulnessPractice } from "@/types/mindfulness";
import { getPracticeById } from "@/data/mindfulness";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryTabProps {
  completedPractices: string[];
  savedPractices: MindfulnessPractice[];
  onSelectPractice: (id: string) => void;
}

const HistoryTab = ({ completedPractices, savedPractices, onSelectPractice }: HistoryTabProps) => {
  return (
    <div className="mt-6 space-y-8">
      {savedPractices.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Saved Practices</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedPractices.map(practice => (
              <div 
                key={practice.id} 
                className="border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onSelectPractice(practice.id)}
              >
                <h4 className="font-medium">{practice.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{practice.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs">{practice.duration} min</p>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <ChevronLeft className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {completedPractices.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Completed Practices</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedPractices.map(id => {
              // Check if it's a saved practice first
              const savedPractice = savedPractices.find(p => p.id === id);
              if (savedPractice) {
                return (
                  <div 
                    key={id} 
                    className="border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => onSelectPractice(id)}
                  >
                    <h4 className="font-medium">{savedPractice.title}</h4>
                    <p className="text-sm text-muted-foreground">{savedPractice.category}</p>
                    <p className="text-xs mt-2">{savedPractice.duration} min • {savedPractice.subcategory}</p>
                  </div>
                );
              }
              
              // If not a saved practice, check the library
              const practice = getPracticeById(id);
              if (!practice) return null;
              
              return (
                <div 
                  key={id} 
                  className="border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => onSelectPractice(id)}
                >
                  <h4 className="font-medium">{practice.title}</h4>
                  <p className="text-sm text-muted-foreground">{practice.category}</p>
                  <p className="text-xs mt-2">{practice.duration} min • {practice.subcategory}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        savedPractices.length === 0 && (
          <div className="h-64 border rounded-lg flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              You haven't completed any practices yet
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default HistoryTab;
