
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MindfulnessPractice } from '@/types/mindfulness';
import { useFormState } from './hooks/useFormState';
import { generatePractice } from './services/practiceGenerationService';

export const usePracticeBuilder = () => {
  const {
    practiceRequest,
    isAdvancedOpen,
    setIsAdvancedOpen,
    handleFocusAreaToggle,
    handleTechniqueToggle,
    updateDuration,
    updateSituationType,
    updateSituationDetails,
    updateGoalStatement,
    resetForm: resetFormState
  } = useFormState();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPractice, setGeneratedPractice] = useState<MindfulnessPractice | null>(null);
  
  const { toast } = useToast();
  
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
      const mockPractice = await generatePractice(practiceRequest);
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
    resetFormState();
    setGeneratedPractice(null);
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
