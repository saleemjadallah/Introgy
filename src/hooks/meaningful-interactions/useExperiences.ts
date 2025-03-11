
import { useState, useMemo } from 'react';
import { SharedExperience } from '@/types/meaningful-interactions';
import { useToast } from '@/hooks/use-toast';
import { MeaningfulInteractionFilters } from './types';

export function useExperiences(initialExperiences: SharedExperience[]) {
  const [experiences, setExperiences] = useState<SharedExperience[]>(() => initialExperiences);
  const [experienceFilters, setExperienceFilters] = useState<MeaningfulInteractionFilters>({});
  const [sharedExperiences, setSharedExperiences] = useState<SharedExperience[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if experience filters are empty
  const areExperienceFiltersEmpty = useMemo(() => {
    const { categories, relationshipTypes, energyLevels, topics, searchTerm } = experienceFilters;
    return (
      (!categories || categories.length === 0) &&
      (!relationshipTypes || relationshipTypes.length === 0) &&
      (!energyLevels || energyLevels.length === 0) &&
      (!topics || topics.length === 0) &&
      (!searchTerm || searchTerm.trim() === '')
    );
  }, [experienceFilters]);
  
  // Filtered experiences with optimization
  const filteredExperiences = useMemo(() => {
    // Skip filtering if no filters are applied
    if (areExperienceFiltersEmpty) return experiences;
    
    return experiences.filter(experience => {
      const { categories, relationshipTypes, energyLevels, topics, searchTerm } = experienceFilters;
      
      if (categories && categories.length > 0 && !categories.includes(experience.category)) {
        return false;
      }
      
      if (relationshipTypes && relationshipTypes.length > 0 && 
          !relationshipTypes.some(type => experience.relationshipTypes.includes(type))) {
        return false;
      }
      
      if (energyLevels && energyLevels.length > 0 && 
          !energyLevels.includes(experience.energyRequired)) {
        return false;
      }
      
      if (topics && topics.length > 0 && 
          !topics.some(topic => experience.interestTags.includes(topic))) {
        return false;
      }
      
      if (searchTerm && searchTerm.trim() !== '') {
        const search = searchTerm.toLowerCase();
        return experience.title.toLowerCase().includes(search) || 
              experience.description.toLowerCase().includes(search) ||
              experience.interestTags.some(tag => tag.toLowerCase().includes(search));
      }
      
      return true;
    });
  }, [experiences, experienceFilters, areExperienceFiltersEmpty]);

  // Function to save a shared experience
  const saveSharedExperience = (experience: SharedExperience) => {
    if (sharedExperiences.some(e => e.id === experience.id)) {
      toast({
        description: "This experience is already saved.",
      });
      return;
    }
    
    setSharedExperiences([...sharedExperiences, experience]);
    
    toast({
      description: "Experience saved to your collection.",
    });
  };

  // Function to get experience recommendations
  const getExperienceRecommendations = (
    relationshipType: string,
    energyAvailable: number = 3,
    timeAvailable: number = 60,
    count: number = 3
  ): SharedExperience[] => {
    setIsLoading(true);
    
    try {
      // Filter experiences by relationship type, energy, and time
      const compatibleExperiences = experiences.filter(e => 
        e.relationshipTypes.includes(relationshipType) && 
        e.energyRequired <= energyAvailable &&
        e.timeRequired <= timeAvailable
      );
      
      // Add a random score for variety
      const shuffled = compatibleExperiences
        .map(e => ({ ...e, score: Math.random() }))
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .map(({ score, ...e }) => e); // Remove the score property
      
      setIsLoading(false);
      
      return shuffled;
    } catch (error) {
      console.error('Error getting experience recommendations:', error);
      setIsLoading(false);
      return [];
    }
  };

  return {
    experiences: filteredExperiences,
    experienceFilters,
    setExperienceFilters,
    sharedExperiences,
    setSharedExperiences,
    saveSharedExperience,
    getExperienceRecommendations,
    isLoading
  };
}
