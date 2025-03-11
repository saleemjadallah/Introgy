
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscoverTab from "./tabs/DiscoverTab";
import HistoryTab from "./tabs/HistoryTab";
import RecommendedTab from "./tabs/RecommendedTab";
import MindfulMomentsTab from "./tabs/MindfulMomentsTab";
import PracticeBuilder from "./PracticeBuilder";
import { useMindfulnessPractices } from "./hooks/useMindfulnessPractices";

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
  
  // Mock battery level - in a real app this would come from the social battery context
  const batteryLevel = 70; // Default to 70% battery
  
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
          <RecommendedTab 
            timeOfDay={getTimeOfDay()}
            batteryLevel={batteryLevel}
            completedPractices={completedPractices}
            onSelectPractice={handleSelectPractice}
          />
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
          <PracticeBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MindfulnessExercises;
