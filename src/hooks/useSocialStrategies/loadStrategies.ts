
import { socialStrategiesData } from "@/data/socialStrategiesData";
import { Strategy } from "@/types/social-strategies";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Helper to convert database strategy to our application type
const convertDbStrategyToApp = (dbStrategy: any): Strategy => {
  return {
    id: dbStrategy.id,
    title: dbStrategy.title,
    description: dbStrategy.description,
    scenarioType: dbStrategy.scenarioType,
    type: dbStrategy.type,
    energyLevel: dbStrategy.energyLevel,
    prepTime: dbStrategy.prepTime,
    steps: dbStrategy.steps,
    examplePhrases: dbStrategy.examplePhrases || [],
    challenges: dbStrategy.challenges,
    tags: dbStrategy.tags,
    personalNote: dbStrategy.personalNote || null,
    isFavorite: dbStrategy.isFavorite,
    rating: dbStrategy.rating || null,
    createdAt: new Date(dbStrategy.createdAt),
    updatedAt: new Date(dbStrategy.updatedAt)
  };
};

export const loadStrategiesFromStorage = async (): Promise<Strategy[]> => {
  try {
    // First try to get strategies from Supabase (for logged in users)
    const { data: session } = await supabase.auth.getSession();
    
    if (session && session.session) {
      // User is logged in, try to get their saved strategies
      const { data: savedStrategies, error } = await supabase
        .from('social_strategies')
        .select('*')
        .eq('user_id', session.session.user.id);
      
      if (error) {
        throw error;
      }
      
      if (savedStrategies && savedStrategies.length > 0) {
        console.log("Loaded strategies from Supabase:", savedStrategies.length);
        return savedStrategies.map(convertDbStrategyToApp);
      } else {
        // No strategies found in Supabase, initialize with mock data
        const initialStrategies = socialStrategiesData.map(strategy => ({
          ...strategy,
          user_id: session.session?.user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
        
        const { error: insertError } = await supabase
          .from('social_strategies')
          .insert(initialStrategies);
          
        if (insertError) {
          console.error("Error seeding strategies:", insertError);
          throw insertError;
        }
        
        console.log("Saved initial strategies to Supabase:", initialStrategies.length);
        return initialStrategies;
      }
    } else {
      // User is not logged in, fallback to localStorage
      const savedStrategies = JSON.parse(localStorage.getItem("socialStrategies") || "null");
      
      if (savedStrategies && savedStrategies.length > 0) {
        // If strategies exist in localStorage, use those
        console.log("Loaded strategies from localStorage:", savedStrategies.length);
        return savedStrategies;
      } else {
        // Otherwise use mock data and save to localStorage
        localStorage.setItem("socialStrategies", JSON.stringify(socialStrategiesData));
        console.log("Saved mock strategies to localStorage:", socialStrategiesData.length);
        return socialStrategiesData;
      }
    }
  } catch (error) {
    console.error("Error loading strategies:", error);
    toast.error("Failed to load social strategies");
    
    // If there's an error, still try to use the localStorage or mock data
    try {
      const savedStrategies = JSON.parse(localStorage.getItem("socialStrategies") || "null");
      if (savedStrategies && savedStrategies.length > 0) {
        return savedStrategies;
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    
    // Last resort fallback to mock data
    return socialStrategiesData;
  }
};

export const saveStrategiesToStorage = async (strategies: Strategy[]): Promise<void> => {
  try {
    // First try to save to Supabase (for logged in users)
    const { data: session } = await supabase.auth.getSession();
    
    if (session && session.session) {
      // Handle batch upsert for Supabase
      const strategiesForDb = strategies.map(strategy => ({
        ...strategy,
        user_id: session.session?.user.id,
        updatedAt: new Date()
      }));
      
      // Delete existing strategies first
      const { error: deleteError } = await supabase
        .from('social_strategies')
        .delete()
        .eq('user_id', session.session.user.id);
        
      if (deleteError) {
        throw deleteError;
      }
      
      // Then insert the updated strategies
      const { error: insertError } = await supabase
        .from('social_strategies')
        .insert(strategiesForDb);
        
      if (insertError) {
        throw insertError;
      }
      
      console.log("Saved strategies to Supabase:", strategies.length);
    } else {
      // Fallback to localStorage for users not logged in
      localStorage.setItem("socialStrategies", JSON.stringify(strategies));
      console.log("Saved strategies to localStorage:", strategies.length);
    }
  } catch (error) {
    console.error("Error saving strategies:", error);
    toast.error("Failed to save your changes to social strategies");
    
    // Fallback to localStorage
    localStorage.setItem("socialStrategies", JSON.stringify(strategies));
  }
};
