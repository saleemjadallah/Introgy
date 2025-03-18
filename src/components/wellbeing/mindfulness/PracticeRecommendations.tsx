
import { 
  MountainSnow, 
  Sunrise, 
  Sunset, 
  Moon, 
  Battery, 
  ArrowRight 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRecommendedPractices, getPracticeById } from "@/data/mindfulness";
import { useIsMobile } from "@/hooks/use-mobile";

interface PracticeRecommendationsProps {
  batteryLevel: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  completedPractices: string[];
  onSelectPractice: (id: string) => void;
}

const PracticeRecommendations = ({
  batteryLevel,
  timeOfDay,
  completedPractices,
  onSelectPractice
}: PracticeRecommendationsProps) => {
  const recommendations = getRecommendedPractices(batteryLevel, timeOfDay, completedPractices);
  const isMobile = useIsMobile();
  
  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sunrise size={18} />;
      case 'afternoon':
        return <Sunset size={18} />;
      case 'evening':
        return <Moon size={18} />;
      default:
        return <Sunrise size={18} />;
    }
  };
  
  const getEnergyLevelText = () => {
    if (batteryLevel < 30) return "Low Energy";
    if (batteryLevel < 70) return "Moderate Energy";
    return "High Energy";
  };
  
  const getTimeOfDayText = () => {
    switch (timeOfDay) {
      case 'morning':
        return "Morning";
      case 'afternoon':
        return "Afternoon";
      case 'evening':
        return "Evening";
      default:
        return "Current Time";
    }
  };
  
  return (
    <div className="space-y-4 w-full max-w-full">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
        <Card className="flex-1 w-full">
          <CardHeader className="pb-2">
            <CardDescription>Current Battery Level</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <Battery size={18} /> {getEnergyLevelText()} ({batteryLevel}%)
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="flex-1 w-full">
          <CardHeader className="pb-2">
            <CardDescription>Time of Day</CardDescription>
            <CardTitle className="flex items-center gap-2">
              {getTimeIcon()} {getTimeOfDayText()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MountainSnow size={20} /> Recommended Practices
          </CardTitle>
          <CardDescription>
            Personalized suggestions based on your current state
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map(practice => (
                <div 
                  key={practice.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => onSelectPractice(practice.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-[85%]">
                      <h3 className="font-medium">{practice.title}</h3>
                      <p className="text-sm text-muted-foreground">{practice.category}</p>
                      <p className="text-xs mt-1">{practice.duration} min • {practice.subcategory}</p>
                      <p className="text-sm mt-2">{practice.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="mt-1 shrink-0">
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                You've completed all recommended practices for now.
                Check back later or explore the full library.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticeRecommendations;
