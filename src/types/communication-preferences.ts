export interface ChannelPreference {
  channel: string;
  preference: number; // 1-5 scale, 1 being most preferred
}

export interface ResponseTimeframes {
  email: number; // hours
  text: number;
  voiceCall: number;
  videoCall: number;
}

export interface UrgencyOverrides {
  allowCall: boolean;     // if true, calls ok for urgent matters
  urgentResponseTime: number; // minutes
}

export interface ChannelPreferences {
  rankedChannels: ChannelPreference[];
  responseTimeframes: ResponseTimeframes;
  urgencyOverrides: UrgencyOverrides;
}

export interface InteractionStyle {
  conversationDepth: number;  // 1-10 (small talk to deep conversation)
  preferredTopics: string[];
  avoidTopics: string[];
  preparationNeeded: number;  // 1-10 scale
  interruptionComfort: number; // 1-10 scale
}

export interface GroupSizePreference {
  min: number;
  ideal: number;
  max: number;
}

export interface DurationLimits {
  idealDuration: number;  // minutes
  maxDuration: number;    // minutes
  breakFrequency: number; // minutes between breaks
}

export interface AdvanceNotice {
  preferred: number;     // days
  minimum: number;       // days
}

export interface Boundaries {
  groupSizePreference: GroupSizePreference;
  durationLimits: DurationLimits;
  advanceNotice: AdvanceNotice;
}

export interface RecoveryNeeds {
  afterSmallEvent: number;  // hours
  afterLargeEvent: number;  // hours
}

export interface EnergyManagement {
  depletionSignals: string[];
  exitPhrases: string[];
  recoveryNeeds: RecoveryNeeds;
  checkInPreference: 'none' | 'subtle' | 'direct';
}

export interface VisibilitySettings {
  channelPreferences: 'public' | 'private' | 'friends' | 'colleagues';
  interactionStyle: 'public' | 'private' | 'friends' | 'colleagues';
  boundaries: 'public' | 'private' | 'friends' | 'colleagues';
  energyManagement: 'public' | 'private' | 'friends' | 'colleagues';
}

export interface CommunicationProfile {
  profileId: string;
  userId: string;
  profileName: string;
  isDefault: boolean;
  lastUpdated: Date;
  
  channelPreferences: ChannelPreferences;
  interactionStyle: InteractionStyle;
  boundaries: Boundaries;
  energyManagement: EnergyManagement;
  visibilitySettings: VisibilitySettings;
}

export interface AccessLog {
  accessedAt: Date;
  accessorEmail?: string;
  accessCount: number;
}

export interface SharingConfiguration {
  shareId: string;
  profileId: string;
  createdAt: Date;
  expiresAt: Date;
  accessCode?: string;
  customMessage?: string;
  accessLog: AccessLog[];
  sharingFormat: 'link' | 'card' | 'pdf';
}

// Template profiles to help users get started
export interface ProfileTemplate {
  id: string;
  name: string;
  description: string;
  profile: Partial<CommunicationProfile>; // Partial since users will complete it
}