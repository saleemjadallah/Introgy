import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Relationship,
  NurturingStats,
  InteractionType,
  RelationshipFrequency,
  RelationshipInsight,
  RelationshipHealth,
  ConnectionSuggestion,
  IntelligentConversationStarter,
  MessageTemplate
} from '@/types/relationship-nurturing';
import { useToast } from '@/hooks/use-toast';
import { useSocialBattery } from '@/hooks/useSocialBattery';
import { addDays, format, isAfter, isBefore, parseISO, subDays } from 'date-fns';
import { ConnectionScheduler, ScheduledInteraction } from '@/types/relationship-nurturing';
import { supabase } from '@/integrations/supabase/client';
import {
  convertDbRelationship,
  convertDbInsight,
  convertDbHealth,
  convertDbSuggestion,
  convertDbStarter,
  convertDbTemplate
} from '@/utils/relationshipTypeConverters';

// Import mock data for fallback when not authenticated
import { 
  mockRelationships,
  mockScheduler,
  generateSuggestedInteractions,
  mockRelationshipInsights,
  mockMessageTemplates,
  mockConnectionSuggestions,
  mockIntelligentConversationStarters,
  mockRelationshipHealth,
  determineEnergyCost
} from '@/data/relationshipNurturingData';

// Import the new modular hooks
import { useRelationshipNurturingData } from '@/hooks/relationship-nurturing/useRelationshipNurturingData';
import { useInteractionsManagement } from '@/hooks/relationship-nurturing/useInteractionsManagement';
import { useInsightsManagement } from '@/hooks/relationship-nurturing/useInsightsManagement';
import { useScheduleManagement } from '@/hooks/relationship-nurturing/useScheduleManagement';
import { useConversationStarters } from '@/hooks/relationship-nurturing/useConversationStarters';

export function useRelationshipNurturing() {
  // This hook will now use the smaller, focused hooks to provide a unified interface
  const { toast } = useToast();
  const { batteryLevel } = useSocialBattery();
  
  // Add missing properties from useRelationshipNurturingData
  const {
    relationships,
    insights,
    stats,
    scheduler,
    isLoading,
    isAuthenticated,
    setInsights,
    saveSchedulerData
  } = useRelationshipNurturingData();
  
  // Add placeholder data for the missing properties
  const relationshipHealth: RelationshipHealth[] = mockRelationshipHealth;
  const connectionSuggestions: ConnectionSuggestion[] = mockConnectionSuggestions;
  const conversationStarters: IntelligentConversationStarter[] = mockIntelligentConversationStarters;
  const messageTemplates: MessageTemplate[] = mockMessageTemplates;
  
  const {
    scheduledInteractions,
    todayInteractions,
    scheduleInteraction,
    updateInteraction,
    completeInteraction,
    skipInteraction,
    rescheduleInteraction,
    generateInteractions,
    updateScheduleSettings
  } = useInteractionsManagement(relationships, scheduler, toast);
  
  const {
    markInsightAsRead,
    markAllInsightsAsRead,
    takeActionOnInsight
  } = useInsightsManagement(insights, connectionSuggestions, isAuthenticated, toast);
  
  const {
    applySuggestion,
    skipSuggestion
  } = useScheduleManagement(connectionSuggestions, scheduleInteraction, isAuthenticated, toast);
  
  const {
    generateMoreConversationStarters,
    copyConversationStarter
  } = useConversationStarters(relationships, conversationStarters, isAuthenticated, batteryLevel, toast);
  
  // State for active relationship
  const [activeRelationship, setActiveRelationship] = useState<Relationship | null>(null);

  // Function to load nurturing data
  const loadNurturingData = () => {
    // No implementation needed for now, as data is loaded in individual hooks
    console.log("Loading nurturing data...");
  };

  // Get context and prompts for a relationship
  const getRelationshipContext = (relationshipId: string) => {
    const relationship = relationships.find(r => r.id === relationshipId);
    if (!relationship) {
      return null;
    }

    // Set as active relationship
    setActiveRelationship(relationship);

    // Find relevant conversation topics
    const suggestedTopics = relationship.conversationTopics
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5);

    // Find recent interactions
    const recentInteractions = relationship.interactionHistory
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    // Find upcoming life events
    const today = new Date();
    const upcomingEvents = relationship.lifeEvents.filter(e => {
      const eventDate = parseISO(e.date);
      return isAfter(eventDate, today);
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3);

    return {
      relationship,
      suggestedTopics,
      recentInteractions,
      upcomingEvents
    };
  };

  return {
    scheduler,
    relationships,
    scheduledInteractions,
    todayInteractions,
    stats,
    isLoading,
    activeRelationship,
    
    // Add missing properties
    relationshipHealth,
    connectionSuggestions,
    conversationStarters,
    messageTemplates,
    loadNurturingData,
    
    // Scheduler functions
    scheduleInteraction,
    updateInteraction,
    completeInteraction,
    skipInteraction,
    rescheduleInteraction,
    generateInteractions,
    updateScheduleSettings,
    getRelationshipContext,
    
    // Intelligent Nurturing Assistant
    insights,
    markInsightAsRead,
    markAllInsightsAsRead,
    applySuggestion,
    skipSuggestion,
    generateMoreConversationStarters,
    copyConversationStarter,
    takeActionOnInsight
  };
}
