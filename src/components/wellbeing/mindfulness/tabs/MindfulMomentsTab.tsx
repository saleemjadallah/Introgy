
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSocialBattery } from "@/hooks/useSocialBattery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MindfulMoment, 
  MomentCategory 
} from "@/types/mindfulness";
import { 
  mindfulMoments, 
  getMomentsByCategory, 
  getSuggestedMoments 
} from "@/data/mindfulness/moments/momentLibrary";
import MomentCard from "../moments/MomentCard";
import MomentPlayerModal from "../moments/MomentPlayerModal";
import { Bell, Brain, Leaf, Timer } from "lucide-react";

// Helper function to get icon by category
const getCategoryIcon = (category: MomentCategory) => {
  switch (category) {
    case 'breathing':
      return <Timer className="h-5 w-5" />;
    case 'grounding':
      return <Leaf className="h-5 w-5" />;
    case 'thought-reset':
      return <Brain className="h-5 w-5" />;
    case 'energy-check':
      return <Bell className="h-5 w-5" />;
    default:
      return <Timer className="h-5 w-5" />;
  }
};

// Helper function to get friendly name for category
const getCategoryName = (category: MomentCategory): string => {
  switch (category) {
    case 'breathing':
      return 'Breathing Techniques';
    case 'grounding':
      return 'Grounding Exercises';
    case 'thought-reset':
      return 'Thought Reset Patterns';
    case 'energy-check':
      return 'Energy Check-ins';
    default:
      return category;
  }
};

const MindfulMomentsTab = () => {
  const [selectedCategory, setSelectedCategory] = useState<MomentCategory>('breathing');
  const [selectedMoment, setSelectedMoment] = useState<MindfulMoment | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const { batteryLevel } = useSocialBattery();
  const { toast } = useToast();
  
  const momentsByCategory = getMomentsByCategory(selectedCategory);
  const suggestedMoments = getSuggestedMoments(batteryLevel);
  
  const handleMomentClick = (moment: MindfulMoment) => {
    setSelectedMoment(moment);
    setIsPlayerOpen(true);
  };
  
  const handleCompleteMoment = (momentId: string) => {
    // In a real implementation, this would call an API to record the completion
    toast({
      title: "Moment completed",
      description: "Your mindful moment has been recorded.",
    });
    setIsPlayerOpen(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Contextual suggestion based on battery level */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Suggested for You</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestedMoments.map(moment => (
            <MomentCard 
              key={moment.id}
              moment={moment}
              onClick={() => handleMomentClick(moment)}
            />
          ))}
        </div>
      </div>
      
      {/* Browse by category */}
      <Tabs defaultValue="breathing" onValueChange={(value) => setSelectedCategory(value as MomentCategory)}>
        <div className="relative overflow-x-auto pb-2">
          <ScrollArea className="w-full" type="scroll" orientation="horizontal">
            <TabsList className="min-w-max">
              <TabsTrigger value="breathing" className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Breathing
              </TabsTrigger>
              <TabsTrigger value="grounding" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Grounding
              </TabsTrigger>
              <TabsTrigger value="thought-reset" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Thought Reset
              </TabsTrigger>
              <TabsTrigger value="energy-check" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Energy Check
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>
        
        <TabsContent value="breathing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Breathing Techniques
              </CardTitle>
              <CardDescription>
                Quick breathing exercises to regulate your energy and calm your nervous system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {momentsByCategory.map(moment => (
                  <MomentCard 
                    key={moment.id}
                    moment={moment}
                    onClick={() => handleMomentClick(moment)}
                    compact
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grounding" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Grounding Exercises
              </CardTitle>
              <CardDescription>
                Quick techniques to bring you back to the present moment when feeling overwhelmed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {momentsByCategory.map(moment => (
                  <MomentCard 
                    key={moment.id}
                    moment={moment}
                    onClick={() => handleMomentClick(moment)}
                    compact
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="thought-reset" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Thought Reset Patterns
              </CardTitle>
              <CardDescription>
                Brief mental exercises to interrupt overthinking and refresh your mind
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {momentsByCategory.map(moment => (
                  <MomentCard 
                    key={moment.id}
                    moment={moment}
                    onClick={() => handleMomentClick(moment)}
                    compact
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="energy-check" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Energy Check-ins
              </CardTitle>
              <CardDescription>
                Quick assessments to gauge your current energy and needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {momentsByCategory.map(moment => (
                  <MomentCard 
                    key={moment.id}
                    moment={moment}
                    onClick={() => handleMomentClick(moment)}
                    compact
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Moment player modal */}
      <MomentPlayerModal 
        isOpen={isPlayerOpen}
        moment={selectedMoment}
        onClose={() => setIsPlayerOpen(false)}
        onComplete={handleCompleteMoment}
      />
    </div>
  );
};

export default MindfulMomentsTab;
