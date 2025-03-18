
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PracticeRequest } from '../types';

export const useFormState = () => {
  const [practiceRequest, setPracticeRequest] = useState<PracticeRequest>({
    duration: 10,
    focusAreas: [],
    situationType: "",
    situationDetails: "",
    goalStatement: "",
    preferredElements: []
  });
  
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
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

  const resetForm = () => {
    setPracticeRequest({
      duration: 10,
      focusAreas: [],
      situationType: "",
      situationDetails: "",
      goalStatement: "",
      preferredElements: []
    });
  };

  return {
    practiceRequest,
    isAdvancedOpen,
    setIsAdvancedOpen,
    handleFocusAreaToggle,
    handleTechniqueToggle,
    updateDuration,
    updateSituationType,
    updateSituationDetails,
    updateGoalStatement,
    resetForm
  };
};
