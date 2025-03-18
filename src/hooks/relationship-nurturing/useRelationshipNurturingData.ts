
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSchedulerData } from './useSchedulerData';
import { useInsights } from './useInsights';
import { useNurturingStats } from './useNurturingStats';
import { mockRelationships, mockScheduler } from '@/data/relationshipNurturingData';
import { ConnectionScheduler, Relationship } from '@/types/relationship-nurturing';

// Helper to convert DB format to app format
const convertDbRelationshipToApp = (dbRelationship: any): Relationship => ({
  id: dbRelationship.id,
  name: dbRelationship.name,
  category: dbRelationship.category,
  importance: dbRelationship.importance_level || 1,
  notes: "",
  contactMethods: [],
  interests: [],
  lifeEvents: [],
  conversationTopics: [],
  interactionHistory: []
});

export function useRelationshipNurturingData() {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { 
    scheduler, 
    isLoading: isSchedulerLoading,
    saveSchedulerData 
  } = useSchedulerData();

  const { insights, setInsights } = useInsights(isAuthenticated);
  const { stats } = useNurturingStats(
    relationships, 
    scheduler?.scheduledInteractions || [], 
    scheduler?.relationshipFrequencies || []
  );

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    checkAuth();
  }, []);

  // Load relationships data
  useEffect(() => {
    const loadRelationships = async () => {
      if (!isAuthenticated) {
        setRelationships(mockRelationships);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('relationships')
          .select('*');

        if (error) throw error;
        
        // Convert DB format to app format
        const convertedRelationships = data 
          ? data.map(convertDbRelationshipToApp)
          : mockRelationships;
          
        setRelationships(convertedRelationships);
      } catch (error) {
        console.error('Error loading relationships:', error);
        setRelationships(mockRelationships);
      }
    };

    loadRelationships();
  }, [isAuthenticated]);

  return {
    scheduler,
    relationships,
    insights,
    stats,
    isLoading: isLoading || isSchedulerLoading,
    isAuthenticated,
    setInsights,
    saveSchedulerData
  };
}
