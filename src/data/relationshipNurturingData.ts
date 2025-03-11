import { v4 as uuidv4 } from 'uuid';
import { 
  ConnectionScheduler, 
  Relationship, 
  ScheduledInteraction,
  InteractionType,
  RelationshipFrequency,
  RelationshipInsight,
  RelationshipHealth,
  ConnectionSuggestion,
  IntelligentConversationStarter,
  MessageTemplate
} from '@/types/relationship-nurturing';
import { addDays, format, isAfter, isBefore, parseISO, subDays } from 'date-fns';

// Import mock data with explicit types
import { 
  mockRelationships,
  mockScheduler,
  generateSuggestedInteractions
} from '@/data/relationshipNurturingData';

// Import types that match the implementation
import type {
  RelationshipInsight as SourceRelationshipInsight,
  MessageTemplate as SourceMessageTemplate,
  IntelligentConversationStarter as SourceIntelligentConversationStarter,
  ConnectionSuggestion as SourceConnectionSuggestion,
  RelationshipHealth as SourceRelationshipHealth
} from '@/data/relationshipNurturingData';

// Import mock data
import {
  mockRelationshipInsights,
  mockMessageTemplates,
  mockConnectionSuggestions,
  mockIntelligentConversationStarters,
  mockRelationshipHealth
} from '@/data/relationshipNurturingData';

// Helper function to determine energy cost of an interaction
const determineEnergyCost = (relationship: Relationship, interactionType: InteractionType): number => {
  // Base cost by relationship category
  let baseCost = 3;  // default for acquaintances
  
  if (relationship.category === 'family') {
    baseCost = 2;  // family is usually lower energy
  } else if (relationship.category === 'close friends') {
    baseCost = 3;  // close friends are medium energy
  } else if (relationship.category === 'work contacts') {
    baseCost = 5;  // work contacts are higher energy
  }
  
  // Adjust by interaction type
  let typeCost = 0;
  
  if (interactionType === 'message' || interactionType === 'email') {
    typeCost = 1;  // lowest energy
  } else if (interactionType === 'call') {
    typeCost = 3;  // medium energy
  } else if (interactionType === 'video') {
    typeCost = 4;  // higher energy
  } else if (interactionType === 'meet') {
    typeCost = 5;  // highest energy
  }
  
  // Calculate final cost (1-10 scale)
  const finalCost = Math.min(10, Math.max(1, baseCost + typeCost));
  return finalCost;
};

export {
  mockRelationships,
  mockScheduler,
  generateSuggestedInteractions,
  mockRelationshipInsights,
  mockMessageTemplates,
  mockConnectionSuggestions,
  mockIntelligentConversationStarters,
  mockRelationshipHealth,
  determineEnergyCost
};
