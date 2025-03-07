
import { supabase } from "@/integrations/supabase/client";
import { ConversationStarter, SocialEvent } from "@/types/events";
import { toast } from "sonner";

export function useConversationStarters() {
  const generateConversationStarters = async (
    event: SocialEvent, 
    currentPreparation: any
  ) => {
    try {
      // Get user interests (would come from profile in a real implementation)
      const userInterests = "technology, books, hiking, movies, quiet activities";
      
      const response = await supabase.functions.invoke("generate-conversation-starters", {
        body: {
          eventType: event.eventType,
          userInterests,
          attendees: event.knownAttendees?.join(", ")
        }
      });

      if (response.error) throw new Error(response.error.message);
      
      const starters: ConversationStarter[] = response.data.starters;
      
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
      
      return {
        starters,
        updatedPreparation
      };
    } catch (error) {
      console.error("Error generating conversation starters:", error);
      toast.error("Failed to generate conversation starters");
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
