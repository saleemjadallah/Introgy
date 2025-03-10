
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  ChevronDown, 
  Clock, 
  Brain, 
  Target, 
  Sparkles,
  Loader2
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { MindfulnessPractice } from "@/types/mindfulness";
import { useToast } from "@/hooks/use-toast";

// Types specific to Practice Builder
interface PracticeRequest {
  duration: number;
  focusAreas: string[];
  situationType: string;
  situationDetails: string;
  goalStatement: string;
  preferredElements: string[];
}

const focusAreaOptions = [
  "Social Recovery", 
  "Energy Conservation", 
  "Quiet Strength", 
  "Preparation", 
  "Deep Focus",
  "Self-Acceptance",
  "Stress Reduction",
  "Emotional Regulation"
];

const situationTypeOptions = [
  "Before Social Event",
  "After Social Interaction",
  "During Workday",
  "Morning Routine",
  "Evening Wind-down",
  "Conflict Recovery",
  "Energy Depletion",
  "Decision Making",
  "Creative Block",
  "Other"
];

const techniqueOptions = [
  "Breathing Techniques",
  "Body Scan",
  "Visualization",
  "Guided Imagery",
  "Progressive Relaxation",
  "Loving-Kindness",
  "Mindful Movement",
  "Sound Meditation",
  "Grounding Exercises",
  "Self-Compassion Practice"
];

const PracticeBuilder = () => {
  const [practiceRequest, setPracticeRequest] = useState<PracticeRequest>({
    duration: 10,
    focusAreas: [],
    situationType: "",
    situationDetails: "",
    goalStatement: "",
    preferredElements: []
  });
  
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPractice, setGeneratedPractice] = useState<MindfulnessPractice | null>(null);
  
  const { toast } = useToast();
  
  const handleFocusAreaToggle = (area: string) => {
    setPracticeRequest(prev => {
      if (prev.focusAreas.includes(area)) {
        return {
          ...prev,
          focusAreas: prev.focusAreas.filter(a => a !== area)
        };
      } else {
        // Limit to 3 selections
        if (prev.focusAreas.length >= 3) {
          toast({
            title: "Maximum Selections Reached",
            description: "You can select up to 3 focus areas",
            variant: "destructive"
          });
          return prev;
        }
        return {
          ...prev,
          focusAreas: [...prev.focusAreas, area]
        };
      }
    });
  };
  
  const handleTechniqueToggle = (technique: string) => {
    setPracticeRequest(prev => {
      if (prev.preferredElements.includes(technique)) {
        return {
          ...prev,
          preferredElements: prev.preferredElements.filter(t => t !== technique)
        };
      } else {
        // Limit to 3 selections
        if (prev.preferredElements.length >= 3) {
          toast({
            title: "Maximum Selections Reached",
            description: "You can select up to 3 techniques",
            variant: "destructive"
          });
          return prev;
        }
        return {
          ...prev,
          preferredElements: [...prev.preferredElements, technique]
        };
      }
    });
  };
  
  const handleGenerate = async () => {
    if (practiceRequest.focusAreas.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one focus area",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate API call with a timeout - this would be replaced with a real API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated practice - this would come from the API
      const mockPractice: MindfulnessPractice = {
        id: `custom-${Date.now()}`,
        title: `Custom ${practiceRequest.focusAreas[0]} Practice`,
        category: "Social Recovery", // This would be dynamically set
        subcategory: "Custom Practice",
        duration: practiceRequest.duration,
        description: `A personalized ${practiceRequest.duration}-minute practice focused on ${practiceRequest.focusAreas.join(", ")}.`,
        script: generateMockScript(practiceRequest),
        tags: [...practiceRequest.focusAreas, ...practiceRequest.preferredElements],
        energyImpact: -2, // Default to slightly calming
        expertReviewed: false
      };
      
      setGeneratedPractice(mockPractice);
      
      toast({
        title: "Practice Generated",
        description: "Your custom practice is ready to try",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error creating your practice",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateMockScript = (request: PracticeRequest): string => {
    // This is a placeholder - in a real implementation, this would be generated by an LLM or from templates
    return `
    [Introduction - 1 minute]
    Find a comfortable position, either seated or lying down. Allow your body to settle and your breath to come naturally. 
    As we begin this ${request.duration}-minute practice focused on ${request.focusAreas.join(", ")}, 
    bring your attention to the present moment.
    
    [Body Scan - 2 minutes]
    Bring awareness to your body, starting from the top of your head and moving slowly down to your toes.
    Notice any areas of tension or discomfort without judgment.
    As an introvert, you may notice that certain parts of your body hold tension from social interactions or deep thinking.
    
    [Core Practice - ${request.duration - 5} minutes]
    ${request.focusAreas.includes("Social Recovery") ? 
      "Imagine a protective sphere of energy surrounding you, filtering out external stimulation and creating a space that's just for you. With each breath, feel this sphere becoming stronger and more nurturing." : ""}
    ${request.focusAreas.includes("Energy Conservation") ? 
      "Visualize your energy as a precious resource, a gentle glowing light within you. Notice how this light naturally wants to be directed inward, nourishing your inner world rather than being scattered outward." : ""}
    ${request.focusAreas.includes("Quiet Strength") ? 
      "Connect with the deep well of wisdom that comes from your introvert nature - the ability to observe, to listen, to process deeply. Feel the strength that comes from this thoughtful approach to the world." : ""}
    ${request.situationDetails ? 
      `As you continue breathing deeply, bring to mind the situation you described: ${request.situationDetails}. Notice any sensations or emotions that arise without judgment.` : ""}
    
    [Closing - 2 minutes]
    Gradually begin to deepen your breath, gently wiggling your fingers and toes.
    When you're ready, slowly open your eyes, carrying this sense of ${request.focusAreas[0].toLowerCase()} with you.
    Remember that you can return to this practice whenever you need to reconnect with your introvert strengths.
    `;
  };
  
  const resetForm = () => {
    setPracticeRequest({
      duration: 10,
      focusAreas: [],
      situationType: "",
      situationDetails: "",
      goalStatement: "",
      preferredElements: []
    });
    setGeneratedPractice(null);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Intelligent Practice Builder</CardTitle>
          <CardDescription>
            Create a personalized mindfulness practice tailored to your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!generatedPractice ? (
            <>
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
                    onValueChange={(values) => {
                      setPracticeRequest(prev => ({
                        ...prev,
                        duration: values[0]
                      }));
                    }}
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
                    onValueChange={(value) => {
                      setPracticeRequest(prev => ({
                        ...prev,
                        situationType: value
                      }));
                    }}
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
                    onChange={(e) => {
                      setPracticeRequest(prev => ({
                        ...prev,
                        situationDetails: e.target.value
                      }));
                    }}
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
                        onChange={(e) => {
                          setPracticeRequest(prev => ({
                            ...prev,
                            goalStatement: e.target.value
                          }));
                        }}
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
              </div>
              
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
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{generatedPractice.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {generatedPractice.duration} minutes • Custom Practice
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{generatedPractice.duration} min</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {generatedPractice.tags.slice(0, 5).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{generatedPractice.description}</p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Practice Script</h4>
                <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-line">
                  {generatedPractice.script}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {generatedPractice ? (
            <>
              <Button 
                variant="outline" 
                onClick={resetForm}
              >
                Create Another
              </Button>
              <Button>
                Save to My Practices
              </Button>
            </>
          ) : (
            <div className="text-xs text-muted-foreground italic w-full text-center">
              Your practice will be customized based on your selections and learning from past preferences
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PracticeBuilder;
