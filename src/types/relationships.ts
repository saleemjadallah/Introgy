
export interface SocialProfile {
  platform: string;
  handle: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  socialProfiles: SocialProfile[];
  birthday: string; // MM-DD format
  notes: string;
}

export interface RelationshipContext {
  howWeMet: string;
  knownSince: string; // YYYY-MM format
  sharedInterests: string[];
  significantMemories: string[];
  valueToMe: string;
}

export interface CommunicationPreferences {
  preferredChannel: string;
  responseExpectations: string;
  frequencyPreference: string;
  topicsOfInterest: string[];
  topicsToAvoid: string[];
}

export interface Interaction {
  date: string;
  type: string;
  context: string;
  quality: number; // 1-5 scale
  energyCost: number; // 1-5 scale
  notes: string;
  followUpNeeded: boolean;
  followUpDetails: string;
}

export interface NurturingStatus {
  lastInteraction: string;
  nextPlannedInteraction: string;
  targetFrequency: number; // days between interactions
  currentHealthScore: number; // 1-10 calculated score
  needsAttention: boolean;
  attentionReason: string;
}

export interface Relationship {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  category: string;
  importanceLevel: number; // 1-5 scale
  contactInfo: ContactInfo;
  relationshipContext: RelationshipContext;
  communicationPrefs: CommunicationPreferences;
  interactions: Interaction[];
  nurturingStatus: NurturingStatus;
}
