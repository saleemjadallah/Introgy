
import { Strategy } from "@/types/social-strategies";
import { toast } from "sonner";
import { getAllStrategies, saveStrategiesToLocalStorage } from "./strategyUtils";

export function useStrategyNotes() {
  // Save personal note to a strategy
  const saveNote = (strategyId: string, note: string) => {
    try {
      // Get all strategies from localStorage
      const allStrategies = getAllStrategies();
      
      // Update the note for the selected strategy
      const updatedStrategies = allStrategies.map((s: Strategy) =>
        s.id === strategyId
          ? { ...s, personalNote: note, updatedAt: new Date() }
          : s
      );
      
      // Save back to localStorage
      saveStrategiesToLocalStorage(updatedStrategies);
      
      toast.success("Note saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
      return false;
    }
  };

  return { saveNote };
}
