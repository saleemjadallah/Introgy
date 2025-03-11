
import { useState, useMemo } from 'react';
import { ConnectionRitual } from '@/types/meaningful-interactions';
import { useToast } from '@/hooks/use-toast';
import { MeaningfulInteractionFilters } from './types';

export function useRituals(initialRituals: ConnectionRitual[]) {
  const [rituals, setRituals] = useState<ConnectionRitual[]>(() => initialRituals);
  const [ritualFilters, setRitualFilters] = useState<MeaningfulInteractionFilters>({});
  const [activeRituals, setActiveRituals] = useState<ConnectionRitual[]>([]);
  const { toast } = useToast();

  // Check if ritual filters are empty
  const areRitualFiltersEmpty = useMemo(() => {
    const { categories, relationshipTypes, energyLevels, searchTerm } = ritualFilters;
    return (
      (!categories || categories.length === 0) &&
      (!relationshipTypes || relationshipTypes.length === 0) &&
      (!energyLevels || energyLevels.length === 0) &&
      (!searchTerm || searchTerm.trim() === '')
    );
  }, [ritualFilters]);
  
  // Filtered rituals with optimization
  const filteredRituals = useMemo(() => {
    // Skip filtering if no filters are applied
    if (areRitualFiltersEmpty) return rituals;
    
    return rituals.filter(ritual => {
      const { categories, relationshipTypes, energyLevels, searchTerm } = ritualFilters;
      
      if (categories && categories.length > 0 && !categories.includes(ritual.interactionType)) {
        return false;
      }
      
      if (relationshipTypes && relationshipTypes.length > 0 && 
          !relationshipTypes.some(type => ritual.relationshipTypes.includes(type))) {
        return false;
      }
      
      if (energyLevels && energyLevels.length > 0 && 
          !energyLevels.includes(ritual.energyCost)) {
        return false;
      }
      
      if (searchTerm && searchTerm.trim() !== '') {
        const search = searchTerm.toLowerCase();
        return ritual.name.toLowerCase().includes(search) || 
              ritual.description.toLowerCase().includes(search);
      }
      
      return true;
    });
  }, [rituals, ritualFilters, areRitualFiltersEmpty]);

  // Function to adopt a ritual
  const adoptRitual = (ritual: ConnectionRitual) => {
    if (activeRituals.some(r => r.id === ritual.id)) {
      toast({
        description: "This ritual is already active.",
      });
      return;
    }
    
    setActiveRituals([...activeRituals, ritual]);
    
    toast({
      description: "Ritual added to your active rituals.",
    });
  };

  // Function to track ritual completion
  const trackRitualCompletion = (ritualId: string, notes: string = '') => {
    // In a real implementation, this would interact with a backend to track history
    toast({
      title: "Ritual Completed",
      description: "Your ritual activity has been recorded.",
    });
  };

  return {
    rituals: filteredRituals,
    ritualFilters,
    setRitualFilters,
    activeRituals,
    setActiveRituals,
    adoptRitual,
    trackRitualCompletion
  };
}
