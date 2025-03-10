import { ProfileTemplate } from '@/types/communication-preferences';

// Channel options are consistent across templates
const commonChannels = [
  { channel: 'Text/Messaging', preference: 1 },
  { channel: 'Email', preference: 2 },
  { channel: 'Video Call', preference: 3 },
  { channel: 'Voice Call', preference: 4 },
  { channel: 'In-person', preference: 5 }
];

// Define templates that users can start with and customize
export const profileTemplates: ProfileTemplate[] = [
  {
    id: 'async-first',
    name: 'Async Communicator',
    description: 'Prefers text-based, asynchronous communication with time to process and respond.',
    profile: {
      profileName: 'Async Communicator',
      isDefault: false,
      channelPreferences: {
        rankedChannels: commonChannels,
        responseTimeframes: {
          email: 24,        // 24 hours
          text: 4,          // 4 hours
          voiceCall: 48,    // 48 hours (2 days)
          videoCall: 48,    // 48 hours (2 days)
        },
        urgencyOverrides: {
          allowCall: true,
          urgentResponseTime: 60, // 60 minutes
        }
      },
      interactionStyle: {
        conversationDepth: 8,
        preferredTopics: ['Specific projects', 'Ideas & concepts', 'Shared interests'],
        avoidTopics: ['Politics', 'Personal finances'],
        preparationNeeded: 7,
        interruptionComfort: 3
      },
      boundaries: {
        groupSizePreference: {
          min: 1,
          ideal: 2,
          max: 5
        },
        durationLimits: {
          idealDuration: 30,
          maxDuration: 60,
          breakFrequency: 30
        },
        advanceNotice: {
          preferred: 3,
          minimum: 1
        }
      },
      energyManagement: {
        depletionSignals: ['Shorter responses', 'Less eye contact', 'Checking the time'],
        exitPhrases: [
          "I should get going, but this was great",
          "I need to wrap up for now"
        ],
        recoveryNeeds: {
          afterSmallEvent: 2,
          afterLargeEvent: 24
        },
        checkInPreference: 'subtle'
      },
      visibilitySettings: {
        channelPreferences: 'public',
        interactionStyle: 'friends',
        boundaries: 'friends',
        energyManagement: 'private'
      }
    }
  },
  {
    id: 'deep-connector',
    name: 'Deep Connector',
    description: 'Values deep, meaningful conversations in small groups with advance planning.',
    profile: {
      profileName: 'Deep Connector',
      isDefault: false,
      channelPreferences: {
        rankedChannels: [
          { channel: 'In-person', preference: 1 },
          { channel: 'Video Call', preference: 2 },
          { channel: 'Text/Messaging', preference: 3 },
          { channel: 'Email', preference: 4 },
          { channel: 'Voice Call', preference: 5 }
        ],
        responseTimeframes: {
          email: 48,       // 48 hours
          text: 12,        // 12 hours
          voiceCall: 24,   // 24 hours
          videoCall: 24,   // 24 hours
        },
        urgencyOverrides: {
          allowCall: true,
          urgentResponseTime: 120, // 120 minutes
        }
      },
      interactionStyle: {
        conversationDepth: 10,
        preferredTopics: ['Personal growth', 'Philosophy', 'Creative pursuits', 'Shared interests'],
        avoidTopics: ['Small talk', 'Office gossip'],
        preparationNeeded: 9,
        interruptionComfort: 2
      },
      boundaries: {
        groupSizePreference: {
          min: 1,
          ideal: 2,
          max: 3
        },
        durationLimits: {
          idealDuration: 90,
          maxDuration: 180,
          breakFrequency: 60
        },
        advanceNotice: {
          preferred: 7,
          minimum: 3
        }
      },
      energyManagement: {
        depletionSignals: ['Becoming quiet', 'Fidgeting', 'Changed tone of voice'],
        exitPhrases: [
          "I've really enjoyed our conversation, but I need to recharge now",
          "I'd love to continue this another time when I have more energy"
        ],
        recoveryNeeds: {
          afterSmallEvent: 6,
          afterLargeEvent: 48
        },
        checkInPreference: 'direct'
      },
      visibilitySettings: {
        channelPreferences: 'public',
        interactionStyle: 'public',
        boundaries: 'friends',
        energyManagement: 'friends'
      }
    }
  },
  {
    id: 'structured-socializer',
    name: 'Structured Socializer',
    description: 'Enjoys social interaction with clear expectations, schedules, and defined purposes.',
    profile: {
      profileName: 'Structured Socializer',
      isDefault: false,
      channelPreferences: {
        rankedChannels: [
          { channel: 'Email', preference: 1 },
          { channel: 'Video Call', preference: 2 },
          { channel: 'In-person', preference: 3 },
          { channel: 'Text/Messaging', preference: 4 },
          { channel: 'Voice Call', preference: 5 }
        ],
        responseTimeframes: {
          email: 24,      // 24 hours
          text: 8,        // 8 hours 
          voiceCall: 24,  // 24 hours
          videoCall: 24,  // 24 hours
        },
        urgencyOverrides: {
          allowCall: false,
          urgentResponseTime: 180, // 180 minutes
        }
      },
      interactionStyle: {
        conversationDepth: 6,
        preferredTopics: ['Specific projects', 'Structured activities', 'Shared interests', 'Learning opportunities'],
        avoidTopics: ['Unstructured socializing', 'Personal problems'],
        preparationNeeded: 8,
        interruptionComfort: 4
      },
      boundaries: {
        groupSizePreference: {
          min: 2,
          ideal: 4,
          max: 8
        },
        durationLimits: {
          idealDuration: 60,
          maxDuration: 120,
          breakFrequency: 45
        },
        advanceNotice: {
          preferred: 5,
          minimum: 2
        }
      },
      energyManagement: {
        depletionSignals: ['Looking at watch/phone', 'Moving toward exit', 'Decreased engagement'],
        exitPhrases: [
          "Let's wrap up in the next few minutes",
          "I have another commitment to get to"
        ],
        recoveryNeeds: {
          afterSmallEvent: 3,
          afterLargeEvent: 24
        },
        checkInPreference: 'subtle'
      },
      visibilitySettings: {
        channelPreferences: 'public',
        interactionStyle: 'colleagues',
        boundaries: 'colleagues',
        energyManagement: 'friends'
      }
    }
  },
  {
    id: 'minimal-custom',
    name: 'Start from Scratch',
    description: 'Create your own custom communication profile with minimal presets.',
    profile: {
      profileName: 'My Communication Style',
      isDefault: false,
      channelPreferences: {
        rankedChannels: commonChannels,
        responseTimeframes: {
          email: 24,
          text: 4,
          voiceCall: 24,
          videoCall: 24,
        },
        urgencyOverrides: {
          allowCall: true,
          urgentResponseTime: 60,
        }
      },
      interactionStyle: {
        conversationDepth: 5,
        preferredTopics: [],
        avoidTopics: [],
        preparationNeeded: 5,
        interruptionComfort: 5
      },
      boundaries: {
        groupSizePreference: {
          min: 1,
          ideal: 3,
          max: 6
        },
        durationLimits: {
          idealDuration: 60,
          maxDuration: 120,
          breakFrequency: 45
        },
        advanceNotice: {
          preferred: 2,
          minimum: 1
        }
      },
      energyManagement: {
        depletionSignals: [],
        exitPhrases: [],
        recoveryNeeds: {
          afterSmallEvent: 2,
          afterLargeEvent: 24
        },
        checkInPreference: 'subtle'
      },
      visibilitySettings: {
        channelPreferences: 'public',
        interactionStyle: 'public',
        boundaries: 'friends',
        energyManagement: 'private'
      }
    }
  }
];