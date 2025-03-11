
import { describe, it, expect } from 'vitest';
import { format, addDays, subDays } from 'date-fns';
import { calculateStats } from '../statsCalculator';
import { 
  ScheduledInteraction, 
  Relationship, 
  RelationshipFrequency 
} from '@/types/relationship-nurturing';

describe('statsCalculator', () => {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  
  const mockInteractions: ScheduledInteraction[] = [
    {
      id: '1',
      relationshipId: '1',
      relationshipName: 'Test User 1',
      scheduledDate: todayStr,
      suggestedTimeSlots: ['10:00'],
      interactionType: 'call',
      duration: 30,
      purpose: 'Catch up',
      preparationNeeded: false,
      preparationNotes: '',
      status: 'completed',
      energyCost: 5
    },
    {
      id: '2',
      relationshipId: '2',
      relationshipName: 'Test User 2',
      scheduledDate: todayStr,
      suggestedTimeSlots: ['14:00'],
      interactionType: 'message',
      duration: 15,
      purpose: 'Quick hello',
      preparationNeeded: false,
      preparationNotes: '',
      status: 'planned',
      energyCost: 3
    },
    {
      id: '3',
      relationshipId: '3',
      relationshipName: 'Test User 3',
      scheduledDate: format(addDays(today, 2), 'yyyy-MM-dd'),
      suggestedTimeSlots: ['15:00'],
      interactionType: 'call',
      duration: 30,
      purpose: 'Weekly sync',
      preparationNeeded: true,
      preparationNotes: '',
      status: 'planned',
      energyCost: 6
    }
  ];

  const mockRelationships: Relationship[] = [
    {
      id: '1',
      name: 'Test User 1',
      category: 'friend',
      importance: 3,
      notes: '',
      contactMethods: [],
      interests: [],
      lifeEvents: [
        {
          id: '1',
          relationshipId: '1',
          eventType: 'birthday',
          date: format(addDays(today, 7), 'yyyy-MM-dd'),
          description: 'Birthday',
          recurring: true,
          reminderDaysBefore: 7
        }
      ],
      conversationTopics: [],
      interactionHistory: []
    },
    {
      id: '2',
      name: 'Test User 2',
      category: 'family',
      importance: 5,
      notes: '',
      contactMethods: [],
      interests: [],
      lifeEvents: [],
      conversationTopics: [],
      interactionHistory: []
    }
  ];

  const mockFrequencies: RelationshipFrequency[] = [
    {
      relationshipId: '1',
      categoryDefault: true,
      lastInteraction: format(subDays(today, 5), 'yyyy-MM-dd'),
      nextScheduled: todayStr,
      isOverdue: false,
      overdueDays: 0
    },
    {
      relationshipId: '2',
      categoryDefault: true,
      lastInteraction: format(subDays(today, 15), 'yyyy-MM-dd'),
      nextScheduled: format(subDays(today, 1), 'yyyy-MM-dd'),
      isOverdue: true,
      overdueDays: 1
    }
  ];

  it('should calculate stats correctly', () => {
    const stats = calculateStats(mockInteractions, mockRelationships, mockFrequencies);

    expect(stats.plannedToday).toBe(2);
    expect(stats.completedToday).toBe(1);
    expect(stats.plannedThisWeek).toBe(3);
    expect(stats.completedThisWeek).toBe(1);
    expect(stats.overdueCount).toBe(1);
    expect(stats.healthyRelationships).toBe(1);
    expect(stats.needsAttentionCount).toBe(1);
    expect(stats.upcomingEvents).toBe(1);
  });

  it('should handle empty interactions', () => {
    const stats = calculateStats([], mockRelationships, mockFrequencies);

    expect(stats.plannedToday).toBe(0);
    expect(stats.completedToday).toBe(0);
    expect(stats.plannedThisWeek).toBe(0);
    expect(stats.completedThisWeek).toBe(0);
    expect(stats.overdueCount).toBe(1);
    expect(stats.healthyRelationships).toBe(1);
    expect(stats.needsAttentionCount).toBe(1);
    expect(stats.upcomingEvents).toBe(1);
  });

  it('should handle empty relationships', () => {
    const stats = calculateStats(mockInteractions, [], []);

    expect(stats.plannedToday).toBe(2);
    expect(stats.completedToday).toBe(1);
    expect(stats.plannedThisWeek).toBe(3);
    expect(stats.completedThisWeek).toBe(1);
    expect(stats.overdueCount).toBe(0);
    expect(stats.healthyRelationships).toBe(0);
    expect(stats.needsAttentionCount).toBe(0);
    expect(stats.upcomingEvents).toBe(0);
  });
});
