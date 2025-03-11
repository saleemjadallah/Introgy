
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScenarioCategory } from "@/types/social-strategies";
import { Briefcase, PartyPopper, User, House, Bus, Video, BookOpen } from "lucide-react";

interface ScenarioTabsProps {
  scenarioTypes: ScenarioCategory[];
  onSelectScenario: (scenarioId: string) => void;
}

const ScenarioTabs = ({ scenarioTypes, onSelectScenario }: ScenarioTabsProps) => {
  const scenarioIcons = {
    "professional": <Briefcase className="h-4 w-4" />,
    "social-gatherings": <PartyPopper className="h-4 w-4" />,
    "one-on-one": <User className="h-4 w-4" />,
    "family-events": <House className="h-4 w-4" />,
    "public-spaces": <Bus className="h-4 w-4" />,
    "digital-communication": <Video className="h-4 w-4" />
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
              {scenarioIcons[scenario.id] || <BookOpen className="h-4 w-4" />}
            </div>
            <span className="text-xs">{scenario.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};

export default ScenarioTabs;
