
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MindfulnessPractice } from "@/types/mindfulness";
import { getPracticeById } from "@/data/mindfulness";

export const useMindfulnessPractices = () => {
  const [selectedPractice, setSelectedPractice] = useState<MindfulnessPractice | null>(null);
  const [completedPractices, setCompletedPractices] = useState<string[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const storedCompletedPractices = localStorage.getItem('completedPractices');
    if (storedCompletedPractices) {
      const parsedPractices = JSON.parse(storedCompletedPractices);
      setCompletedPractices(parsedPractices.map((p: any) => p.practiceId));
    }
  }, []);
  
  const handleSelectPractice = (id: string) => {
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
  
  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };
  
  return {
    selectedPractice,
    completedPractices,
    handleSelectPractice,
    handleCompletePractice,
    getTimeOfDay
  };
};
