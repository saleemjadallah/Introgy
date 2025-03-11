
import { v4 as uuidv4 } from 'uuid';
import { 
  ConnectionScheduler, 
  Relationship, 
  ScheduledInteraction,
  InteractionType,
  RelationshipFrequency,
  RelationshipInsight,
  RelationshipHealth,
  ConnectionSuggestion,
  IntelligentConversationStarter,
  MessageTemplate
} from '@/types/relationship-nurturing';
import { addDays, format, isAfter, isBefore, parseISO, subDays } from 'date-fns';

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
  }
  
  // Calculate final cost (1-10 scale)
  const finalCost = Math.min(10, Math.max(1, baseCost + typeCost));
  return finalCost;
};

// Mock data for relationships
const mockRelationships: Relationship[] = [
  {
    id: '1',
    name: 'Alex Smith',
    category: 'close friends',
    importance: 5,
    notes: 'College friend, known for 10+ years',
    contactMethods: [
      { type: 'phone', value: '555-1234' },
      { type: 'email', value: 'alex@example.com' }
    ],
    interests: ['hiking', 'photography', 'craft beer'],
    lifeEvents: [
      {
        id: '1-1',
        relationshipId: '1',
        eventType: 'birthday',
        date: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
        description: 'Birthday celebration',
        recurring: true,
        reminderDaysBefore: 7
      }
    ],
    conversationTopics: [
      {
        id: '1-1',
        topic: 'Recent hiking trip',
        context: 'They went hiking in the mountains last month',
        source: 'previous-conversation',
        importance: 4
      },
      {
        id: '1-2',
        topic: 'New camera equipment',
        context: 'They were looking to buy a new lens',
        source: 'interest',
        importance: 3,
        lastDiscussed: format(subDays(new Date(), 45), 'yyyy-MM-dd')
      }
    ],
    interactionHistory: [
      {
        date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        type: 'meet',
        notes: 'Coffee catch-up, talked about work and travel plans',
        quality: 5
      }
    ]
  },
  {
    id: '2',
    name: 'Jamie Lee',
    category: 'family',
    importance: 5,
    notes: 'Sister, lives in another city',
    contactMethods: [
      { type: 'phone', value: '555-5678' }
    ],
    interests: ['cooking', 'gardening', 'travel'],
    lifeEvents: [
      {
        id: '2-1',
        relationshipId: '2',
        eventType: 'anniversary',
        date: format(addDays(new Date(), 45), 'yyyy-MM-dd'),
        description: 'Wedding anniversary',
        recurring: true,
        reminderDaysBefore: 14
      }
    ],
    conversationTopics: [
      {
        id: '2-1',
        topic: 'New home renovation',
        context: 'Recently started renovating their kitchen',
        source: 'previous-conversation',
        importance: 5
      }
    ],
    interactionHistory: [
      {
        date: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
        type: 'call',
        notes: 'Weekly call, discussed holiday plans',
        quality: 4
      }
    ]
  },
  {
    id: '3',
    name: 'Taylor Jordan',
    category: 'work contacts',
    importance: 3,
    notes: 'Colleague from previous job, good industry contact',
    contactMethods: [
      { type: 'email', value: 'taylor@work.com' },
      { type: 'linkedin', value: 'taylorj' }
    ],
    interests: ['technology', 'career development', 'networking'],
    lifeEvents: [],
    conversationTopics: [
      {
        id: '3-1',
        topic: 'Industry conference',
        context: 'Both planning to attend next month',
        source: 'interest',
        importance: 4
      }
    ],
    interactionHistory: [
      {
        date: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
        type: 'email',
        notes: 'Shared job opportunity, brief catch-up',
        quality: 3
      }
    ]
  }
];

// Mock scheduler data
const mockScheduler: ConnectionScheduler = {
  userId: 'user1',
  scheduleSettings: {
    maxDailyInteractions: 2,
    preferredDays: [1, 3, 5], // Monday, Wednesday, Friday
    preferredTimeRanges: [
      { start: '10:00', end: '12:00', priority: 1 },
      { start: '16:00', end: '18:00', priority: 2 }
    ],
    quietPeriods: [
      { 
        start: format(addDays(new Date(), 20), 'yyyy-MM-dd'), 
        end: format(addDays(new Date(), 30), 'yyyy-MM-dd'), 
        reason: 'Vacation' 
      }
    ],
    batchSimilar: true,
    reminderStyle: 'gentle'
  },
  relationshipFrequencies: [
    {
      relationshipId: '1',
      categoryDefault: false,
      customFrequency: {
        unit: 'weeks',
        value: 2,
        flexibility: 3
      },
      lastInteraction: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      nextScheduled: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      isOverdue: true,
      overdueDays: 9
    },
    {
      relationshipId: '2',
      categoryDefault: true,
      lastInteraction: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
      nextScheduled: format(addDays(new Date(), 0), 'yyyy-MM-dd'),
      isOverdue: false,
      overdueDays: 0
    },
    {
      relationshipId: '3',
      categoryDefault: false,
      customFrequency: {
        unit: 'months',
        value: 3,
        flexibility: 14
      },
      lastInteraction: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
      nextScheduled: format(addDays(new Date(), 20), 'yyyy-MM-dd'),
      isOverdue: false,
      overdueDays: 0
    }
  ],
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
        value: 2
      }
    }
  ],
  scheduledInteractions: []
};

// Generate suggested interactions based on relationship data
const generateSuggestedInteractions = (
  relationships: Relationship[],
  scheduler: ConnectionScheduler
): ScheduledInteraction[] => {
  const interactions: ScheduledInteraction[] = [];
  const today = new Date();
  
  // Add interactions for relationships that are due or overdue
  scheduler.relationshipFrequencies.forEach(freq => {
    if (freq.isOverdue || isAfter(parseISO(freq.nextScheduled), today)) {
      const relationship = relationships.find(r => r.id === freq.relationshipId);
      if (!relationship) return;
      
      // Determine suggested date - either next scheduled or for overdue, soon
      const scheduledDate = freq.isOverdue 
        ? format(addDays(today, Math.min(3, freq.overdueDays)), 'yyyy-MM-dd')
        : freq.nextScheduled;
      
      // Determine interaction type based on recency and category
      let interactionType: InteractionType = 'message';
      if (freq.overdueDays > 30 || relationship.importance > 4) {
        interactionType = relationship.category === 'work contacts' ? 'video' : 'meet';
      } else if (freq.overdueDays > 14 || relationship.importance > 3) {
        interactionType = 'call';
      }
      
      // Determine duration based on interaction type and relationship
      let duration = 15;
      if (interactionType === 'meet') {
        duration = 90;
      } else if (interactionType === 'call') {
        duration = 30;
      } else if (interactionType === 'video') {
        duration = 45;
      }
      
      // Determine energy cost
      const energyCost = determineEnergyCost(relationship, interactionType);
      
      // Create a suggested interaction
      const interaction: ScheduledInteraction = {
        id: uuidv4(),
        relationshipId: relationship.id,
        relationshipName: relationship.name,
        scheduledDate,
        suggestedTimeSlots: ['10:00', '14:00', '16:00'],
        interactionType,
        duration,
        purpose: freq.isOverdue ? 'Reconnection after gap' : 'Regular check-in',
        preparationNeeded: interactionType !== 'message',
        preparationNotes: freq.isOverdue 
          ? `It's been ${freq.overdueDays} days since your last interaction.`
          : 'Regular scheduled interaction based on your preferences.',
        status: 'planned',
        energyCost
      };
      
      interactions.push(interaction);
    }
  });
  
  return interactions;
};

// Relationship insights
const mockRelationshipInsights: RelationshipInsight[] = [
  {
    id: '1',
    relationshipId: '1',
    relationshipName: 'Alex Smith',
    title: 'Connection gap detected',
    description: 'You haven\'t connected with Alex in over 30 days, which is longer than your usual pattern.',
    recommendation: 'Consider reaching out this week with a casual check-in. A short coffee meetup would be ideal based on your past interactions.',
    type: 'connection_gap',
    severity: 'medium',
    dateGenerated: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    isNew: true
  },
  {
    id: '2',
    relationshipId: '2',
    relationshipName: 'Jamie Lee',
    title: 'Upcoming life event reminder',
    description: 'Jamie\'s anniversary is coming up in 45 days. This is an important event that you typically acknowledge.',
    recommendation: 'Mark your calendar and plan to send a card or gift. Based on past interactions, this relationship values tangible gestures.',
    type: 'relationship_health',
    severity: 'low',
    dateGenerated: format(new Date(), 'yyyy-MM-dd'),
    isNew: true
  },
  {
    id: '3',
    relationshipId: '3',
    relationshipName: 'Taylor Jordan',
    title: 'Professional opportunity insight',
    description: 'You mentioned the industry conference next month. This presents a good opportunity to reconnect with Taylor.',
    recommendation: 'Consider suggesting a meet-up at the conference. This maintains the professional connection with minimal energy expenditure.',
    type: 'interaction_pattern',
    severity: 'low',
    dateGenerated: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    isNew: false
  }
];

// Message templates
const mockMessageTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: 'Casual check-in',
    category: 'check_in',
    context: 'check_in',
    template: 'Hey {name}, it\'s been a while! How have you been?',
    personalizable: true,
    tone: 'casual',
    energyRequired: 2
  },
  {
    id: '2',
    name: 'Birthday wishes',
    category: 'celebration',
    context: 'life_event',
    template: 'Happy birthday, {name}! Hope you have a wonderful day. 🎂',
    personalizable: true,
    tone: 'warm',
    energyRequired: 1
  },
  {
    id: '3',
    name: 'Professional follow-up',
    category: 'professional',
    context: 'follow_up',
    template: 'Hello {name}, I wanted to follow up on our discussion about {topic}. Do you have any thoughts on next steps?',
    personalizable: true,
    tone: 'professional',
    energyRequired: 4
  }
];

// Connection suggestions
const mockConnectionSuggestions: ConnectionSuggestion[] = [
  {
    id: '1',
    relationshipId: '1',
    relationshipName: 'Alex Smith',
    suggested: true,
    suggestedDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    suggestedTime: '16:30',
    interactionType: 'call',
    reasonForSuggestion: 'It\'s been a month since your last conversation, and you typically connect with Alex every 2-3 weeks.',
    energyLevelRequired: 4,
    priority: 2,
    expectedResponse: 'fast'
  },
  {
    id: '2',
    relationshipId: '2',
    relationshipName: 'Jamie Lee',
    suggested: true,
    suggestedDate: format(addDays(new Date(), 0), 'yyyy-MM-dd'),
    suggestedTime: '18:00',
    interactionType: 'call',
    reasonForSuggestion: 'Your weekly family call is due today. Family calls are important for your well-being based on past patterns.',
    energyLevelRequired: 3,
    priority: 1,
    expectedResponse: 'fast'
  },
  {
    id: '3',
    relationshipId: '3',
    relationshipName: 'Taylor Jordan',
    suggested: true,
    suggestedDate: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    suggestedTime: '11:00',
    interactionType: 'email',
    reasonForSuggestion: 'Conference planning - reaching out now gives both of you time to coordinate schedules.',
    energyLevelRequired: 2,
    priority: 3,
    expectedResponse: 'delayed'
  }
];

// Conversation starters
const mockIntelligentConversationStarters: IntelligentConversationStarter[] = [
  {
    id: '1',
    relationshipId: '1',
    topic: 'Recent hiking trip',
    starter: 'I was thinking about your hiking trip from last month. Did you end up taking any good photos you\'d be willing to share?',
    context: 'Alex went hiking and enjoys photography, based on your previous conversations.',
    confidenceScore: 0.92,
    source: 'previous_conversation'
  },
  {
    id: '2',
    relationshipId: '1',
    topic: 'New photo spots',
    starter: 'I came across this article about hidden photography spots in the area. Made me think of you - have you visited any of these?',
    context: 'Based on shared interest in photography.',
    confidenceScore: 0.85,
    source: 'interest'
  },
  {
    id: '3',
    relationshipId: '2',
    topic: 'Kitchen renovation',
    starter: 'How\'s the kitchen renovation coming along? Last time we talked you were deciding on countertops.',
    context: 'Jamie mentioned renovating the kitchen in your last conversation.',
    confidenceScore: 0.95,
    source: 'previous_conversation'
  },
  {
    id: '4',
    relationshipId: '3',
    topic: 'Industry conference',
    starter: 'Are you still planning to attend the tech conference next month? I was thinking we could meet up for coffee if our schedules align.',
    context: 'You both mentioned attending the same industry event.',
    confidenceScore: 0.88,
    source: 'shared_experience'
  }
];

// Relationship health metrics
const mockRelationshipHealth: RelationshipHealth[] = [
  {
    relationshipId: '1',
    relationshipName: 'Alex Smith',
    overallScore: 70,
    frequency: 65,
    quality: 85,
    reciprocity: 75,
    trend: 'declining',
    lastAssessment: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    suggestions: [
      'Increase contact frequency to once every 2 weeks',
      'Plan a meetup around a shared interest like photography',
      'Follow up on previous conversations to show active listening'
    ]
  },
  {
    relationshipId: '2',
    relationshipName: 'Jamie Lee',
    overallScore: 85,
    frequency: 90,
    quality: 80,
    reciprocity: 85,
    trend: 'stable',
    lastAssessment: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    suggestions: [
      'Maintain current contact pattern',
      'Consider a deeper conversation about recent life changes'
    ]
  },
  {
    relationshipId: '3',
    relationshipName: 'Taylor Jordan',
    overallScore: 60,
    frequency: 55,
    quality: 70,
    reciprocity: 65,
    trend: 'improving',
    lastAssessment: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    suggestions: [
      'Capitalize on upcoming conference for in-person connection',
      'Share relevant industry articles periodically to maintain connection'
    ]
  }
];

export {
  mockRelationships,
  mockScheduler,
  generateSuggestedInteractions,
  mockRelationshipInsights,
  mockMessageTemplates,
  mockConnectionSuggestions,
  mockIntelligentConversationStarters,
  mockRelationshipHealth,
  determineEnergyCost
};
