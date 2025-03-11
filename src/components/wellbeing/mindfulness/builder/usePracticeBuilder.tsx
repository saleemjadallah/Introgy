
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
      const practice = await generatePractice(practiceRequest);
      setGeneratedPractice(practice);
      
      toast({
        title: "Practice Generated",
        description: "Your AI-powered mindfulness practice is ready",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'There was an error creating your practice';
      
      toast({
        title: "Generation Failed",
        description: message,
        variant: "destructive"
      });
      
      console.error("Practice generation error:", error);
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
