
import { addDays, format, parseISO } from 'date-fns';
import { RelationshipFrequency, CategoryDefault, Relationship } from '@/types/relationship-nurturing';

/**
 * Calculates the next date for an interaction based on frequency settings
 */
export const calculateNextInteractionDate = (
  frequency: RelationshipFrequency, 
  relationships: Relationship[], 
  categoryDefaults: CategoryDefault[]
): string => {
  const today = new Date();
  let nextDate = today;

  if (frequency.categoryDefault) {
    const relationship = relationships.find(r => r.id === frequency.relationshipId);
    if (relationship) {
      const categoryDefault = categoryDefaults.find(cd => cd.category === relationship.category);
      if (categoryDefault) {
        const { unit, value } = categoryDefault.frequency;
        switch (unit) {
          case 'days':
            nextDate = addDays(today, value);
            break;
          case 'weeks':
            nextDate = addDays(today, value * 7);
            break;
          case 'months':
            nextDate = addDays(today, value * 30);
            break;
        }
      }
    }
  } else if (frequency.customFrequency) {
    const { unit, value } = frequency.customFrequency;
    switch (unit) {
      case 'days':
        nextDate = addDays(today, value);
        break;
      case 'weeks':
        nextDate = addDays(today, value * 7);
        break;
      case 'months':
        nextDate = addDays(today, value * 30);
        break;
    }
  }

  return format(nextDate, 'yyyy-MM-dd');
};
