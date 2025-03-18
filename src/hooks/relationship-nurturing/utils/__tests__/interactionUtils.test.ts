
import { describe, it, expect } from 'vitest';
import { addDays, format } from 'date-fns';
import { calculateNextInteractionDate } from '../interactionUtils';
import { RelationshipFrequency, CategoryDefault, Relationship } from '@/types/relationship-nurturing';

describe('interactionUtils', () => {
  describe('calculateNextInteractionDate', () => {
    const mockRelationship: Relationship = {
      id: '1',
      name: 'Test User',
      category: 'family',
      importance: 5,
      notes: '',
      contactMethods: [],
      interests: [],
      lifeEvents: [],
      conversationTopics: [],
      interactionHistory: []
    };

    const mockCategoryDefaults: CategoryDefault[] = [
      {
        category: 'family',
        frequency: {
          unit: 'days',
          value: 7
        }
      }
    ];

    const mockRelationships: Relationship[] = [mockRelationship];

    it('should calculate next date based on category default', () => {
      const frequency: RelationshipFrequency = {
        relationshipId: '1',
        categoryDefault: true,
        lastInteraction: '2024-01-01',
        nextScheduled: '2024-01-08',
        isOverdue: false,
        overdueDays: 0
      };

      const result = calculateNextInteractionDate(frequency, mockRelationships, mockCategoryDefaults);
      const expected = format(addDays(new Date(), 7), 'yyyy-MM-dd');
      expect(result).toBe(expected);
    });

    it('should calculate next date based on custom frequency', () => {
      const frequency: RelationshipFrequency = {
        relationshipId: '1',
        categoryDefault: false,
        customFrequency: {
          unit: 'days',
          value: 14,
          flexibility: 2
        },
        lastInteraction: '2024-01-01',
        nextScheduled: '2024-01-15',
        isOverdue: false,
        overdueDays: 0
      };

      const result = calculateNextInteractionDate(frequency, mockRelationships, mockCategoryDefaults);
      const expected = format(addDays(new Date(), 14), 'yyyy-MM-dd');
      expect(result).toBe(expected);
    });

    it('should handle weeks unit correctly', () => {
      const frequency: RelationshipFrequency = {
        relationshipId: '1',
        categoryDefault: false,
        customFrequency: {
          unit: 'weeks',
          value: 2,
          flexibility: 1
        },
        lastInteraction: '2024-01-01',
        nextScheduled: '2024-01-15',
        isOverdue: false,
        overdueDays: 0
      };

      const result = calculateNextInteractionDate(frequency, mockRelationships, mockCategoryDefaults);
      const expected = format(addDays(new Date(), 14), 'yyyy-MM-dd');
      expect(result).toBe(expected);
    });
  });
});
