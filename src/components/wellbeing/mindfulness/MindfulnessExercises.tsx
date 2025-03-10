import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MindfulnessCategoryList from "./MindfulnessCategoryList";
import MindfulnessPlayer from "./MindfulnessPlayer";
import PracticeRecommendations from "./PracticeRecommendations";
import { MindfulnessPractice } from "@/types/mindfulness";
import { getPractices, getPracticeById } from "@/data/mindfulness";

const MindfulnessExercises = () => {
  const [selectedPractice, setSelectedPractice] = useState<MindfulnessPractice | null>(null);
  const [completedPractices, setCompletedPractices] = useState<string[]>([]);
  const { toast } = useToast();
  const { batteryLevel } = useSocialBattery();
  
  useEffect(() => {
    const storedCompletedPractices = localStorage.getItem('completedPractices');
    if (storedCompletedPractices) {
      const parsedPractices = JSON.parse(storedCompletedPractices);
      setCompletedPractices(parsedPractices.map((p: any) => p.practiceId));
    }
  }, []);
  
  const handleSelectPractice = (id: string) => {
    const practice = getPracticeById(id);
    if (practice) {
      setSelectedPractice(practice);
      document.getElementById('practice-player')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      toast({
        title: "Practice not found",
        description: "The selected practice could not be found.",
        variant: "destructive"
      });
    }
  };
  
  const handleCompletePractice = (
    effectivenessRating: number, 
    energyChange: number, 
    notes?: string
  ) => {
    if (!selectedPractice) return;
    
    const completedPracticesData = localStorage.getItem('completedPractices') 
      ? JSON.parse(localStorage.getItem('completedPractices')!) 
      : [];
    
    completedPracticesData.push({
      practiceId: selectedPractice.id,
      effectivenessRating,
      energyChange,
      notes,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('completedPractices', JSON.stringify(completedPracticesData));
    
    setCompletedPractices([...completedPractices, selectedPractice.id]);
    
    toast({
      title: "Practice completed",
      description: "Your feedback has been recorded.",
    });
  };
  
  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="discover" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-1">
              <MindfulnessCategoryList 
                onSelectPractice={handleSelectPractice}
                selectedPracticeId={selectedPractice?.id}
              />
            </div>
            
            <div id="practice-player" className="lg:col-span-2">
              {selectedPractice ? (
                <MindfulnessPlayer 
                  practice={selectedPractice}
                  onComplete={handleCompletePractice}
                  isPreviouslyCompleted={completedPractices.includes(selectedPractice.id)}
                />
              ) : (
                <div className="h-64 border rounded-lg flex items-center justify-center p-6 bg-card">
                  <p className="text-center text-muted-foreground">
                    Select a mindfulness practice from the left to begin
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="recommended">
          <div className="mt-6">
            <PracticeRecommendations 
              batteryLevel={batteryLevel}
              timeOfDay={getTimeOfDay()}
              completedPractices={completedPractices}
              onSelectPractice={handleSelectPractice}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="mt-6">
            {completedPractices.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Practice History</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {completedPractices.map(id => {
                    const practice = getPracticeById(id);
                    if (!practice) return null;
                    
                    return (
                      <div 
                        key={id} 
                        className="border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => handleSelectPractice(id)}
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
              <div className="h-64 border rounded-lg flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  You haven't completed any practices yet
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MindfulnessExercises;
