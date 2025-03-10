
import { MindfulnessPractice } from "@/types/mindfulness";
import { PracticeRequest } from "../types";
import { generateMockScript } from "./scriptGenerationService";

export const generatePractice = async (practiceRequest: PracticeRequest): Promise<MindfulnessPractice> => {
  // Simulate API call with a timeout - this would be replaced with a real API call
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock generated practice - this would come from the API
  const mockPractice: MindfulnessPractice = {
    id: `custom-${Date.now()}`,
    title: `Custom ${practiceRequest.focusAreas[0]} Practice`,
    category: "Social Recovery", // This would be dynamically set
    subcategory: "Custom Practice",
    duration: practiceRequest.duration,
    description: `A personalized ${practiceRequest.duration}-minute practice focused on ${practiceRequest.focusAreas.join(", ")}.`,
    script: generateMockScript(practiceRequest),
    tags: [...practiceRequest.focusAreas, ...practiceRequest.preferredElements],
    energyImpact: -2, // Default to slightly calming
    expertReviewed: false
  };
  
  return mockPractice;
};
