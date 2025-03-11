import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Relationship,
  RelationshipInsight,
  RelationshipHealth,
  ConnectionSuggestion,
  IntelligentConversationStarter,
  MessageTemplate,
  ConnectionScheduler,
  ScheduledInteraction
} from '@/types/relationship-nurturing';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
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
  mockRelationshipHealth
} from '@/data/relationshipNurturingData';

export function useRelationshipNurturingData() {
  const [scheduler, setScheduler] = useState<ConnectionScheduler | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [scheduledInteractions, setScheduledInteractions] = useState<ScheduledInteraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
  const loadNurturingData = useCallback(async () => {
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
          healthData.map(async health => {
            // Get suggestions for this health record
            const { data: suggestions, error: suggestionsError } = await supabase
              .from('relationship_health_suggestions')
              .select('*')
              .eq('health_id', health.id);
              
            if (suggestionsError) throw suggestionsError;
            
            return {
              ...convertDbHealth(health, supabase),
              suggestions: suggestions || []
            };
          })
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
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, toast]);

  // Save data to Supabase or localStorage
  const saveData = useCallback(async () => {
    try {
      if (isAuthenticated) {
        // If authenticated, we don't need to implement all saving here
        // as each individual hook will handle its own saving logic
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
  }, [isAuthenticated, scheduler, relationships, toast]);

  return {
    scheduler,
    relationships,
    scheduledInteractions,
    insights,
    relationshipHealth,
    connectionSuggestions,
    conversationStarters,
    messageTemplates,
    isLoading,
    isAuthenticated,
    loadNurturingData,
    saveData,
    setInsights,
    setConnectionSuggestions,
    setConversationStarters
  };
}
