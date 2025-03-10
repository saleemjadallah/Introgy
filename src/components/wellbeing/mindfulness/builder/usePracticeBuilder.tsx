
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MindfulnessPractice } from '@/types/mindfulness';
import { PracticeRequest, focusAreaOptions } from './types';

export const usePracticeBuilder = () => {
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
    When you're ready, slowly open your eyes, carrying this sense of ${request.focusAreas[0]?.toLowerCase() || "calm"} with you.
    Remember that you can return to this practice whenever you need to reconnect with your introvert strengths.
    `;
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

  const updateDuration = (value: number[]) => {
    setPracticeRequest(prev => ({
      ...prev,
      duration: value[0]
    }));
  };

  const updateSituationType = (value: string) => {
    setPracticeRequest(prev => ({
      ...prev,
      situationType: value
    }));
  };

  const updateSituationDetails = (value: string) => {
    setPracticeRequest(prev => ({
      ...prev,
      situationDetails: value
    }));
  };

  const updateGoalStatement = (value: string) => {
    setPracticeRequest(prev => ({
      ...prev,
      goalStatement: value
    }));
  };

  return {
    practiceRequest,
    isAdvancedOpen,
    setIsAdvancedOpen,
    isGenerating,
    generatedPractice,
    handleFocusAreaToggle,
    handleTechniqueToggle,
    handleGenerate,
    resetForm,
    updateDuration,
    updateSituationType,
    updateSituationDetails,
    updateGoalStatement
  };
};
