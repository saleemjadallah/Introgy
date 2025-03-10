
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

export interface Relationship {
  id: string;
  name: string;
  nickname?: string;
  avatar?: string;
  category: 'family' | 'friend' | 'professional' | 'acquaintance';
  importanceLevel: number;
  contactInfo?: {
    email?: string;
    phone?: string;
    socialProfiles?: {
      platform: string;
      handle: string;
    }[];
    birthday?: string;
    notes?: string;
  };
  relationshipContext?: {
    howWeMet?: string;
    knownSince?: string;
    sharedInterests?: string[];
    significantMemories?: string[];
    valueToMe?: string;
  };
  communicationPrefs?: {
    preferredChannel?: string;
    responseExpectations?: string;
    frequencyPreference?: string;
    topicsOfInterest?: string[];
    topicsToAvoid?: string[];
  };
  interactions?: {
    date: string;
    type: string;
    context?: string;
    quality?: number;
    energyCost?: number;
    notes?: string;
    followUpNeeded?: boolean;
    followUpDetails?: string;
  }[];
  nurturingStatus?: {
    lastInteraction?: string;
    nextPlannedInteraction?: string;
    targetFrequency?: number;
    currentHealthScore?: number;
    needsAttention?: boolean;
    attentionReason?: string;
  };
}

export function useRelationships() {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock data for initial UI development
  const mockRelationships: Relationship[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      nickname: 'Sari',
      category: 'friend',
      importanceLevel: 5,
      nurturingStatus: {
        currentHealthScore: 8,
        needsAttention: false
      }
    },
    {
      id: '2',
      name: 'Michael Chen',
      category: 'professional',
      importanceLevel: 3,
      nurturingStatus: {
        currentHealthScore: 5,
        needsAttention: true,
        attentionReason: 'No contact in 3 months'
      }
    },
    {
      id: '3',
      name: 'Robert Smith',
      nickname: 'Bob',
      category: 'family',
      importanceLevel: 5,
      nurturingStatus: {
        currentHealthScore: 9,
        needsAttention: false
      }
    },
    {
      id: '4',
      name: 'Amelia Peterson',
      category: 'acquaintance',
      importanceLevel: 2,
      nurturingStatus: {
        currentHealthScore: 3,
        needsAttention: true,
        attentionReason: 'Relationship declining'
      }
    },
    {
      id: '5',
      name: 'David Williams',
      category: 'friend',
      importanceLevel: 4,
      nurturingStatus: {
        currentHealthScore: 7,
        needsAttention: false
      }
    }
  ];

  useEffect(() => {
    const fetchRelationships = async () => {
      try {
        // For initial development, use mock data
        // Later, replace with actual Supabase query:
        /*
        const { data, error } = await supabase
          .from('relationships')
          .select('*')
          .order('name');
          
        if (error) throw error;
        setRelationships(data || []);
        */
        
        // Using mock data for now
        // Simulate API delay
        setTimeout(() => {
          setRelationships(mockRelationships);
          setIsLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching relationships:', err);
        setError('Failed to load relationships');
        setIsLoading(false);
        
        toast({
          title: 'Error loading relationships',
          description: 'Failed to load your relationships data.',
          variant: 'destructive',
        });
      }
    };

    fetchRelationships();
  }, [toast]);

  const createRelationship = async (newRelationship: Omit<Relationship, 'id'>) => {
    try {
      setIsLoading(true);
      
      // Actual implementation will use Supabase
      /*
      const { data, error } = await supabase
        .from('relationships')
        .insert([newRelationship])
        .select();
        
      if (error) throw error;
      */
      
      // Mock implementation for now
      const mockNewRelationship = {
        ...newRelationship,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      setRelationships(prev => [...prev, mockNewRelationship]);
      
      toast({
        title: 'Contact added',
        description: `${newRelationship.name} has been added to your relationships.`
      });
      
      return mockNewRelationship;
      
    } catch (err) {
      console.error('Error creating relationship:', err);
      toast({
        title: 'Error adding contact',
        description: 'Failed to add new contact.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRelationship = async (id: string, updates: Partial<Relationship>) => {
    try {
      setIsLoading(true);
      
      // Actual implementation will use Supabase
      /*
      const { data, error } = await supabase
        .from('relationships')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      */
      
      // Mock implementation for now
      setRelationships(prev => 
        prev.map(rel => rel.id === id ? { ...rel, ...updates } : rel)
      );
      
      toast({
        title: 'Contact updated',
        description: 'Relationship details have been updated.'
      });
      
    } catch (err) {
      console.error('Error updating relationship:', err);
      toast({
        title: 'Error updating contact',
        description: 'Failed to update contact details.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRelationship = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Actual implementation will use Supabase
      /*
      const { error } = await supabase
        .from('relationships')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      */
      
      // Mock implementation for now
      setRelationships(prev => prev.filter(rel => rel.id !== id));
      
      toast({
        title: 'Contact deleted',
        description: 'The contact has been removed from your relationships.'
      });
      
    } catch (err) {
      console.error('Error deleting relationship:', err);
      toast({
        title: 'Error deleting contact',
        description: 'Failed to delete contact.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    relationships,
    isLoading,
    error,
    createRelationship,
    updateRelationship,
    deleteRelationship
  };
}
