
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMindfulnessPractices } from "./hooks/useMindfulnessPractices";
import DiscoverTab from "./tabs/DiscoverTab";
import RecommendedTab from "./tabs/RecommendedTab";
import HistoryTab from "./tabs/HistoryTab";
import MindfulMomentsTab from "./tabs/MindfulMomentsTab";
import PracticeBuilder from "./PracticeBuilder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { MountainSnow, Sparkles } from "lucide-react";

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
    <div className="space-y-4 w-full max-w-full">
        <Tabs defaultValue="discover" className="w-full">
          <div className="sticky top-0 bg-background z-10 pb-2">
            <div className="relative overflow-x-auto">
              <ScrollArea 
                className="w-full pb-2" 
                type="scroll" 
                orientation="horizontal"
              >
                <TabsList className="min-w-max flex-nowrap mb-4 wellbeing-container-gradient">
                  <TabsTrigger value="discover" className="flex-shrink-0 data-[state=active]:bg-white/60">
                    <MountainSnow className="h-4 w-4 mr-2 text-blueteal" />
                    Discover
                  </TabsTrigger>
                  <TabsTrigger value="recommended" className="flex-shrink-0 data-[state=active]:bg-white/60">Recommended</TabsTrigger>
                  <TabsTrigger value="moments" className="flex-shrink-0 data-[state=active]:bg-white/60">
                    <Sparkles className="h-4 w-4 mr-2 text-blueteal" />
                    Mindful Moments
                  </TabsTrigger>
                  <TabsTrigger value="builder" className="flex-shrink-0 data-[state=active]:bg-white/60">Practice Builder</TabsTrigger>
                  <TabsTrigger value="history" className="flex-shrink-0 data-[state=active]:bg-white/60">History</TabsTrigger>
                </TabsList>
              </ScrollArea>
            </div>
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

          <TabsContent value="moments" className="w-full max-w-full px-0">
            <div className="mt-4">
              <MindfulMomentsTab />
            </div>
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
    </div>
  );
};

export default MindfulnessExercises;
