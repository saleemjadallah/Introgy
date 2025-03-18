
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Loader2, Sparkles } from "lucide-react";
import { focusAreaOptions, situationTypeOptions, techniqueOptions, PracticeRequest } from "./types";

interface PracticeFormProps {
  practiceRequest: PracticeRequest;
  isAdvancedOpen: boolean;
  setIsAdvancedOpen: (open: boolean) => void;
  isGenerating: boolean;
  handleFocusAreaToggle: (area: string) => void;
  handleTechniqueToggle: (technique: string) => void;
  handleGenerate: () => void;
  updateDuration: (value: number[]) => void;
  updateSituationType: (value: string) => void;
  updateSituationDetails: (value: string) => void;
  updateGoalStatement: (value: string) => void;
}

const PracticeForm = ({
  practiceRequest,
  isAdvancedOpen,
  setIsAdvancedOpen,
  isGenerating,
  handleFocusAreaToggle,
  handleTechniqueToggle,
  handleGenerate,
  updateDuration,
  updateSituationType,
  updateSituationDetails,
  updateGoalStatement
}: PracticeFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">
          Practice Duration: {practiceRequest.duration} minutes
        </h3>
        <Slider
          value={[practiceRequest.duration]}
          min={3}
          max={30}
          step={1}
          onValueChange={updateDuration}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Quick (3 min)</span>
          <span>Medium (15 min)</span>
          <span>Deep (30 min)</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">
          Focus Areas (Select up to 3)
        </h3>
        <div className="flex flex-wrap gap-2">
          {focusAreaOptions.map(area => (
            <Badge
              key={area}
              variant={practiceRequest.focusAreas.includes(area) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleFocusAreaToggle(area)}
            >
              {area}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Situation Type</h3>
        <Select
          value={practiceRequest.situationType}
          onValueChange={updateSituationType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a situation type" />
          </SelectTrigger>
          <SelectContent>
            {situationTypeOptions.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Situation Details (Optional)</h3>
        <Textarea
          placeholder="Describe the specific situation you're practicing for..."
          value={practiceRequest.situationDetails}
          onChange={(e) => updateSituationDetails(e.target.value)}
          rows={3}
        />
      </div>
      
      <Collapsible 
        open={isAdvancedOpen} 
        onOpenChange={setIsAdvancedOpen}
        className="border rounded-lg p-4"
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <h3 className="text-sm font-medium">Advanced Options</h3>
            <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? "transform rotate-180" : ""}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Goal Statement (Optional)</h3>
            <Textarea
              placeholder="What would you like to achieve with this practice?"
              value={practiceRequest.goalStatement}
              onChange={(e) => updateGoalStatement(e.target.value)}
              rows={2}
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">
              Preferred Techniques (Select up to 3)
            </h3>
            <div className="flex flex-wrap gap-2">
              {techniqueOptions.map(technique => (
                <Badge
                  key={technique}
                  variant={practiceRequest.preferredElements.includes(technique) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTechniqueToggle(technique)}
                >
                  {technique}
                </Badge>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Button 
        className="w-full" 
        size="lg" 
        onClick={handleGenerate}
        disabled={isGenerating || practiceRequest.focusAreas.length === 0}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Your Practice...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Custom Practice
          </>
        )}
      </Button>
    </div>
  );
};

export default PracticeForm;
