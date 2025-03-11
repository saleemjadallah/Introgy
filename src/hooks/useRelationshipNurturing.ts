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

// Import mock data 
import { 
  mockRelationships,
  mockScheduler,
  generateSuggestedInteractions,
  mockRelationshipInsights,
  mockMessageTemplates,
  mockConnectionSuggestions,
  mockIntelligentConversationStarters,
  mockRelationshipHealth
} from '@/data/relationshipNurturingData';

export function useRelationshipNurturing() {
  const [scheduler, setScheduler] = useState<ConnectionScheduler | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [scheduledInteractions, setScheduledInteractions] = useState<ScheduledInteraction[]>([]);
  const [todayInteractions, setTodayInteractions] = useState<ScheduledInteraction[]>([]);
  const [stats, setStats] = useState<NurturingStats | null>(null);
  const [activeRelationship, setActiveRelationship] = useState<Relationship | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { batteryLevel } = useSocialBattery();
  const { toast } = useToast();
  
  // Intelligent Nurturing Assistant states
  const [insights, setInsights] = useState<RelationshipInsight[]>([]);
  const [relationshipHealth, setRelationshipHealth] = useState<RelationshipHealth[]>([]);
  const [connectionSuggestions, setConnectionSuggestions] = useState<ConnectionSuggestion[]>([]);
  const [conversationStarters, setConversationStarters] = useState<IntelligentConversationStarter[]>([]);
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([]);

  // Load data from localStorage or use mock data
  useEffect(() => {
    const loadNurturingData = () => {
      try {
        // Load scheduler data
        const savedScheduler = localStorage.getItem('nurturingScheduler');
        const schedulerData = savedScheduler ? JSON.parse(savedScheduler) : mockScheduler;
        setScheduler(schedulerData);

        // Load relationships
        const savedRelationships = localStorage.getItem('nurturingRelationships');
        const relationshipsData = savedRelationships ? JSON.parse(savedRelationships) : mockRelationships;
        setRelationships(relationshipsData);

        // Generate scheduled interactions if none exist
        const interactions = schedulerData.scheduledInteractions.length > 0 
          ? schedulerData.scheduledInteractions 
          : generateSuggestedInteractions(relationshipsData, schedulerData);
        
        setScheduledInteractions(interactions);

        // Calculate today's interactions
        const today = format(new Date(), 'yyyy-MM-dd');
        const todaysInteractions = interactions.filter(i => i.scheduledDate === today);
        setTodayInteractions(todaysInteractions);

        // Load Intelligent Nurturing Assistant data
        setInsights(mockRelationshipInsights as RelationshipInsight[]);
        setRelationshipHealth(mockRelationshipHealth as RelationshipHealth[]);
        setConnectionSuggestions(mockConnectionSuggestions as ConnectionSuggestion[]);
        setConversationStarters(mockIntelligentConversationStarters as IntelligentConversationStarter[]);
        
        // Convert message templates to match expected format
        const convertedTemplates = mockMessageTemplates.map(template => ({
          ...template,
          title: template.name, // Map name to title
          body: template.template, // Map template to body
          appropriate_for: [template.category], // Use category as appropriate_for
          energy_required: template.energyRequired // Map energyRequired to energy_required
        }));
        
        setMessageTemplates(convertedTemplates as MessageTemplate[]);

        // Calculate stats
        calculateStats(interactions, relationshipsData);
      } catch (error) {
        console.error('Error loading nurturing data:', error);
        toast({
          title: 'Failed to load relationship data',
          description: 'Something went wrong when loading your relationships. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadNurturingData();
  }, [toast]);

  // Calculate statistics for the dashboard
  const calculateStats = (interactions: ScheduledInteraction[], relations: Relationship[]) => {
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

    const overdueInteractions = scheduler?.relationshipFrequencies.filter(rf => rf.isOverdue) || [];
    const overdueCount = overdueInteractions.length;
    
    // Simple algorithm to determine relationship health based on frequency adherence
    const healthyRelationships = relations.filter(r => {
      const frequency = scheduler?.relationshipFrequencies.find(rf => rf.relationshipId === r.id);
      return frequency && !frequency.isOverdue;
    }).length;

    const needsAttentionCount = relations.length - healthyRelationships;

    const upcomingEvents = relations.flatMap(r => 
      r.lifeEvents.filter(e => {
        const eventDate = parseISO(e.date);
        const daysUntil = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil >= 0 && daysUntil <= 14; // Events in the next 14 days
      })
    ).length;

    setStats({
      plannedToday,
      completedToday,
      plannedThisWeek,
      completedThisWeek,
      overdueCount,
      healthyRelationships,
      needsAttentionCount,
      upcomingEvents
    });
  };

  // Save data to localStorage
  const saveData = () => {
    try {
      if (scheduler) {
        localStorage.setItem('nurturingScheduler', JSON.stringify(scheduler));
      }
      localStorage.setItem('nurturingRelationships', JSON.stringify(relationships));
    } catch (error) {
      console.error('Error saving nurturing data:', error);
      toast({
        title: 'Failed to save changes',
        description: 'Something went wrong when saving your changes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Add a new scheduled interaction
  const scheduleInteraction = (interaction: Omit<ScheduledInteraction, 'id'>) => {
    const newInteraction: ScheduledInteraction = {
      ...interaction,
      id: uuidv4()
    };

    const updatedInteractions = [...scheduledInteractions, newInteraction];
    setScheduledInteractions(updatedInteractions);

    // Update scheduler
    if (scheduler) {
      const updatedScheduler = {
        ...scheduler,
        scheduledInteractions: updatedInteractions
      };
      setScheduler(updatedScheduler);
      
      // If the scheduled date is today, add to today's interactions
      const today = format(new Date(), 'yyyy-MM-dd');
      if (newInteraction.scheduledDate === today) {
        setTodayInteractions([...todayInteractions, newInteraction]);
      }

      // Persist changes
      saveData();
    }

    toast({
      title: 'Interaction scheduled',
      description: `Scheduled to connect with ${newInteraction.relationshipName} on ${format(parseISO(newInteraction.scheduledDate), 'MMM d, yyyy')}.`
    });

    return newInteraction;
  };

  // Update an existing scheduled interaction
  const updateInteraction = (interactionId: string, updates: Partial<ScheduledInteraction>) => {
    const updatedInteractions = scheduledInteractions.map(interaction => {
      if (interaction.id === interactionId) {
        return { ...interaction, ...updates };
      }
      return interaction;
    });

    setScheduledInteractions(updatedInteractions);

    // Update today's interactions if needed
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedTodayInteractions = updatedInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(updatedTodayInteractions);

    // Update scheduler
    if (scheduler) {
      const updatedScheduler = {
        ...scheduler,
        scheduledInteractions: updatedInteractions
      };
      setScheduler(updatedScheduler);

      // Persist changes
      saveData();
    }

    toast({
      title: 'Interaction updated',
      description: 'Your scheduled interaction has been updated.'
    });
  };

  // Mark an interaction as completed
  const completeInteraction = (interactionId: string, notes?: string) => {
    const completedDate = format(new Date(), 'yyyy-MM-dd');

    const updatedInteractions = scheduledInteractions.map(interaction => {
      if (interaction.id === interactionId) {
        return { 
          ...interaction, 
          status: 'completed' as const,
          completedDate,
          ...(notes && { preparationNotes: notes })
        };
      }
      return interaction;
    });

    setScheduledInteractions(updatedInteractions);

    // Update today's interactions
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedTodayInteractions = updatedInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(updatedTodayInteractions);

    // Update scheduler
    if (scheduler) {
      // Find the relationship frequency for this interaction
      const interaction = scheduledInteractions.find(i => i.id === interactionId);
      if (interaction) {
        const updatedFrequencies = scheduler.relationshipFrequencies.map(freq => {
          if (freq.relationshipId === interaction.relationshipId) {
            // Calculate next scheduled date based on frequency
            const nextDate = calculateNextInteractionDate(freq);
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

        const updatedScheduler = {
          ...scheduler,
          scheduledInteractions: updatedInteractions,
          relationshipFrequencies: updatedFrequencies
        };
        setScheduler(updatedScheduler);
      }

      // Persist changes
      saveData();
    }

    // Recalculate stats
    calculateStats(updatedInteractions, relationships);

    toast({
      title: 'Interaction completed',
      description: 'Your interaction has been marked as completed.'
    });
  };

  // Skip an interaction
  const skipInteraction = (interactionId: string, reason?: string) => {
    const updatedInteractions = scheduledInteractions.map(interaction => {
      if (interaction.id === interactionId) {
        return { 
          ...interaction, 
          status: 'skipped' as const,
          ...(reason && { preparationNotes: `Skipped: ${reason}` })
        };
      }
      return interaction;
    });

    setScheduledInteractions(updatedInteractions);

    // Update today's interactions
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedTodayInteractions = updatedInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(updatedTodayInteractions);

    // Update scheduler
    if (scheduler) {
      const updatedScheduler = {
        ...scheduler,
        scheduledInteractions: updatedInteractions
      };
      setScheduler(updatedScheduler);

      // Persist changes
      saveData();
    }

    toast({
      title: 'Interaction skipped',
      description: reason || 'Your interaction has been skipped.'
    });
  };

  // Reschedule an interaction
  const rescheduleInteraction = (interactionId: string, newDate: string, reason?: string) => {
    const updatedInteractions = scheduledInteractions.map(interaction => {
      if (interaction.id === interactionId) {
        return { 
          ...interaction, 
          scheduledDate: newDate,
          status: 'planned' as const,
          ...(reason && { preparationNotes: `Rescheduled: ${reason}` })
        };
      }
      return interaction;
    });

    setScheduledInteractions(updatedInteractions);

    // Update today's interactions
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedTodayInteractions = updatedInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(updatedTodayInteractions);

    // Update scheduler
    if (scheduler) {
      const updatedScheduler = {
        ...scheduler,
        scheduledInteractions: updatedInteractions
      };
      setScheduler(updatedScheduler);

      // Persist changes
      saveData();
    }

    toast({
      title: 'Interaction rescheduled',
      description: `Rescheduled to ${format(parseISO(newDate), 'MMM d, yyyy')}.`
    });
  };

  // Helper function to calculate next scheduled date based on frequency
  const calculateNextInteractionDate = (frequency: RelationshipFrequency): string => {
    const today = new Date();
    let nextDate = today;

    if (frequency.categoryDefault && scheduler) {
      // Find the category default
      const relationship = relationships.find(r => r.id === frequency.relationshipId);
      if (relationship) {
        const categoryDefault = scheduler.categoryDefaults.find(cd => cd.category === relationship.category);
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
              // Approximate month as 30 days
              nextDate = addDays(today, value * 30);
              break;
          }
        }
      }
    } else if (frequency.customFrequency) {
      // Use custom frequency
      const { unit, value } = frequency.customFrequency;
      switch (unit) {
        case 'days':
          nextDate = addDays(today, value);
          break;
        case 'weeks':
          nextDate = addDays(today, value * 7);
          break;
        case 'months':
          // Approximate month as 30 days
          nextDate = addDays(today, value * 30);
          break;
      }
    }

    return format(nextDate, 'yyyy-MM-dd');
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

  // Generate new suggested interactions
  const generateInteractions = () => {
    if (!scheduler || !relationships.length) return [];

    const newInteractions = generateSuggestedInteractions(relationships, scheduler);
    setScheduledInteractions(newInteractions);

    // Update today's interactions
    const today = format(new Date(), 'yyyy-MM-dd');
    const todaysInteractions = newInteractions.filter(i => i.scheduledDate === today);
    setTodayInteractions(todaysInteractions);

    // Update scheduler
    const updatedScheduler = {
      ...scheduler,
      scheduledInteractions: newInteractions
    };
    setScheduler(updatedScheduler);

    // Persist changes
    saveData();

    toast({
      title: 'Interaction schedule generated',
      description: 'New suggested interactions have been added to your schedule.'
    });

    return newInteractions;
  };

  // Update schedule settings
  const updateScheduleSettings = (settings: Partial<ConnectionScheduler['scheduleSettings']>) => {
    if (!scheduler) return;

    const updatedScheduler = {
      ...scheduler,
      scheduleSettings: {
        ...scheduler.scheduleSettings,
        ...settings
      }
    };

    setScheduler(updatedScheduler);
    saveData();

    toast({
      title: 'Settings updated',
      description: 'Your nurturing schedule settings have been updated.'
    });
  };

  // Intelligent Nurturing Assistant functions
  
  // Mark an insight as read (not new)
  const markInsightAsRead = (insightId: string) => {
    setInsights(insights.map(insight => 
      insight.id === insightId ? { ...insight, isNew: false } : insight
    ));
  };

  // Mark all insights as read
  const markAllInsightsAsRead = () => {
    setInsights(insights.map(insight => ({ ...insight, isNew: false })));
    
    toast({
      title: 'All insights marked as read',
      description: 'Your relationship insights have been marked as read.'
    });
  };
  
  // Apply a suggested connection
  const applySuggestion = (suggestionId: string) => {
    const suggestion = connectionSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;
    
    // Create an interaction from the suggestion
    const interaction: Omit<ScheduledInteraction, 'id'> = {
      relationshipId: suggestion.relationshipId,
      relationshipName: suggestion.relationshipName,
      scheduledDate: suggestion.suggestedDate,
      suggestedTimeSlots: [suggestion.suggestedTime],
      interactionType: suggestion.interactionType,
      duration: 
        suggestion.interactionType === 'meet' ? 90 : 
        suggestion.interactionType === 'call' ? 30 : 
        suggestion.interactionType === 'video' ? 45 : 15,
      purpose: "AI-suggested connection",
      preparationNeeded: suggestion.energyLevelRequired > 3,
      preparationNotes: suggestion.reasonForSuggestion,
      status: 'planned',
      energyCost: suggestion.energyLevelRequired
    };
    
    // Schedule the interaction
    scheduleInteraction(interaction);
    
    // Remove the suggestion
    setConnectionSuggestions(connectionSuggestions.filter(s => s.id !== suggestionId));
    
    toast({
      title: 'Suggestion applied',
      description: `Scheduled connection with ${suggestion.relationshipName} for ${format(parseISO(suggestion.suggestedDate), 'MMM d')} at ${suggestion.suggestedTime}.`
    });
  };
  
  // Skip a suggested connection
  const skipSuggestion = (suggestionId: string) => {
    setConnectionSuggestions(connectionSuggestions.filter(s => s.id !== suggestionId));
    
    toast({
      title: 'Suggestion skipped',
      description: 'The connection suggestion has been removed.'
    });
  };
  
  // Generate more conversation starters
  const generateMoreConversationStarters = (relationshipId: string) => {
    setIsLoading(true);
    
    // In a real app, this would be an AI call
    // For now, simulate with a timeout
    setTimeout(() => {
      const relationship = relationships.find(r => r.id === relationshipId);
      if (!relationship) {
        setIsLoading(false);
        return;
      }
      
      // Create a mock new starter
      const newStarter: IntelligentConversationStarter = {
        id: uuidv4(),
        relationshipId,
        topic: 'Recent local events',
        starter: `I just heard about that new ${relationship.interests[0]} event happening next weekend. Have you seen anything about it?`,
        context: `Based on shared interest in ${relationship.interests[0]}`,
        confidenceScore: 0.87,
        source: 'interest'
      };
      
      setConversationStarters([...conversationStarters, newStarter]);
      setIsLoading(false);
      
      toast({
        title: 'New conversation starter generated',
        description: 'AI has generated a new conversation starter based on shared interests.'
      });
    }, 1500);
  };
  
  // Copy conversation starter to clipboard
  const copyConversationStarter = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: 'Copied to clipboard',
      description: 'The conversation starter has been copied to your clipboard.'
    });
  };
  
  // Take action on an insight
  const takeActionOnInsight = (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    if (!insight) return;
    
    // Mark the insight as read
    markInsightAsRead(insightId);
    
    // Different actions based on insight type
    switch (insight.type) {
      case 'connection_gap':
        // Create a suggestion from this insight
        const newSuggestion: ConnectionSuggestion = {
          id: uuidv4(),
          relationshipId: insight.relationshipId,
          relationshipName: insight.relationshipName,
          suggested: true,
          suggestedDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
          suggestedTime: '18:30',
          interactionType: 'call',
          reasonForSuggestion: insight.recommendation,
          energyLevelRequired: 4,
          priority: 3,
          expectedResponse: 'fast'
        };
        setConnectionSuggestions([...connectionSuggestions, newSuggestion]);
        break;
        
      case 'conversation_suggestion':
        // Generate a conversation starter from this insight
        const newStarter: IntelligentConversationStarter = {
          id: uuidv4(),
          relationshipId: insight.relationshipId,
          topic: insight.title,
          starter: insight.recommendation,
          context: insight.description,
          confidenceScore: 0.9,
          source: 'life_event'
        };
        setConversationStarters([...conversationStarters, newStarter]);
        break;
        
      default:
        // For other insights, just acknowledge
        break;
    }
    
    toast({
      title: 'Action taken',
      description: 'Recommended action has been applied based on the insight.'
    });
  };

  return {
    // Base nurturing data
    scheduler,
    relationships,
    scheduledInteractions,
    todayInteractions,
    stats,
    isLoading,
    activeRelationship,
    
    // Base nurturing functions
    scheduleInteraction,
    updateInteraction,
    completeInteraction,
    skipInteraction,
    rescheduleInteraction,
    getRelationshipContext,
    generateInteractions,
    updateScheduleSettings,
    setActiveRelationship,
    
    // Intelligent Nurturing Assistant data
    insights,
    relationshipHealth,
    connectionSuggestions,
    conversationStarters,
    messageTemplates,
    
    // Intelligent Nurturing Assistant functions
    markInsightAsRead,
    markAllInsightsAsRead,
    applySuggestion,
    skipSuggestion,
    generateMoreConversationStarters,
    copyConversationStarter,
    takeActionOnInsight
  };
}
