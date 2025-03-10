
import { MindfulnessPractice } from "@/types/mindfulness";
import MindfulnessCategoryList from "../MindfulnessCategoryList";
import MindfulnessPlayer from "../MindfulnessPlayer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-3'} gap-4 mt-4 w-full max-w-full`}>
      <div className={`${isMobile ? 'mb-4' : 'lg:col-span-1'} max-h-[calc(100vh-250px)]`}>
        <div className="relative overflow-auto w-full h-full">
          <ScrollArea className="h-full w-full pr-4" type="scroll">
            <div className="pr-2">
              <MindfulnessCategoryList 
                onSelectPractice={onSelectPractice}
                selectedPracticeId={selectedPracticeId}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
      
      <div id="practice-player" className={`${isMobile ? '' : 'lg:col-span-2'} w-full max-w-full`}>
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
