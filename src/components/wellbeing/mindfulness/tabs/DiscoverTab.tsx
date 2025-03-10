
import { MindfulnessPractice } from "@/types/mindfulness";
import MindfulnessCategoryList from "../MindfulnessCategoryList";
import MindfulnessPlayer from "../MindfulnessPlayer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DiscoverTabProps {
  selectedPractice: MindfulnessPractice | null;
  selectedPracticeId?: string;
  completedPractices: string[];
  onSelectPractice: (id: string) => void;
  onCompletePractice: (effectivenessRating: number, energyChange: number, notes?: string) => void;
}

const DiscoverTab = ({ 
  selectedPractice, 
  selectedPracticeId,
  completedPractices,
  onSelectPractice,
  onCompletePractice
}: DiscoverTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-1 max-h-[calc(100vh-250px)]">
        <ScrollArea className="h-full pr-4">
          <MindfulnessCategoryList 
            onSelectPractice={onSelectPractice}
            selectedPracticeId={selectedPracticeId}
          />
        </ScrollArea>
      </div>
      
      <div id="practice-player" className="lg:col-span-2">
        {selectedPractice ? (
          <MindfulnessPlayer 
            practice={selectedPractice}
            onComplete={onCompletePractice}
            isPreviouslyCompleted={completedPractices.includes(selectedPractice.id)}
          />
        ) : (
          <div className="h-64 border rounded-lg flex items-center justify-center p-6 bg-card">
            <p className="text-center text-muted-foreground">
              Select a mindfulness practice to begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverTab;
