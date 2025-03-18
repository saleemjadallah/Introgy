
import { 
  ScheduledInteraction, 
  Relationship, 
  NurturingStats, 
  RelationshipFrequency 
} from '@/types/relationship-nurturing';
import { addDays, format, isAfter, isBefore, parseISO, subDays } from 'date-fns';

/**
 * Calculates relationship nurturing statistics based on interactions and relationships
 */
export const calculateStats = (
  interactions: ScheduledInteraction[], 
  relations: Relationship[],
  relationshipFrequencies: RelationshipFrequency[]
): NurturingStats => {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const startOfWeek = subDays(today, today.getDay());

  const plannedToday = interactions.filter(i => i.scheduledDate === todayStr).length;
  const completedToday = interactions.filter(i => i.scheduledDate === todayStr && i.status === 'completed').length;
  
  const plannedThisWeek = interactions.filter(i => {
    const interactionDate = parseISO(i.scheduledDate);
    return isAfter(interactionDate, startOfWeek) && 
           isBefore(interactionDate, addDays(startOfWeek, 7));
  }).length;
  
  const completedThisWeek = interactions.filter(i => {
    const interactionDate = parseISO(i.scheduledDate);
    return isAfter(interactionDate, startOfWeek) && 
           isBefore(interactionDate, addDays(startOfWeek, 7)) &&
           i.status === 'completed';
  }).length;

  const overdueInteractions = relationshipFrequencies.filter(rf => rf.isOverdue) || [];
  const overdueCount = overdueInteractions.length;
  
  const healthyRelationships = relations.filter(r => {
    const frequency = relationshipFrequencies.find(rf => rf.relationshipId === r.id);
    return frequency && !frequency.isOverdue;
  }).length;

  const needsAttentionCount = relations.length - healthyRelationships;

  const upcomingEvents = relations.flatMap(r => 
    r.lifeEvents.filter(e => {
      const eventDate = parseISO(e.date);
      const daysUntil = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 14;
    })
  ).length;

  return {
    plannedToday,
    completedToday,
    plannedThisWeek,
    completedThisWeek,
    overdueCount,
    healthyRelationships,
    needsAttentionCount,
    upcomingEvents
  };
};
