import { socialStrategiesData } from "@/data/socialStrategiesData";
import { Strategy } from "@/types/social-strategies";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const loadStrategiesFromStorage = async (): Promise<Strategy[]> => {
  try {
    // First try to get strategies from Supabase (for logged in users)
    const { data: session } = await supabase.auth.getSession();
    
    if (session && session.session) {
      // User is logged in, try to get their saved strategies
      const { data: savedStrategies, error } = await supabase
        .from('social_strategies')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (savedStrategies && savedStrategies.length > 0) {
        console.log("Loaded strategies from Supabase:", savedStrategies.length);
        return savedStrategies;
      } else {
        // No strategies found in Supabase, initialize with mock data
        // We only need to do this once per user
        const initialStrategies = socialStrategiesData.map(strategy => ({
          ...strategy,
          user_id: session.session?.user.id
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
      // We need to handle this as an upsert operation
      // First delete all existing strategies
      const { error: deleteError } = await supabase
        .from('social_strategies')
        .delete()
        .eq('user_id', session.session.user.id);
        
      if (deleteError) {
        throw deleteError;
      }
      
      // Then insert the updated strategies
      const strategiesWithUserId = strategies.map(strategy => ({
        ...strategy,
        user_id: session.session?.user.id
      }));
      
      const { error: insertError } = await supabase
        .from('social_strategies')
        .insert(strategiesWithUserId);
        
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
