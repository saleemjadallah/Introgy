
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
