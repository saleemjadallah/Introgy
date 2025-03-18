
import React from "react";
import { Button } from "@/components/ui/button";
import { ScenarioCategory } from "@/types/social-strategies";
import { Briefcase, PartyPopper, User, House, Bus, Video, BookOpen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ScenarioTypeGridProps {
  scenarioTypes: ScenarioCategory[];
  onSelectScenario: (scenarioId: string) => void;
}

const ScenarioTypeGrid = ({ scenarioTypes, onSelectScenario }: ScenarioTypeGridProps) => {
  const isMobile = useIsMobile();
  
  // Added color information to each icon
  const scenarioIcons = {
    "professional": <Briefcase className="h-5 w-5 text-teal fill-teal/10" />,
    "social-gatherings": <PartyPopper className="h-5 w-5 text-periwinkle fill-periwinkle/10" />,
    "one-on-one": <User className="h-5 w-5 text-sage fill-sage/10" />,
    "family-events": <House className="h-5 w-5 text-mauve fill-mauve/10" />,
    "public-spaces": <Bus className="h-5 w-5 text-blueteal fill-blueteal/10" />,
    "digital-communication": <Video className="h-5 w-5 text-amber fill-amber/10" />
  };

  // Function to get shortened display name for mobile
  const getDisplayName = (scenarioId: string, name: string) => {
    if (!isMobile) return name;
    
    // Shortened names for mobile view
    const mobileNames = {
      "professional": "Work",
      "social-gatherings": "Social",
      "one-on-one": "1-on-1",
      "family-events": "Family",
      "public-spaces": "Public",
      "digital-communication": "Digital"
    };
    
    return mobileNames[scenarioId] || name;
  };

  return (
    <div className="p-6 text-center">
      <p className="text-sm text-muted-foreground mb-4">
        Select a scenario type to explore strategies
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {scenarioTypes.map((scenario) => (
          <Button
            key={scenario.id}
            variant="outline"
            className="flex flex-col items-center justify-center gap-2 h-auto py-4"
            onClick={() => onSelectScenario(scenario.id)}
          >
            <div className="p-3 rounded-full bg-primary/5">
              {scenarioIcons[scenario.id] || <BookOpen className="h-5 w-5 text-primary fill-primary/10" />}
            </div>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
              {getDisplayName(scenario.id, scenario.name)}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ScenarioTypeGrid;
