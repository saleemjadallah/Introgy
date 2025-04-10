
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScenarioCategory } from "@/types/social-strategies";
import { Briefcase, PartyPopper, User, House, Bus, Video, BookOpen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ScenarioTabsProps {
  scenarioTypes: ScenarioCategory[];
  onSelectScenario: (scenarioId: string) => void;
}

const ScenarioTabs = ({ scenarioTypes, onSelectScenario }: ScenarioTabsProps) => {
  const isMobile = useIsMobile();
  
  // Added color information to each icon
  const scenarioIcons = {
    "professional": <Briefcase className="h-4 w-4 text-teal fill-teal/10" />,
    "social-gatherings": <PartyPopper className="h-4 w-4 text-periwinkle fill-periwinkle/10" />,
    "one-on-one": <User className="h-4 w-4 text-sage fill-sage/10" />,
    "family-events": <House className="h-4 w-4 text-mauve fill-mauve/10" />,
    "public-spaces": <Bus className="h-4 w-4 text-blueteal fill-blueteal/10" />,
    "digital-communication": <Video className="h-4 w-4 text-amber fill-amber/10" />
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
    <div className="px-4 pt-4">
      <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4">
        {scenarioTypes.map((scenario) => (
          <TabsTrigger
            key={scenario.id}
            value={scenario.id}
            className="flex flex-col items-center gap-1 h-auto py-2 hover:text-white"
            onClick={() => onSelectScenario(scenario.id)}
          >
            <div>
              {scenarioIcons[scenario.id] || <BookOpen className="h-4 w-4 text-primary fill-primary/10" />}
            </div>
            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'}`}>
              {getDisplayName(scenario.id, scenario.name)}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};

export default ScenarioTabs;
