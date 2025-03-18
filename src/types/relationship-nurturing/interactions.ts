
// Type of interaction
export type InteractionType = 'call' | 'message' | 'meet' | 'email' | 'video' | 'other';

// Status for a scheduled interaction
export type InteractionStatus = 'planned' | 'completed' | 'rescheduled' | 'skipped';

// Scheduled interaction
export interface ScheduledInteraction {
  id: string;
  relationshipId: string;
  relationshipName: string;      // For display purposes
  scheduledDate: string;         // YYYY-MM-DD
  suggestedTimeSlots: string[];  // HH:MM format
  interactionType: InteractionType;
  duration: number;              // minutes
  purpose: string;
  preparationNeeded: boolean;
  preparationNotes: string;
  status: InteractionStatus;
  completedDate?: string;
  followUpDate?: string;
  energyCost: number;            // 1-10
}
