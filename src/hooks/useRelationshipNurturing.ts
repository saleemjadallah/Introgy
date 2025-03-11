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

export function useRelationshipNurturing() {
  const [scheduler, setScheduler] = useState<ConnectionScheduler | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [scheduledInteractions, setScheduledInteractions] = useState<ScheduledInteraction[]>([]);
  const [todayInteractions, setTodayInteractions] = useState<ScheduledInteraction[]>([]);
  const [stats, setStats] = useState<NurturingStats | null>(null);
  const [activeRelationship, setActiveRelationship] = useState<Relationship | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { batteryLevel } = useSocialBattery();
  const { toast } = useToast();
  
  // Intelligent Nurturing Assistant states
  const [insights, setInsights] = useState<RelationshipInsight[]>([]);
  const [relationshipHealth, setRelationshipHealth] = useState<RelationshipHealth[]>([]);
  const [connectionSuggestions, setConnectionSuggestions] = useState<ConnectionSuggestion[]>([]);
  const [conversationStarters, setConversationStarters] = useState<IntelligentConversationStarter[]>([]);
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([]);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      // Set up auth state change listener
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setIsAuthenticated(!!session);
      });
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, []);

  // Load data from Supabase or use mock data if not authenticated
  useEffect(() => {
    const loadNurturingData = async () => {
      setIsLoading(true);
      
      try {
        if (isAuthenticated) {
          // Load relationships from Supabase
          const { data: relationshipsData, error: relationshipsError } = await supabase
            .from('relationships')
            .select('*');
            
          if (relationshipsError) throw relationshipsError;
          
          // Load insights from Supabase
          const { data: insightsData, error: insightsError } = await supabase
            .from('relationship_insights')
            .select('*');
            
          if (insightsError) throw insightsError;
          
          // Load relationship health from Supabase
          const { data: healthData, error: healthError } = await supabase
            .from('relationship_health')
            .select('*');
            
          if (healthError) throw healthError;

          // Convert health data and load suggestions for each
          const convertedHealth = await Promise.all(
            healthData.map(health => convertDbHealth(health, supabase))
          );
          
          // Load connection suggestions from Supabase
          const { data: suggestionsData, error: suggestionsError } = await supabase
            .from('connection_suggestions')
            .select('*');
            
          if (suggestionsError) throw suggestionsError;
          
          // Load conversation starters from Supabase
          const { data: startersData, error: startersError } = await supabase
            .from('intelligent_conversation_starters')
            .select('*');
            
          if (startersError) throw startersError;
          
          // Load message templates from Supabase
          const { data: templatesData, error: templatesError } = await supabase
            .from('message_templates')
            .select('*');
            
          if (templatesError) throw templatesError;
          
          // Convert data to application types
          const convertedRelationships = relationshipsData.map(convertDbRelationship);
          const convertedInsights = insightsData.map(convertDbInsight);
          // Health data is already converted above
          const convertedSuggestions = suggestionsData.map(convertDbSuggestion);
          const convertedStarters = startersData.map(convertDbStarter);
          const convertedTemplates = templatesData.map(convertDbTemplate);
          
          setRelationships(convertedRelationships);
          setInsights(convertedInsights);
          setRelationshipHealth(convertedHealth);
          setConnectionSuggestions(convertedSuggestions);
          setConversationStarters(convertedStarters);
          setMessageTemplates(convertedTemplates);
          
          // For now, still use mock scheduler data until we implement that in Supabase
          setScheduler(mockScheduler);
          
          // Generate scheduled interactions if none exist
          const interactions = mockScheduler.scheduledInteractions.length > 0 
            ? mockScheduler.scheduledInteractions 
            : generateSuggestedInteractions(convertedRelationships, mockScheduler);
          
          setScheduledInteractions(interactions);
          
          // Calculate today's interactions
          const today = format(new Date(), 'yyyy-MM-dd');
          const todaysInteractions = interactions.filter(i => i.scheduledDate === today);
          setTodayInteractions(todaysInteractions);
          
          // Calculate stats
          calculateStats(interactions, convertedRelationships);
        } else {
          // Use mock data when not authenticated
          setRelationships(mockRelationships);
          setInsights(mockRelationshipInsights);
          setRelationshipHealth(mockRelationshipHealth);
          setConnectionSuggestions(mockConnectionSuggestions);
          setConversationStarters(mockIntelligentConversationStarters);
          
          // Convert message templates to match expected format
          const convertedTemplates = mockMessageTemplates.map(template => ({
            ...template,
            title: template.name,
            body: template.template,
            appropriate_for: [template.category],
            energy_required: template.energyRequired
          }));
          
          setMessageTemplates(convertedTemplates as MessageTemplate[]);
          
          // Set scheduler and interactions
          setScheduler(mockScheduler);
          
          // Generate scheduled interactions
          const interactions = generateSuggestedInteractions(mockRelationships, mockScheduler);
          setScheduledInteractions(interactions);
          
          // Calculate today's interactions
          const today = format(new Date(), 'yyyy-MM-dd');
          const todaysInteractions = interactions.filter(i => i.scheduledDate === today);
          setTodayInteractions(todaysInteractions);
          
          // Calculate stats
          calculateStats(interactions, mockRelationships);
        }
      } catch (error) {
        console.error('Error loading nurturing data:', error);
        toast({
          title: 'Failed to load relationship data',
          description: 'Something went wrong when loading your relationships. Using mock data for now.',
          variant: 'destructive',
        });
        
        // Fallback to mock data
        setRelationships(mockRelationships);
        setInsights(mockRelationshipInsights);
        setRelationshipHealth(mockRelationshipHealth);
        setConnectionSuggestions(mockConnectionSuggestions);
        setConversationStarters(mockIntelligentConversationStarters);
        setMessageTemplates(mockMessageTemplates as MessageTemplate[]);
        setScheduler(mockScheduler);
        
        // Generate scheduled interactions
        const interactions = generateSuggestedInteractions(mockRelationships, mockScheduler);
        setScheduledInteractions(interactions);
        
        // Calculate today's interactions
        const today = format(new Date(), 'yyyy-MM-dd');
        const todaysInteractions = interactions.filter(i => i.scheduledDate === today);
        setTodayInteractions(todaysInteractions);
        
        // Calculate stats
        calculateStats(interactions, mockRelationships);
      } finally {
        setIsLoading(false);
      }
    };

    loadNurturingData();
  }, [toast, isAuthenticated]);

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

  // Save data to Supabase or localStorage
  const saveData = async () => {
    try {
      if (isAuthenticated) {
        // If authenticated, save to Supabase
        // For now, we'll only implement saving insights
        
        // Save insights
        for (const insight of insights) {
          if (!insight.id.includes('-')) {
            // New insight doesn't have a UUID yet
            const { error } = await supabase
              .from('relationship_insights')
              .insert({
                relationship_id: insight.relationshipId,
                relationship_name: insight.relationshipName,
                title: insight.title,
                description: insight.description,
                recommendation: insight.recommendation,
                type: insight.type,
                severity: insight.severity,
                date_generated: insight.dateGenerated,
                is_new: insight.isNew,
                user_id: (await supabase.auth.getUser()).data.user?.id
              });
              
            if (error) throw error;
          } else {
            // Update existing insight
            const { error } = await supabase
              .from('relationship_insights')
              .update({
                relationship_id: insight.relationshipId,
                relationship_name: insight.relationshipName,
                title: insight.title,
                description: insight.description,
                recommendation: insight.recommendation,
                type: insight.type,
                severity: insight.severity,
                date_generated: insight.dateGenerated,
                is_new: insight.isNew
              })
              .eq('id', insight.id);
              
            if (error) throw error;
          }
        }
      } else {
        // If not authenticated, save to localStorage as before
        if (scheduler) {
          localStorage.setItem('nurturingScheduler', JSON.stringify(scheduler));
        }
        localStorage.setItem('nurturingRelationships', JSON.stringify(relationships));
      }
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
  const scheduleInteraction = async (interaction: Omit<ScheduledInteraction, 'id'>) => {
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
      await saveData();
    }

    toast({
      title: 'Interaction scheduled',
      description: `Scheduled to connect with ${newInteraction.relationshipName} on ${format(parseISO(newInteraction.scheduledDate), 'MMM d, yyyy')}.`
    });

    return newInteraction;
  };

  // Update an existing scheduled interaction
  const updateInteraction = async (interactionId: string, updates: Partial<ScheduledInteraction>) => {
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
      await saveData();
    }

    toast({
      title: 'Interaction updated',
      description: 'Your scheduled interaction has been updated.'
    });
  };

  // Mark an interaction as completed
  const completeInteraction = async (interactionId: string, notes?: string) => {
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
      await saveData();
    }

    // Recalculate stats
    calculateStats(updatedInteractions, relationships);

    toast({
      title: 'Interaction completed',
      description: 'Your interaction has been marked as completed.'
    });
  };

  // Skip an interaction
  const skipInteraction = async (interactionId: string, reason?: string) => {
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
      await saveData();
    }

    toast({
      title: 'Interaction skipped',
      description: reason || 'Your interaction has been skipped.'
    });
  };

  // Reschedule an interaction
  const rescheduleInteraction = async (interactionId: string, newDate: string, reason?: string) => {
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
      await saveData();
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
  const generateInteractions = async () => {
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
    await saveData();

    toast({
      title: 'Interaction schedule generated',
      description: 'New suggested interactions have been added to your schedule.'
    });

    return newInteractions;
  };

  // Update schedule settings
  const updateScheduleSettings = async (settings: Partial<ConnectionScheduler['scheduleSettings']>) => {
    if (!scheduler) return;

    const updatedScheduler = {
      ...scheduler,
      scheduleSettings: {
        ...scheduler.scheduleSettings,
        ...settings
      }
    };

    setScheduler(updatedScheduler);
    await saveData();

    toast({
      title: 'Settings updated',
      description: 'Your nurturing schedule settings have been updated.'
    });
  };

  // Intelligent Nurturing Assistant functions
  
  // Mark an insight as read (not new)
  const markInsightAsRead = async (insightId: string) => {
    const updatedInsights = insights.map(insight => 
      insight.id === insightId ? { ...insight, isNew: false } : insight
    );
    
    setInsights(updatedInsights);
    
    // If authenticated, update in Supabase
    if (isAuthenticated) {
      try {
        const { error } = await supabase
          .from('relationship_insights')
          .update({ is_new: false })
          .eq('id', insightId);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error updating insight:', error);
        toast({
          title: 'Update failed',
          description: 'There was an issue updating the insight status.',
          variant: 'destructive'
        });
      }
    } else {
      // Save to localStorage if not authenticated
      await saveData();
    }
  };

  // Mark all insights as read
  const markAllInsightsAsRead = async () => {
    const updatedInsights = insights.map(insight => ({ ...insight, isNew: false }));
    setInsights(updatedInsights);
    
    // If authenticated, update in Supabase
    if (isAuthenticated) {
      try {
        // Get all the insight IDs that are currently new
        const insightIds = insights
          .filter(insight => insight.isNew)
          .map(insight => insight.id);
          
        if (insightIds.length > 0) {
          const { error } = await supabase
            .from('relationship_insights')
            .update({ is_new: false })
            .in('id', insightIds);
            
          if (error) throw error;
        }
      } catch (error) {
        console.error('Error updating insights:', error);
        toast({
          title: 'Update failed',
          description: 'There was an issue updating the insight statuses.',
          variant: 'destructive'
        });
      }
    } else {
      // Save to localStorage if not authenticated
      await saveData();
    }
    
    toast({
      title: 'All insights marked as read',
      description: 'Your relationship insights have been marked as read.'
    });
  };
  
  // Apply a suggested connection
  const applySuggestion = async (suggestionId: string) => {
    const suggestion = connectionSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;
    
    // Create an interaction from the suggestion
    const interaction: Omit<ScheduledInteraction, 'id'> = {
      relationshipId: suggestion.relationshipId,
      relationshipName: suggestion.relationshipName,
      scheduledDate: suggestion.suggestedDate,
      suggestedTimeSlots: [suggestion.suggestedTime],
      interactionType: suggestion.interactionType as InteractionType,
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
    await scheduleInteraction(interaction);
    
    // Remove the suggestion
    const updatedSuggestions = connectionSuggestions.filter(s => s.id !== suggestionId);
    setConnectionSuggestions(updatedSuggestions);
    
    // If authenticated, update in Supabase
    if (isAuthenticated) {
      try {
        const { error } = await supabase
          .from('connection_suggestions')
          .delete()
          .eq('id', suggestionId);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting suggestion:', error);
        // Toast message already shown by scheduleInteraction
      }
    } else {
      // Save to localStorage if not authenticated
      await saveData();
    }
  };
  
  // Skip a suggested connection
  const skipSuggestion = async (suggestionId: string) => {
    // Remove the suggestion
    const updatedSuggestions = connectionSuggestions.filter(s => s.id !== suggestionId);
    setConnectionSuggestions(updatedSuggestions);
    
    // If authenticated, update in Supabase
    if (isAuthenticated) {
      try {
        const { error } = await supabase
          .from('connection_suggestions')
          .delete()
          .eq('id', suggestionId);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting suggestion:', error);
        toast({
          title: 'Update failed',
          description: 'There was an issue removing the suggestion.',
          variant: 'destructive'
        });
      }
    } else {
      // Save to localStorage if not authenticated
      await saveData();
    }
    
    toast({
      title: 'Suggestion skipped',
      description: 'The connection suggestion has been removed.'
    });
  };
  
  // Generate more conversation starters - uses Supabase Edge Function
  const generateMoreConversationStarters = async (relationshipId: string) => {
    setIsLoading(true);
    
    try {
      const relationship = relationships.find(r => r.id === relationshipId);
      if (!relationship) {
        setIsLoading(false);
        return;
      }
      
      if (isAuthenticated) {
        // Use Supabase Edge Function to generate starters
        const { data, error } = await supabase.functions.invoke('generate-conversation-starters', {
          body: { 
            relationshipId,
            relationshipName: relationship.name,
            interests: relationship.interests,
            pastTopics: relationship.conversationTopics.map(t => t.topic),
            batteryLevel
          }
        });
        
        if (error) throw error;
        
        if (data && data.starters && data.starters.length > 0) {
          // Save the generated starters to Supabase
          const newStarters = data.starters.map((starter: any) => ({
            relationship_id: relationshipId, 
            topic: starter.topic,
            starter: starter.content,
            context: starter.context,
            confidence_score: Math.random() * 0.3 + 0.7, // Random high score for demo
            source: starter.source || 'interest',
            user_id: (await supabase.auth.getUser()).data.user?.id
          }));
          
          const { data: insertedData, error: insertError } = await supabase
            .from('intelligent_conversation_starters')
            .insert(newStarters)
            .select();
            
          if (insertError) throw insertError;
          
          // Add new starters to state
          const mappedStarters = insertedData.map(s => ({
            id: s.id,
            relationshipId: s.relationship_id,
            topic: s.topic,
            starter: s.starter,
            context: s.context,
            confidenceScore: s.confidence_score,
            source: s.source
          })) as IntelligentConversationStarter[];
          
          setConversationStarters([...conversationStarters, ...mappedStarters]);
          
          toast({
            title: 'New conversation starters generated',
            description: `${mappedStarters.length} new starters created for ${relationship.name}.`
          });
        } else {
          throw new Error('No starters were generated');
        }
      } else {
        // Use mock generation in non-authenticated mode
        setTimeout(() => {
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
          
          toast({
            title: 'New conversation starter generated',
            description: 'AI has generated a new conversation starter based on shared interests.'
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Error generating conversation starters:', error);
      toast({
        title: 'Generation failed',
        description: 'Could not generate new conversation starters. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
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
  const takeActionOnInsight = async (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    if (!insight) return;
    
    // Mark the insight as read
    await markInsightAsRead(insightId);
    
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
        
        if (isAuthenticated) {
          try {
            // Save to Supabase
            const { data, error } = await supabase
              .from('connection_suggestions')
              .insert({
                relationship_id: insight.relationshipId,
                relationship_name: insight.relationshipName,
                suggested: true,
                suggested_date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
                suggested_time: '18:30',
                interaction_type: 'call',
                reason_for_suggestion: insight.recommendation,
                energy_level_required: 4,
                priority: '3', // String format for enum
                expected_response: 'fast', // String format for enum
                user_id: (await supabase.auth.getUser()).data.user?.id
              })
