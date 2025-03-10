import { v4 as uuidv4 } from 'uuid';
import { 
  ConnectionScheduler, 
  Relationship, 
  ScheduledInteraction,
  InteractionType,
  ConversationTopic
} from '@/types/relationship-nurturing';
import { addDays, format, subDays } from 'date-fns';

// Helper function to get a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Mock relationships
export const mockRelationships: Relationship[] = [
  {
    id: uuidv4(),
    name: 'Alex Chen',
    category: 'close friends',
    importance: 5,
    notes: 'Best friend since college, loves hiking and sci-fi movies',
    contactMethods: [
      { type: 'phone', value: '123-456-7890' },
      { type: 'email', value: 'alex@example.com' }
    ],
    interests: ['hiking', 'sci-fi movies', 'cooking', 'board games'],
    lifeEvents: [
      {
        id: uuidv4(),
        relationshipId: '',  // Will be filled in
        eventType: 'birthday',
        date: format(new Date(new Date().getFullYear(), 7, 15), 'yyyy-MM-dd'),  // August 15
        description: 'Birthday',
        recurring: true,
        reminderDaysBefore: 7
      },
      {
        id: uuidv4(),
        relationshipId: '',  // Will be filled in
        eventType: 'job change',
        date: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
        description: 'Starting new job at Tech Corp',
        recurring: false,
        reminderDaysBefore: 2
      }
    ],
    conversationTopics: [
      {
        id: uuidv4(),
        topic: 'Hiking trip to Mt. Rainier',
        context: 'Alex mentioned wanting to plan a hiking trip this summer',
        source: 'previous-conversation',
        importance: 4,
        lastDiscussed: format(subDays(new Date(), 30), 'yyyy-MM-dd')
      },
      {
        id: uuidv4(),
        topic: 'New sci-fi movie release',
        context: 'Ask if they\'ve seen the new space exploration movie',
        source: 'interest',
        importance: 3
      }
    ],
    interactionHistory: [
      {
        date: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
        type: 'meet',
        notes: 'Had coffee, talked about upcoming travel plans',
        quality: 5
      },
      {
        date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
        type: 'message',
        notes: 'Quick check-in about weekend plans',
        quality: 4
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Jordan Taylor',
    category: 'family',
    importance: 5,
    notes: 'Sister, lives in Boston, call at least once a week',
    contactMethods: [
      { type: 'phone', value: '123-555-7890' },
      { type: 'email', value: 'jordan@example.com' }
    ],
    interests: ['painting', 'travel', 'dogs', 'baking'],
    lifeEvents: [
      {
        id: uuidv4(),
        relationshipId: '',  // Will be filled in
        eventType: 'birthday',
        date: format(new Date(new Date().getFullYear(), 3, 22), 'yyyy-MM-dd'),  // April 22
        description: 'Birthday',
        recurring: true,
        reminderDaysBefore: 7
      }
    ],
    conversationTopics: [
      {
        id: uuidv4(),
        topic: 'New painting class',
        context: 'Jordan started a new watercolor class',
        source: 'previous-conversation',
        importance: 4,
        lastDiscussed: format(subDays(new Date(), 7), 'yyyy-MM-dd')
      },
      {
        id: uuidv4(),
        topic: 'Summer travel plans',
        context: 'Discuss potential family meet-up in July',
        source: 'follow-up',
        importance: 5
      }
    ],
    interactionHistory: [
      {
        date: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
        type: 'call',
        notes: 'Weekly call, talked about her new painting class',
        quality: 4
      },
      {
        date: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
        type: 'call',
        notes: 'Weekly call, caught up on family news',
        quality: 3
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Morgan Smith',
    category: 'work contacts',
    importance: 3,
    notes: 'Former colleague, good for professional networking',
    contactMethods: [
      { type: 'email', value: 'morgan@company.com' },
      { type: 'linkedin', value: 'linkedin.com/in/morgan-smith' }
    ],
    interests: ['technology', 'career development', 'hiking', 'coffee'],
    lifeEvents: [],
    conversationTopics: [
      {
        id: uuidv4(),
        topic: 'Industry conference',
        context: 'Upcoming tech conference in September',
        source: 'interest',
        importance: 3
      },
      {
        id: uuidv4(),
        topic: 'New job transition',
        context: 'How the new role at XYZ Corp is going',
        source: 'life-event',
        importance: 4
      }
    ],
    interactionHistory: [
      {
        date: format(subDays(new Date(), 45), 'yyyy-MM-dd'),
        type: 'email',
        notes: 'Checked in about career changes',
        quality: 3
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Ravi Patel',
    category: 'close friends',
    importance: 4,
    notes: 'Friend from university, works in finance',
    contactMethods: [
      { type: 'phone', value: '123-987-6543' },
      { type: 'email', value: 'ravi@example.com' }
    ],
    interests: ['finance', 'basketball', 'craft beer', 'travel'],
    lifeEvents: [
      {
        id: uuidv4(),
        relationshipId: '',  // Will be filled in
        eventType: 'house move',
        date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
        description: 'Moving to new apartment downtown',
        recurring: false,
        reminderDaysBefore: 2
      }
    ],
    conversationTopics: [
      {
        id: uuidv4(),
        topic: 'Moving assistance',
        context: 'Offer help with upcoming move',
        source: 'life-event',
        importance: 5
      },
      {
        id: uuidv4(),
        topic: 'Vacation plans',
        context: 'Ravi mentioned plans for Europe trip',
        source: 'previous-conversation',
        importance: 3,
        lastDiscussed: format(subDays(new Date(), 60), 'yyyy-MM-dd')
      }
    ],
    interactionHistory: [
      {
        date: format(subDays(new Date(), 21), 'yyyy-MM-dd'),
        type: 'meet',
        notes: 'Had dinner, discussed travel plans',
        quality: 5
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Taylor Johnson',
    category: 'acquaintances',
    importance: 2,
    notes: 'Met at community event, similar interests in music',
    contactMethods: [
      { type: 'email', value: 'taylor@example.com' }
    ],
    interests: ['live music', 'vinyl records', 'photography'],
    lifeEvents: [],
    conversationTopics: [
      {
        id: uuidv4(),
        topic: 'Upcoming concert',
        context: 'Local band playing next month',
        source: 'interest',
        importance: 3
      }
    ],
    interactionHistory: [
      {
        date: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
        type: 'message',
        notes: 'Quick introduction message after meeting',
        quality: 3
      }
    ]
  }
];

// Fill in the relationship IDs for life events
mockRelationships.forEach(relationship => {
  relationship.lifeEvents.forEach(event => {
    event.relationshipId = relationship.id;
  });
});

// Mock ConnectionScheduler data
export const mockScheduler: ConnectionScheduler = {
  userId: 'current-user',
  scheduleSettings: {
    maxDailyInteractions: 3,
    preferredDays: [1, 3, 5, 6],  // Mon, Wed, Fri, Sat
    preferredTimeRanges: [
      {
        start: '17:00',
        end: '20:00',
        priority: 1
      },
      {
        start: '10:00',
        end: '12:00',
        priority: 2
      }
    ],
    quietPeriods: [
      {
        start: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
        end: format(addDays(new Date(), 22), 'yyyy-MM-dd'),
        reason: 'Travel for work'
      }
    ],
    batchSimilar: true,
    reminderStyle: 'gentle'
  },
  relationshipFrequencies: mockRelationships.map(relationship => {
    // Calculate days since last interaction
    const lastInteraction = relationship.interactionHistory.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]?.date || format(subDays(new Date(), 60), 'yyyy-MM-dd');
    
    // Determine if overdue based on category
    let overdueDays = 0;
    let isOverdue = false;
    
    switch(relationship.category) {
      case 'family':
        // Family - 7 days frequency
        overdueDays = Math.max(0, Math.floor(
          (new Date().getTime() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24) - 7
        ));
        isOverdue = overdueDays > 0;
        break;
      case 'close friends':
        // Close friends - 14 days frequency
        overdueDays = Math.max(0, Math.floor(
          (new Date().getTime() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24) - 14
        ));
        isOverdue = overdueDays > 0;
        break;
      case 'work contacts':
        // Work contacts - 30 days frequency
        overdueDays = Math.max(0, Math.floor(
          (new Date().getTime() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24) - 30
        ));
        isOverdue = overdueDays > 0;
        break;
      case 'acquaintances':
        // Acquaintances - 90 days frequency
        overdueDays = Math.max(0, Math.floor(
          (new Date().getTime() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24) - 90
        ));
        isOverdue = overdueDays > 0;
        break;
    }
    
    // Set next scheduled date
    const nextScheduled = isOverdue 
      ? format(new Date(), 'yyyy-MM-dd')  // Today if overdue
      : format(addDays(new Date(), getRandomInt(1, 14)), 'yyyy-MM-dd');  // Random future date
    
    return {
      relationshipId: relationship.id,
      categoryDefault: true,
      lastInteraction,
      nextScheduled,
      isOverdue,
      overdueDays
    };
  }),
  categoryDefaults: [
    {
      category: 'family',
      frequency: {
        unit: 'weeks',
        value: 1
      }
    },
    {
      category: 'close friends',
      frequency: {
        unit: 'weeks',
        value: 2
      }
    },
    {
      category: 'work contacts',
      frequency: {
        unit: 'months',
        value: 1
      }
    },
    {
      category: 'acquaintances',
      frequency: {
        unit: 'months',
        value: 3
      }
    }
  ],
  scheduledInteractions: []
};

// Generate personalized message templates based on relationship context
const generateMessagePrompt = (relationship: Relationship): string => {
  const topics = relationship.conversationTopics.sort((a, b) => b.importance - a.importance);
  const recentEvents = relationship.lifeEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const diffTime = Math.abs(eventDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 14;  // Events within 14 days
  });
  
  if (recentEvents.length > 0) {
    const event = recentEvents[0];
    if (event.eventType === 'birthday') {
      return `Happy birthday! Hope you have a wonderful day and year ahead. Would love to catch up soon.`;
    } else {
      return `I heard about your ${event.eventType} (${event.description}). How's that going? Would love to hear more.`;
    }
  } else if (topics.length > 0) {
    const topic = topics[0];
    return `I was thinking about ${topic.topic}. ${topic.context} Would you be up for catching up about it?`;
  } else {
    return `It's been a while since we last connected. How have you been? Would love to catch up soon.`;
  }
};

// Intelligent Nurturing Assistant mock data
// Import interfaces from types
import { 
  RelationshipInsight,
  MessageTemplate,
  IntelligentConversationStarter,
  ConnectionSuggestion,
  RelationshipHealth 
} from '@/types/relationship-nurturing';

// AI-generated insights about relationship health
export interface RelationshipInsight {
  id: string;
  relationshipId: string;
  relationshipName: string;
  type: 'connection_gap' | 'interaction_pattern' | 'energy_impact' | 'conversation_suggestion' | 'relationship_health';
  title: string;
  description: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
  dateGenerated: string;
  isNew: boolean;
}

// AI-generated message templates for different relationship contexts
export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  context: 'check_in' | 'life_event' | 'follow_up' | 'celebration' | 'reconnect';
  template: string;
  personalizable: boolean;
  tone: 'casual' | 'warm' | 'professional';
  energyRequired: number; // 1-10
}

// AI-generated conversation starters based on relationship context
export interface IntelligentConversationStarter {
  id: string;
  relationshipId: string;
  topic: string;
  starter: string;
  context: string;
  confidenceScore: number; // 0-1
  source: 'interest' | 'past_conversation' | 'life_event' | 'current_event' | 'shared_experience';
}

// AI-suggested optimal time to connect
export interface ConnectionSuggestion {
  id: string;
  relationshipId: string;
  relationshipName: string;
  suggested: boolean;
  suggestedDate: string;
  suggestedTime: string;
  interactionType: 'message' | 'call' | 'meet' | 'video' | 'email';
  reasonForSuggestion: string;
  energyLevelRequired: number; // 1-10
  priority: number; // 1-5
  expectedResponse: 'fast' | 'delayed' | 'uncertain';
}

// Relationship health score
export interface RelationshipHealth {
  relationshipId: string;
  relationshipName: string;
  overallScore: number; // 0-100
  frequency: number; // 0-100
  quality: number; // 0-100
  reciprocity: number; // 0-100
  lastAssessment: string;
  trend: 'improving' | 'stable' | 'declining';
  suggestions: string[];
}

// Mock relationship insights
export const mockRelationshipInsights: RelationshipInsight[] = [
  {
    id: uuidv4(),
    relationshipId: mockRelationships[0].id,
    relationshipName: mockRelationships[0].name,
    type: 'connection_gap',
    title: 'Connection frequency decreasing',
    description: 'Your connection frequency with Alex has decreased by 30% in the last 2 months.',
    recommendation: 'Consider scheduling a casual meet-up in the next 10 days to maintain connection.',
    severity: 'medium',
    dateGenerated: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    isNew: true
  },
  {
    id: uuidv4(),
    relationshipId: mockRelationships[1].id,
    relationshipName: mockRelationships[1].name,
    type: 'interaction_pattern',
    title: 'One-sided communication pattern',
    description: 'Recent interactions with Jordan have been mostly initiated by you.',
    recommendation: 'Allow some space and see if Jordan reciprocates. If not, a gentle check-in might be appropriate.',
    severity: 'low',
    dateGenerated: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    isNew: false
  },
  {
    id: uuidv4(),
    relationshipId: mockRelationships[2].id,
    relationshipName: mockRelationships[2].name,
    type: 'energy_impact',
    title: 'High energy impact detected',
    description: 'Interactions with Morgan seem to have a higher energy cost than average work contacts.',
    recommendation: 'Consider limiting interactions to email or scheduling them after recharge activities.',
    severity: 'medium',
    dateGenerated: format(new Date(), 'yyyy-MM-dd'),
    isNew: true
  },
  {
    id: uuidv4(),
    relationshipId: mockRelationships[3].id,
    relationshipName: mockRelationships[3].name,
    type: 'conversation_suggestion',
    title: 'Potential conversation opportunity',
    description: 'Ravi\'s recent house move provides a natural conversation starter.',
    recommendation: 'Ask about the new neighborhood or offer help with settling in.',
    severity: 'low',
    dateGenerated: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    isNew: true
  },
  {
    id: uuidv4(),
    relationshipId: mockRelationships[0].id,
    relationshipName: mockRelationships[0].name,
    type: 'relationship_health',
    title: 'Strong relationship health',
    description: 'Your connection with Alex shows consistent quality interactions and good reciprocity.',
    recommendation: 'Continue the current pattern of meaningful, relaxed interactions.',
    severity: 'low',
    dateGenerated: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    isNew: false
  }
];

// Mock message templates
export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: uuidv4(),
    name: 'Casual Check-in',
    category: 'close friends',
    context: 'check_in',
    template: 'Hey {name}, it\'s been a while! How have you been? Would love to hear what\'s new in your world.',
    personalizable: true,
    tone: 'casual',
    energyRequired: 2
  },
  {
    id: uuidv4(),
    name: 'Life Event Follow-up',
    category: 'family',
    context: 'life_event',
    template: 'Hi {name}, I\'ve been thinking about your {event}. How are things going with that? I\'m here if you want to talk about it.',
    personalizable: true,
    tone: 'warm',
    energyRequired: 3
  },
  {
    id: uuidv4(),
    name: 'Professional Reconnect',
    category: 'work contacts',
    context: 'reconnect',
    template: 'Hello {name}, I hope you\'ve been well. I was thinking about our last conversation about {topic} and wondered if you\'d like to catch up sometime.',
    personalizable: true,
    tone: 'professional',
    energyRequired: 4
  },
  {
    id: uuidv4(),
    name: 'Birthday Wish',
    category: 'all',
    context: 'celebration',
    template: 'Happy Birthday, {name}! 🎉 Hope your day is filled with joy and that the year ahead brings you everything you\'re hoping for.',
    personalizable: false,
    tone: 'warm',
    energyRequired: 2
  },
  {
    id: uuidv4(),
    name: 'Post-Meeting Follow-up',
    category: 'all',
    context: 'follow_up',
    template: 'It was great to see you yesterday, {name}! I really enjoyed our conversation about {topic}. Let\'s do it again soon!',
    personalizable: true,
    tone: 'casual',
    energyRequired: 2
  }
];

// Mock intelligent conversation starters
export const mockIntelligentConversationStarters: IntelligentConversationStarter[] = [
  {
    id: uuidv4(),
    relationshipId: mockRelationships[0].id,
    topic: 'Hiking trip to Mt. Rainier',
    starter: 'Have you finalized any plans for that Mt. Rainier hiking trip you mentioned? I came across some great trail recommendations.',
    context: 'Based on previous conversation about summer hiking plans',
    confidenceScore: 0.92,
    source: 'past_conversation'
  },
  {
    id: uuidv4(),
    relationshipId: mockRelationships[0].id,
    topic: 'New sci-fi release',
    starter: 'Just saw that the new sci-fi movie "Stellar Journeys" is coming out this weekend. Given your love for space exploration films, I thought you might be interested!',
    context: 'Based on shared interest in sci-fi movies',
    confidenceScore: 0.85,
    source: 'interest'
  },
  {
    id: uuidv4(),
    relationshipId: mockRelationships[1].id,
    topic: 'Watercolor painting progress',
    starter: 'How\'s your watercolor class going? Have you created any new pieces you\'re particularly proud of?',
    context: 'Based on recent activity mentioned in conversation',
    confidenceScore: 0.89,
    source: 'past_conversation'
  },
  {
    id: uuidv4(),
    relationshipId: mockRelationships[2].id,
    topic: 'Industry conference',
    starter: 'I noticed the TechInnovate conference is happening next month. Are you planning to attend? Would be great to connect if you are.',
    context: 'Based on professional interest and networking opportunity',
    confidenceScore: 0.78,
    source: 'current_event'
  },
  {
    id: uuidv4(),
    relationshipId: mockRelationships[3].id,
    topic: 'New apartment',
    starter: 'How\'s the move to your new place going? Found any good local spots in the neighborhood yet?',
    context: 'Based on upcoming life event',
    confidenceScore: 0.95,
    source: 'life_event'
  }
];

// Mock connection suggestions
export const mockConnectionSuggestions: ConnectionSuggestion[] = [
  {
    id: uuidv4(),
    relationshipId: mockRelationships[0].id,
    relationshipName: mockRelationships[0].name,
    suggested: true,
    suggestedDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    suggestedTime: '18:30',
    interactionType: 'call',
    reasonForSuggestion: 'You typically have high energy in the early evening, and Alex is usually responsive during this time.',
    energyLevelRequired: 5,
    priority: 3,
    expectedResponse: 'fast'
  },
  {
    id: uuidv4(),
    relationshipId: mockRelationships[1].id,
    relationshipName: mockRelationships[1].name,
    suggested: true,
    suggestedDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    suggestedTime: '10:15',
    interactionType: 'call',
    reasonForSuggestion: 'Weekly check-in with family member, aligned with your historical preferred time for family calls.',
    energyLevelRequired: 4,
    priority: 4,
    expectedResponse: 'fast'
  },
  {
    id: uuidv4(),
    relationshipId: mockRelationships[2].id,
    relationshipName: mockRelationships[2].name,
    suggested: true,
    suggestedDate: format(addDays(new Date(), 12), 'yyyy-MM-dd'),
    suggestedTime: '14:00',
    interactionType: 'email',
    reasonForSuggestion: 'Professional contact maintenance, low energy interaction during usual work hours.',
    energyLevelRequired: 2,
    priority: 2,
    expectedResponse: 'delayed'
  },
  {
    id: uuidv4(),
    relationshipId: mockRelationships[3].id,
    relationshipName: mockRelationships[3].name,
    suggested: true,
    suggestedDate: format(addDays(new Date(), 4), 'yyyy-MM-dd'),
    suggestedTime: '19:45',
    interactionType: 'message',
    reasonForSuggestion: 'Quick check-in about upcoming life event (moving). Evening time when you typically have more social energy.',
    energyLevelRequired: 3,
    priority: 4,
    expectedResponse: 'fast'
  },
  {
    id: uuidv4(),
    relationshipId: mockRelationships[4].id,
    relationshipName: mockRelationships[4].name,
    suggested: true,
    suggestedDate: format(addDays(new Date(), 20), 'yyyy-MM-dd'),
    suggestedTime: '15:30',
    interactionType: 'message',
    reasonForSuggestion: 'Casual reconnection with acquaintance after appropriate interval.',
    energyLevelRequired: 2,
    priority: 1,
    expectedResponse: 'uncertain'
  }
];

// Mock relationship health metrics
export const mockRelationshipHealth: RelationshipHealth[] = [
  {
    relationshipId: mockRelationships[0].id,
    relationshipName: mockRelationships[0].name,
    overallScore: 89,
    frequency: 92,
    quality: 95,
    reciprocity: 80,
    lastAssessment: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    trend: 'stable',
    suggestions: [
      'Consider initiating more spontaneous interactions',
      'The relationship shows good balance but could benefit from more shared activities'
    ]
  },
  {
    relationshipId: mockRelationships[1].id,
    relationshipName: mockRelationships[1].name,
    overallScore: 82,
    frequency: 90,
    quality: 78,
    reciprocity: 75,
    lastAssessment: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    trend: 'declining',
    suggestions: [
      'Recent interactions show decreased engagement',
      'Consider planning a more meaningful conversation about shared interests',
      'Family relationship may benefit from more undivided attention during calls'
    ]
  },
  {
    relationshipId: mockRelationships[2].id,
    relationshipName: mockRelationships[2].name,
    overallScore: 65,
    frequency: 55,
    quality: 70,
    reciprocity: 70,
    lastAssessment: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
    trend: 'improving',
    suggestions: [
      'Professional relationship showing good development',
      'Consider adding more value-oriented interactions rather than just check-ins'
    ]
  },
  {
    relationshipId: mockRelationships[3].id,
    relationshipName: mockRelationships[3].name,
    overallScore: 75,
    frequency: 60,
    quality: 85,
    reciprocity: 80,
    lastAssessment: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    trend: 'stable',
    suggestions: [
      'Recent interactions have been high quality but infrequent',
      'Consider establishing a more regular connection rhythm'
    ]
  },
  {
    relationshipId: mockRelationships[4].id,
    relationshipName: mockRelationships[4].name,
    overallScore: 45,
    frequency: 30,
    quality: 65,
    reciprocity: 50,
    lastAssessment: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    trend: 'stable',
    suggestions: [
      'Acquaintance relationship with potential for development',
      'Consider exploring shared interests more deeply to strengthen connection'
    ]
  }
];

// Generate interaction suggestions for each relationship
export const generateSuggestedInteractions = (
  relationships: Relationship[], 
  scheduler: ConnectionScheduler
): ScheduledInteraction[] => {
  const today = new Date();
  const interactions: ScheduledInteraction[] = [];

  // Get relationships that need attention first (overdue or with upcoming events)
  const priorityRelationships = [...relationships].sort((a, b) => {
    const aFreq = scheduler.relationshipFrequencies.find(f => f.relationshipId === a.id);
    const bFreq = scheduler.relationshipFrequencies.find(f => f.relationshipId === b.id);
    
    // First sort by overdue status
    if (aFreq?.isOverdue && !bFreq?.isOverdue) return -1;
    if (!aFreq?.isOverdue && bFreq?.isOverdue) return 1;
    
    // Then by overdue days
    if (aFreq?.isOverdue && bFreq?.isOverdue) {
      return (bFreq.overdueDays || 0) - (aFreq.overdueDays || 0);
    }
    
    // Then by importance
    return b.importance - a.importance;
  });

  // For each relationship, generate interaction suggestions
  for (const relationship of priorityRelationships) {
    const frequency = scheduler.relationshipFrequencies.find(f => f.relationshipId === relationship.id);
    if (!frequency) continue;
    
    // Determine the interaction type based on relationship category and past interactions
    let interactionType: InteractionType = 'message';
    
    const pastInteractions = relationship.interactionHistory.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    if (relationship.category === 'family' || relationship.category === 'close friends') {
      // For closer relationships, prioritize calls or in-person meetings
      if (pastInteractions[0]?.type === 'call') {
        interactionType = Math.random() > 0.5 ? 'meet' : 'call';
      } else if (pastInteractions[0]?.type === 'meet') {
        interactionType = Math.random() > 0.7 ? 'call' : 'message';
      } else {
        interactionType = Math.random() > 0.3 ? 'call' : 'message';
      }
    } else {
      // For less close relationships, prioritize messages or emails
      if (relationship.category === 'work contacts') {
        interactionType = Math.random() > 0.7 ? 'email' : 'message';
      } else {
        interactionType = 'message';
      }
    }
    
    // Determine when to schedule the interaction
    let scheduledDate: string;
    
    if (frequency.isOverdue) {
      // If overdue, schedule in the next few days
      const daysToAdd = Math.min(frequency.overdueDays || 0, 7);
      scheduledDate = format(addDays(today, Math.min(daysToAdd, 3)), 'yyyy-MM-dd');
    } else {
      // Otherwise, schedule close to the next scheduled date
      scheduledDate = frequency.nextScheduled;
    }
    
    // Check for preferred days
    const scheduledDay = new Date(scheduledDate).getDay();
    if (!scheduler.scheduleSettings.preferredDays.includes(scheduledDay)) {
      // Find the next preferred day
      let daysToAdd = 1;
      let newDay = (scheduledDay + daysToAdd) % 7;
      
      while (!scheduler.scheduleSettings.preferredDays.includes(newDay) && daysToAdd < 7) {
        daysToAdd++;
        newDay = (scheduledDay + daysToAdd) % 7;
      }
      
      scheduledDate = format(addDays(new Date(scheduledDate), daysToAdd), 'yyyy-MM-dd');
    }
    
    // Skip quiet periods
    for (const quietPeriod of scheduler.scheduleSettings.quietPeriods) {
      const periodStart = new Date(quietPeriod.start);
      const periodEnd = new Date(quietPeriod.end);
      const interactionDate = new Date(scheduledDate);
      
      if (interactionDate >= periodStart && interactionDate <= periodEnd) {
        // Schedule after the quiet period
        scheduledDate = format(addDays(periodEnd, 1), 'yyyy-MM-dd');
        break;
      }
    }
    
    // Generate suggested time slots based on preferred time ranges
    const suggestedTimeSlots = scheduler.scheduleSettings.preferredTimeRanges
      .sort((a, b) => a.priority - b.priority)
      .map(range => range.start);
    
    // Determine duration based on interaction type
    let duration = 15;  // default (messages)
    
    if (interactionType === 'call') {
      duration = 30;
    } else if (interactionType === 'meet') {
      duration = 90;
    } else if (interactionType === 'video') {
      duration = 45;
    }
    
    // Generate purpose and preparation notes based on relationship context
    const topics = relationship.conversationTopics.sort((a, b) => b.importance - a.importance);
    const purpose = topics.length > 0 
      ? `Catch up about ${topics[0].topic}`
      : `Regular check-in with ${relationship.name}`;
    
    const preparationNeeded = interactionType === 'meet' || interactionType === 'call' || interactionType === 'video';
    
    const preparationNotes = preparationNeeded 
      ? generateMessagePrompt(relationship) 
      : '';
    
    // Create the interaction
    const interaction: ScheduledInteraction = {
      id: uuidv4(),
      relationshipId: relationship.id,
      relationshipName: relationship.name,
      scheduledDate,
      suggestedTimeSlots,
      interactionType,
      duration,
      purpose,
      preparationNeeded,
      preparationNotes,
      status: 'planned',
      energyCost: determineEnergyCost(relationship, interactionType)
    };
    
    interactions.push(interaction);
  }
  
  return interactions;
};

// Helper function to determine energy cost of an interaction
const determineEnergyCost = (relationship: Relationship, interactionType: InteractionType): number => {
  // Base cost by relationship category
  let baseCost = 3;  // default for acquaintances
  
  if (relationship.category === 'family') {
    baseCost = 2;  // family is usually lower energy
  } else if (relationship.category === 'close friends') {
    baseCost = 3;  // close friends are medium energy
  } else if (relationship.category === 'work contacts') {
    baseCost = 5;  // work contacts are higher energy
  }
  
  // Adjust by interaction type
  let typeCost = 0;
  
  if (interactionType === 'message' || interactionType === 'email') {
    typeCost = 1;  // lowest energy
  } else if (interactionType === 'call') {
    typeCost = 3;  // medium energy
  } else if (interactionType === 'video') {
    typeCost = 4;  // higher energy
  } else if (interactionType === 'meet') {
    typeCost = 5;  // highest energy
  } else {
    typeCost = 2;  // default for 'other'
  }
  
  // Calculate final cost (1-10 scale)
  const finalCost = Math.min(10, Math.max(1, baseCost + typeCost));
  return finalCost;
};
