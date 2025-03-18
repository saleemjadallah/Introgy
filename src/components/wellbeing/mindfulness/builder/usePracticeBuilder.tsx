
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MindfulnessPractice } from '@/types/mindfulness';
import { useFormState } from './hooks/useFormState';
import { generatePractice } from './services/practiceGenerationService';
import { useMindfulnessPractices } from '../hooks/useMindfulnessPractices';

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
  const [isSaving, setIsSaving] = useState(false);
  const [generatedPractice, setGeneratedPractice] = useState<MindfulnessPractice | null>(null);
  
  const { toast } = useToast();
  const { handleSavePractice } = useMindfulnessPractices();
  
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
  
  const savePractice = async () => {
    if (!generatedPractice) return;
    
    setIsSaving(true);
    try {
      await handleSavePractice(generatedPractice);
      
      toast({
        title: "Practice Saved",
        description: "Your custom practice has been saved to My Practices",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your practice",
        variant: "destructive"
      });
      console.error("Error saving practice:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    practiceRequest,
    isAdvancedOpen,
    setIsAdvancedOpen,
    isGenerating,
    isSaving,
    generatedPractice,
    handleFocusAreaToggle,
    handleTechniqueToggle,
    handleGenerate,
    savePractice,
    resetForm,
    updateDuration,
    updateSituationType,
    updateSituationDetails,
    updateGoalStatement
  };
};
