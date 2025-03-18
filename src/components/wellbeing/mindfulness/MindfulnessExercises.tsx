
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscoverTab from "./tabs/DiscoverTab";
import HistoryTab from "./tabs/HistoryTab";
import RecommendedTab from "./tabs/RecommendedTab";
import MindfulMomentsTab from "./tabs/MindfulMomentsTab";
import PracticeBuilder from "./PracticeBuilder";
import { useMindfulnessPractices } from "./hooks/useMindfulnessPractices";
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { PremiumFeatureGuard } from "@/components/premium/PremiumFeatureGuard";

const MindfulnessExercises = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const { 
    selectedPractice, 
    completedPractices, 
    savedPractices,
    handleSelectPractice, 
    handleCompletePractice,
    getTimeOfDay 
  } = useMindfulnessPractices();
  
  // Get the real battery level from the social battery context
  const { batteryLevel } = useSocialBattery();
  
  return (
    <div className="space-y-4 w-full max-w-full">
      <Tabs 
        defaultValue="discover" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="history">My Practices</TabsTrigger>
          <TabsTrigger value="moments">Mindful Moments</TabsTrigger>
          <TabsTrigger value="builder">Practice Builder</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover" className="w-full max-w-full">
          <DiscoverTab 
            selectedPractice={selectedPractice}
            selectedPracticeId={selectedPractice?.id}
            completedPractices={completedPractices}
            onSelectPractice={handleSelectPractice}
            onCompletePractice={handleCompletePractice}
          />
        </TabsContent>
        
        <TabsContent value="recommended">
          <PremiumFeatureGuard 
            feature="personalized-recommendations"
            title="Premium Recommendations"
            description="Personalized practice recommendations require a premium subscription"
          >
            <RecommendedTab 
              timeOfDay={getTimeOfDay()}
              batteryLevel={batteryLevel}
              completedPractices={completedPractices}
              onSelectPractice={handleSelectPractice}
            />
          </PremiumFeatureGuard>
        </TabsContent>
        
        <TabsContent value="history">
          <HistoryTab 
            completedPractices={completedPractices} 
            savedPractices={savedPractices}
            onSelectPractice={handleSelectPractice}
          />
        </TabsContent>
        
        <TabsContent value="moments">
          <MindfulMomentsTab />
        </TabsContent>
        
        <TabsContent value="builder">
          <PremiumFeatureGuard 
            feature="custom-ritual-creation"
            title="Premium Practice Builder"
            description="Creating custom mindfulness practices requires a premium subscription"
          >
            <PracticeBuilder />
          </PremiumFeatureGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MindfulnessExercises;
