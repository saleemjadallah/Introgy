
import { MindfulnessPractice, PracticeFilterOptions } from "@/types/mindfulness";
import { socialRecoveryPractices } from "./categories/socialRecovery";
import { energyConservationPractices } from "./categories/energyConservation";
import { quietStrengthPractices } from "./categories/quietStrength";
import { preparationPractices } from "./categories/preparation";
import { deepFocusPractices } from "./categories/deepFocus";

// Combine all practices
export const mindfulnessPractices: MindfulnessPractice[] = [
  ...socialRecoveryPractices,
  ...energyConservationPractices,
  ...quietStrengthPractices,
  ...preparationPractices,
  ...deepFocusPractices
];

// API endpoint simulation functions
export const getPractices = (filters?: PracticeFilterOptions) => {
  let filteredPractices = [...mindfulnessPractices];
  
  if (filters) {
    if (filters.category) {
      filteredPractices = filteredPractices.filter(practice => 
        practice.category === filters.category
      );
    }
    
    if (filters.maxDuration) {
      filteredPractices = filteredPractices.filter(practice => 
        practice.duration <= filters.maxDuration
      );
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filteredPractices = filteredPractices.filter(practice => 
        filters.tags!.some(tag => practice.tags.includes(tag))
      );
    }
    
    if (filters.energyLevel !== undefined) {
      // If low energy (0-30%), recommend calming practices
      if (filters.energyLevel < 30) {
        filteredPractices = filteredPractices.filter(practice => 
          practice.energyImpact <= 0
        );
      } 
      // If mid energy (30-70%), recommend balanced practices
      else if (filters.energyLevel < 70) {
        filteredPractices = filteredPractices.filter(practice => 
          practice.energyImpact >= -2 && practice.energyImpact <= 2
        );
      } 
      // If high energy (70-100%), recommend grounding practices
      else {
        filteredPractices = filteredPractices.filter(practice => 
          practice.energyImpact <= 0
        );
      }
    }
  }
  
  return filteredPractices;
};

export const getPracticeById = (id: string) => {
  return mindfulnessPractices.find(practice => practice.id === id);
};

export const getRecommendedPractices = (batteryLevel: number, timeOfDay: 'morning' | 'afternoon' | 'evening', previousPractices: string[] = []) => {
  // Simple recommendation algorithm based on energy level and time of day
  let recommendations: MindfulnessPractice[] = [];
  
  // Base recommendations on battery level
  if (batteryLevel < 30) {
    // Low battery: recommend calming, recharging practices
    recommendations = mindfulnessPractices.filter(p => 
      p.energyImpact <= 0 && 
      p.duration <= 10 // Shorter practices when battery is low
    );
  } else if (batteryLevel < 70) {
    // Medium battery: recommend balanced practices
    recommendations = mindfulnessPractices.filter(p => 
      p.energyImpact >= -3 && p.energyImpact <= 3
    );
  } else {
    // High battery: can handle more engaging practices
    recommendations = mindfulnessPractices.filter(p => 
      p.energyImpact >= -5 && p.energyImpact <= 5
    );
  }
  
  // Further filter by time of day
  if (timeOfDay === 'morning') {
    // Morning: more energizing practices
    recommendations = recommendations.filter(p => p.energyImpact >= -2);
  } else if (timeOfDay === 'evening') {
    // Evening: more calming practices
    recommendations = recommendations.filter(p => p.energyImpact <= 2);
  }
  
  // Remove practices that user has recently done
  if (previousPractices.length > 0) {
    recommendations = recommendations.filter(p => !previousPractices.includes(p.id));
  }
  
  // Return top 3 recommendations, or all if less than 3
  return recommendations.slice(0, 3);
};

export const recordCompletedPractice = (
  practiceId: string, 
  effectivenessRating: number, 
  energyChange: number, 
  notes?: string
) => {
  // In a real implementation, this would send data to a backend
  console.log('Practice completed:', {
    practiceId,
    effectivenessRating,
    energyChange,
    notes,
    timestamp: new Date().toISOString()
  });
  
  // For now, just store in localStorage
  const completedPractices = localStorage.getItem('completedPractices') 
    ? JSON.parse(localStorage.getItem('completedPractices')!) 
    : [];
  
  completedPractices.push({
    practiceId,
    effectivenessRating,
    energyChange,
    notes,
    timestamp: new Date().toISOString()
  });
  
  localStorage.setItem('completedPractices', JSON.stringify(completedPractices));
  
  return {
    success: true,
    message: 'Practice completion recorded'
  };
};
