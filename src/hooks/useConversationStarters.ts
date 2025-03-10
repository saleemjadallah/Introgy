
import { supabase } from "@/integrations/supabase/client";
import { ConversationStarter, SocialEvent } from "@/types/events";
import { toast } from "sonner";

export function useConversationStarters() {
  const generateConversationStarters = async (
    event: SocialEvent, 
    currentPreparation: any
  ) => {
    try {
      toast.loading("Generating conversation starters...");
      
      // Get user interests (would come from profile in a real implementation)
      const userInterests = "technology, books, hiking, movies, quiet activities";
      
      const response = await supabase.functions.invoke("generate-conversation-starters", {
        body: {
          eventType: event.eventType,
          userInterests,
          attendees: event.knownAttendees?.join(", ")
        }
      });

      toast.dismiss();
      
      if (response.error) {
        console.error("Supabase function error:", response.error);
        throw new Error(response.error.message || "Failed to call conversation starters function");
      }
      
      if (!response.data) {
        console.error("Empty response data from function");
        throw new Error("No data returned from the conversation starters function");
      }
      
      const { starters, error } = response.data;
      
      if (error) {
        console.error("Function returned error:", error);
        throw new Error(error);
      }
      
      if (!starters || !Array.isArray(starters)) {
        console.error("Invalid starters in response:", response.data);
        throw new Error("No conversation starters were generated. Please try again.");
      }
      
      // Update event preparation with new starters
      const preparation = currentPreparation || {
        eventId: event.id as string,
        conversationStarters: [],
        exitStrategies: [],
        boundaries: [],
        energyPlan: {
          preEventActivities: [],
          quietTime: 30,
          quietTimeAfter: 60
        }
      };
      
      const updatedPreparation = {
        ...preparation,
        conversationStarters: [
          ...preparation.conversationStarters,
          ...starters
        ]
      };
      
      toast.success("Conversation starters created successfully");
      
      return {
        starters,
        updatedPreparation
      };
    } catch (error) {
      console.error("Error generating conversation starters:", error);
      toast.dismiss();
      toast.error(`Failed to generate conversation starters: ${error.message}`);
      return {
        starters: [],
        updatedPreparation: currentPreparation
      };
    }
  };

  return {
    generateConversationStarters
  };
}
