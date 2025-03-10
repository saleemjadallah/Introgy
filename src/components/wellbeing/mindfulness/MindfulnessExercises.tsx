
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMindfulnessPractices } from "./hooks/useMindfulnessPractices";
import DiscoverTab from "./tabs/DiscoverTab";
import RecommendedTab from "./tabs/RecommendedTab";
import HistoryTab from "./tabs/HistoryTab";
import PracticeBuilder from "./PracticeBuilder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

const MindfulnessExercises = () => {
  const { 
    selectedPractice,
    completedPractices,
    handleSelectPractice,
    handleCompletePractice,
    getTimeOfDay
  } = useMindfulnessPractices();
  
  const { batteryLevel } = useSocialBattery();
  const timeOfDay = getTimeOfDay();
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      <ScrollArea className="w-full">
        <Tabs defaultValue="discover" className="w-full">
          <div className="sticky top-0 bg-background z-10 pb-2">
            <ScrollArea className="pb-2">
              <TabsList className={`${isMobile ? 'w-auto min-w-full' : 'w-full'} mb-4 flex flex-nowrap`}>
                <TabsTrigger value="discover" className="flex-shrink-0">Discover</TabsTrigger>
                <TabsTrigger value="recommended" className="flex-shrink-0">Recommended</TabsTrigger>
                <TabsTrigger value="builder" className="flex-shrink-0">Practice Builder</TabsTrigger>
                <TabsTrigger value="history" className="flex-shrink-0">History</TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>
          
          <TabsContent value="discover" className="w-full max-w-full px-0">
            <DiscoverTab 
              selectedPractice={selectedPractice}
              selectedPracticeId={selectedPractice?.id}
              completedPractices={completedPractices}
              onSelectPractice={handleSelectPractice}
              onCompletePractice={handleCompletePractice}
            />
          </TabsContent>
          
          <TabsContent value="recommended" className="w-full max-w-full px-0">
            <RecommendedTab 
              batteryLevel={batteryLevel}
              timeOfDay={timeOfDay}
              completedPractices={completedPractices}
              onSelectPractice={handleSelectPractice}
            />
          </TabsContent>
          
          <TabsContent value="builder" className="w-full max-w-full px-0">
            <div className="mt-4">
              <PracticeBuilder />
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="w-full max-w-full px-0">
            <HistoryTab 
              completedPractices={completedPractices}
              onSelectPractice={handleSelectPractice}
            />
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};

export default MindfulnessExercises;
