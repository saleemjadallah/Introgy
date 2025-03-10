
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMindfulnessPractices } from "./hooks/useMindfulnessPractices";
import DiscoverTab from "./tabs/DiscoverTab";
import RecommendedTab from "./tabs/RecommendedTab";
import HistoryTab from "./tabs/HistoryTab";
import PracticeBuilder from "./PracticeBuilder";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  return (
    <div className="space-y-6">
      <ScrollArea className="w-full">
        <Tabs defaultValue="discover" className="w-full">
          <div className="sticky top-0 bg-background z-10 pb-2">
            <TabsList className="w-full mb-4 overflow-x-auto flex flex-nowrap">
              <TabsTrigger value="discover" className="flex-shrink-0">Discover</TabsTrigger>
              <TabsTrigger value="recommended" className="flex-shrink-0">Recommended</TabsTrigger>
              <TabsTrigger value="builder" className="flex-shrink-0">Practice Builder</TabsTrigger>
              <TabsTrigger value="history" className="flex-shrink-0">History</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="discover">
            <DiscoverTab 
              selectedPractice={selectedPractice}
              selectedPracticeId={selectedPractice?.id}
              completedPractices={completedPractices}
              onSelectPractice={handleSelectPractice}
              onCompletePractice={handleCompletePractice}
            />
          </TabsContent>
          
          <TabsContent value="recommended">
            <RecommendedTab 
              batteryLevel={batteryLevel}
              timeOfDay={timeOfDay}
              completedPractices={completedPractices}
              onSelectPractice={handleSelectPractice}
            />
          </TabsContent>
          
          <TabsContent value="builder">
            <div className="mt-6">
              <PracticeBuilder />
            </div>
          </TabsContent>
          
          <TabsContent value="history">
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
