
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMindfulnessPractices } from "./hooks/useMindfulnessPractices";
import DiscoverTab from "./tabs/DiscoverTab";
import RecommendedTab from "./tabs/RecommendedTab";
import HistoryTab from "./tabs/HistoryTab";
import PracticeBuilder from "./PracticeBuilder";

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
      <Tabs defaultValue="discover" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="builder">Practice Builder</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
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
    </div>
  );
};

export default MindfulnessExercises;
