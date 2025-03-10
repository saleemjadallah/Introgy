
import { supabase } from "@/integrations/supabase/client";
import { SocialEvent } from "@/types/events";
import { toast } from "sonner";

export function usePreparationMemo() {
  const generatePreparationMemo = async (
    event: SocialEvent,
    batteryLevel: number,
    currentPreparation: any
  ) => {
    try {
      toast.loading("Generating your preparation memo...");

      console.log("Calling generate-preparation-memo function with:", {
        event,
        batteryLevel
      });

      const response = await supabase.functions.invoke("generate-preparation-memo", {
        body: {
          event: event,
          batteryLevel
        }
      });

      if (response.error) {
        console.error("Supabase function error:", response.error);
        throw new Error(response.error.message || "Failed to call preparation memo function");
      }
      
      if (!response.data) {
        console.error("Empty response data from function");
        throw new Error("No data returned from the preparation memo function");
      }
      
      const { memo, error } = response.data;
      
      if (error) {
        console.error("Function returned error:", error);
        throw new Error(error);
      }
      
      if (!memo) {
        console.error("No memo in response:", response.data);
        throw new Error("No memo was generated. Please try again.");
      }
      
      // Update event preparation with new memo
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
        aiMemo: memo
      };
      
      toast.dismiss();
      toast.success("Preparation memo created successfully");
      
      return {
        memo,
        updatedPreparation
      };
    } catch (error) {
      console.error("Error generating preparation memo:", error);
      toast.dismiss();
      toast.error(`Failed to generate preparation memo: ${error.message}`);
      return {
        memo: null,
        updatedPreparation: currentPreparation
      };
    }
  };

  return {
    generatePreparationMemo
  };
}
