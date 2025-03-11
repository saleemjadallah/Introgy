
import React from "react";
import { Button } from "@/components/ui/button";
import { ScenarioCategory } from "@/types/social-strategies";
import { Briefcase, PartyPopper, User, House, Bus, Video, BookOpen } from "lucide-react";

interface ScenarioTypeGridProps {
  scenarioTypes: ScenarioCategory[];
  onSelectScenario: (scenarioId: string) => void;
}

const ScenarioTypeGrid = ({ scenarioTypes, onSelectScenario }: ScenarioTypeGridProps) => {
  const scenarioIcons = {
    "professional": <Briefcase className="h-5 w-5" />,
    "social-gatherings": <PartyPopper className="h-5 w-5" />,
    "one-on-one": <User className="h-5 w-5" />,
    "family-events": <House className="h-5 w-5" />,
    "public-spaces": <Bus className="h-5 w-5" />,
    "digital-communication": <Video className="h-5 w-5" />
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
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              {scenarioIcons[scenario.id] || <BookOpen className="h-5 w-5" />}
            </div>
            <span className="text-sm font-medium">{scenario.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ScenarioTypeGrid;
