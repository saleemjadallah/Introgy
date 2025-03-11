
import { useCallback } from 'react';
import { format } from 'date-fns';
import { 
  RelationshipFrequency,
  ScheduledInteraction,
  Relationship
} from '@/types/relationship-nurturing';
import { calculateNextInteractionDate } from '../utils/interactionUtils';

export function useFrequencyManagement(
  relationships: Relationship[],
  relationshipFrequencies: RelationshipFrequency[],
  categoryDefaults: any[],
  setRelationshipFrequencies: (frequencies: RelationshipFrequency[]) => void
) {
  const updateFrequencyAfterInteraction = useCallback((
    interaction: ScheduledInteraction,
    completedDate: string
  ) => {
    if (!interaction.relationshipId) return;

    const updatedFrequencies = relationshipFrequencies.map(freq => {
      if (freq.relationshipId === interaction.relationshipId) {
        const nextDate = calculateNextInteractionDate(freq, relationships, categoryDefaults);
        return {
          ...freq,
          lastInteraction: completedDate,
          nextScheduled: nextDate,
          isOverdue: false,
          overdueDays: 0
        };
      }
      return freq;
    });

    setRelationshipFrequencies(updatedFrequencies);
  }, [relationships, relationshipFrequencies, categoryDefaults, setRelationshipFrequencies]);

  return { updateFrequencyAfterInteraction };
}
