
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RelationshipInsight } from '@/types/relationship-nurturing';
import { mockRelationshipInsights } from '@/data/relationshipNurturingData';
import { toast } from 'sonner';

// Helper to convert DB format to app format
const convertDbInsightToApp = (dbInsight: any): RelationshipInsight => ({
  id: dbInsight.id,
  relationshipId: dbInsight.relationship_id || "",
  relationshipName: dbInsight.relationship_name,
  title: dbInsight.title,
  description: dbInsight.description,
  recommendation: dbInsight.recommendation,
  type: dbInsight.type,
  severity: dbInsight.severity,
  dateGenerated: dbInsight.date_generated,
  isNew: dbInsight.is_new
});

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

      // Convert DB format to app format
      const convertedInsights = insightsData 
        ? insightsData.map(convertDbInsightToApp)
        : mockRelationshipInsights;
        
      setInsights(convertedInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
      toast.error('Failed to load relationship insights');
      setInsights(mockRelationshipInsights);
    }
  };

  return { insights, setInsights };
};
