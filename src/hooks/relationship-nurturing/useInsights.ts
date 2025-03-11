
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RelationshipInsight } from '@/types/relationship-nurturing';
import { mockRelationshipInsights } from '@/data/relationshipNurturingData';
import { toast } from 'sonner';

export const useInsights = (isAuthenticated: boolean) => {
  const [insights, setInsights] = useState<RelationshipInsight[]>([]);

  useEffect(() => {
    loadInsights();
  }, [isAuthenticated]);

  const loadInsights = async () => {
    if (!isAuthenticated) {
      setInsights(mockRelationshipInsights);
      return;
    }

    try {
      const { data: insightsData, error } = await supabase
        .from('relationship_insights')
        .select('*');

      if (error) throw error;

      setInsights(insightsData || mockRelationshipInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
      toast.error('Failed to load relationship insights');
      setInsights(mockRelationshipInsights);
    }
  };

  return { insights, setInsights };
};
