
import { MindfulnessPractice } from "@/types/mindfulness";
import { PracticeRequest } from "../types";
import { supabase } from "@/integrations/supabase/client";

export const generatePractice = async (practiceRequest: PracticeRequest): Promise<MindfulnessPractice> => {
  try {
    // Call the Supabase edge function to generate the practice
    const { data, error } = await supabase.functions.invoke('generate-mindfulness-practice', {
      body: { practiceRequest }
    });

    if (error) {
      console.error("Error generating practice:", error);
      throw error;
    }

    return data.practice;
  } catch (error) {
    console.error("Practice generation failed:", error);
    throw error;
  }
};
