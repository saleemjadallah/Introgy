
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MindfulnessPractice } from "@/types/mindfulness";
import { getPracticeById } from "@/data/mindfulness";

export const useMindfulnessPractices = () => {
  const [selectedPractice, setSelectedPractice] = useState<MindfulnessPractice | null>(null);
  const [completedPractices, setCompletedPractices] = useState<string[]>([]);
  const [savedPractices, setSavedPractices] = useState<MindfulnessPractice[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load completed practices
    const storedCompletedPractices = localStorage.getItem('completedPractices');
    if (storedCompletedPractices) {
      const parsedPractices = JSON.parse(storedCompletedPractices);
      setCompletedPractices(parsedPractices.map((p: any) => p.practiceId));
    }
    
    // Load saved practices
    const storedSavedPractices = localStorage.getItem('savedPractices');
    if (storedSavedPractices) {
      const parsedSavedPractices = JSON.parse(storedSavedPractices);
      setSavedPractices(parsedSavedPractices);
    }
  }, []);
  
  const handleSelectPractice = (id: string) => {
    // First check if it's a saved custom practice
    const savedPractice = savedPractices.find(p => p.id === id);
    
    if (savedPractice) {
      setSelectedPractice(savedPractice);
      document.getElementById('practice-player')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // If not a saved practice, check library practices
    const practice = getPracticeById(id);
    if (practice) {
      setSelectedPractice(practice);
      document.getElementById('practice-player')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      toast({
        title: "Practice not found",
        description: "The selected practice could not be found.",
        variant: "destructive"
      });
    }
  };
  
  const handleCompletePractice = (
    effectivenessRating: number, 
    energyChange: number, 
    notes?: string
  ) => {
    if (!selectedPractice) return;
    
    const completedPracticesData = localStorage.getItem('completedPractices') 
      ? JSON.parse(localStorage.getItem('completedPractices')!) 
      : [];
    
    completedPracticesData.push({
      practiceId: selectedPractice.id,
      effectivenessRating,
      energyChange,
      notes,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('completedPractices', JSON.stringify(completedPracticesData));
    
    setCompletedPractices([...completedPractices, selectedPractice.id]);
    
    toast({
      title: "Practice completed",
      description: "Your feedback has been recorded.",
    });
  };
  
  const handleSavePractice = async (practice: MindfulnessPractice): Promise<void> => {
    // First check if this practice is already saved
    const existingIndex = savedPractices.findIndex(p => p.id === practice.id);
    
    let updatedSavedPractices: MindfulnessPractice[];
    
    if (existingIndex >= 0) {
      // Update existing practice
      updatedSavedPractices = [...savedPractices];
      updatedSavedPractices[existingIndex] = practice;
    } else {
      // Add new practice
      updatedSavedPractices = [...savedPractices, practice];
    }
    
    // Save to localStorage
    localStorage.setItem('savedPractices', JSON.stringify(updatedSavedPractices));
    
    // Update state
    setSavedPractices(updatedSavedPractices);
    
    return Promise.resolve();
  };
  
  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };
  
  return {
    selectedPractice,
    completedPractices,
    savedPractices,
    handleSelectPractice,
    handleCompletePractice,
    handleSavePractice,
    getTimeOfDay
  };
};
