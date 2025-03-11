import { v4 as uuidv4 } from 'uuid';
import { 
  DeepQuestion, 
  MessageTemplate, 
  ConnectionRitual, 
  SharedExperience 
} from '@/types/meaningful-interactions';

// Deep Questions Mock Data
export const mockDeepQuestions: DeepQuestion[] = [
  {
    id: uuidv4(),
    text: "What values or principles do you try to live by, and how have they evolved over time?",
    category: "personal-values",
    depthLevel: 3,
    topics: ["values", "life-philosophy", "growth"],
    relationshipTypes: ["close-friend", "family", "partner"],
    energyRequired: 4,
    followUps: [
      "Has there been a moment when those values were truly tested?", 
      "Which value has been the hardest to maintain?"
    ]
  },
  {
    id: uuidv4(),
    text: "What would constitute a 'perfect' day for you?",
    category: "personal-values",
    depthLevel: 2,
    topics: ["lifestyle", "happiness", "preferences"],
    relationshipTypes: ["friend", "close-friend", "acquaintance", "partner"],
    energyRequired: 2,
    followUps: [
      "How close have you come to having this perfect day?", 
      "What prevents you from having more days like this?"
    ]
  },
  {
    id: uuidv4(),
    text: "What book or media has influenced your thinking the most?",
    category: "beliefs",
    depthLevel: 1,
    topics: ["media", "influences", "learning"],
    relationshipTypes: ["friend", "acquaintance", "colleague", "partner"],
    energyRequired: 2,
    followUps: [
      "How did you discover it?", 
      "Has your perspective on it changed over time?"
    ]
  },
  {
    id: uuidv4(),
    text: "If you could give your younger self one piece of advice, what would it be?",
    category: "experiences",
    depthLevel: 2,
    topics: ["reflection", "growth", "regrets"],
    relationshipTypes: ["friend", "close-friend", "family", "partner"],
    energyRequired: 3,
    followUps: [
      "What experience led you to this insight?", 
      "How might your life be different if you had known this earlier?"
    ]
  },
  {
    id: uuidv4(),
    text: "What is something you've changed your mind about in the last few years?",
    category: "beliefs",
    depthLevel: 2,
    topics: ["growth", "reflection", "beliefs"],
    relationshipTypes: ["friend", "close-friend", "family", "partner", "colleague"],
    energyRequired: 3,
    followUps: [
      "What prompted this change?", 
      "How has this shift affected other areas of your thinking?"
    ]
  },
  {
    id: uuidv4(),
    text: "What small habit or routine has had the biggest positive impact on your life?",
    category: "personal-values",
    depthLevel: 1,
    topics: ["habits", "lifestyle", "well-being"],
    relationshipTypes: ["friend", "acquaintance", "colleague", "family", "partner"],
    energyRequired: 1,
    followUps: [
      "How did you develop this habit?", 
      "Have you tried to share this with others?"
    ]
  },
  {
    id: uuidv4(),
    text: "What's a challenging experience that ended up being valuable?",
    category: "experiences",
    depthLevel: 2,
    topics: ["challenges", "growth", "resilience"],
    relationshipTypes: ["friend", "close-friend", "family", "partner"],
    energyRequired: 3,
    followUps: [
      "How did this experience change you?", 
      "What helped you get through it?"
    ]
  },
  {
    id: uuidv4(),
    text: "What are you most looking forward to in the next year?",
    category: "aspirations",
    depthLevel: 1,
    topics: ["future", "goals", "hopes"],
    relationshipTypes: ["friend", "acquaintance", "colleague", "family", "partner"],
    energyRequired: 1,
    followUps: [
      "What steps are you taking to make this happen?", 
      "How will you know if you've been successful?"
    ]
  },
  {
    id: uuidv4(),
    text: "What aspect of your personality do you value most in yourself?",
    category: "personal-values",
    depthLevel: 2,
    topics: ["self-awareness", "strengths", "identity"],
    relationshipTypes: ["close-friend", "family", "partner"],
    energyRequired: 3,
    followUps: [
      "Has this always been a strength of yours?", 
      "How does this quality show up in your relationships?"
    ]
  },
  {
    id: uuidv4(),
    text: "How do you recharge when you're feeling drained?",
    category: "experiences",
    depthLevel: 1,
    topics: ["self-care", "energy", "habits"],
    relationshipTypes: ["friend", "acquaintance", "colleague", "family", "partner"],
    energyRequired: 1,
    followUps: [
      "Has this changed over time?", 
      "What signs tell you that you need to recharge?"
    ]
  }
];

// Message Templates Mock Data
export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: uuidv4(),
    purpose: "thinking-of-you",
    baseTemplate: "I was {{activity}} earlier and it reminded me of {{memory}} - it made me think of you and smile. How have you been?",
    variables: [
      {
        name: "activity",
        type: "selection",
        options: ["reading a book", "watching a movie", "on a walk", "listening to music", "trying a new recipe"]
      },
      {
        name: "memory",
        type: "text"
      }
    ],
    tone: "warm",
    energyRequired: 2,
    relationshipStage: "established"
  },
  {
    id: uuidv4(),
    purpose: "appreciation",
    baseTemplate: "I wanted to take a moment to tell you how much I appreciate {{quality}} about you. Especially when {{example}}. It really means a lot to me.",
    variables: [
      {
        name: "quality",
        type: "text"
      },
      {
        name: "example",
        type: "text"
      }
    ],
    tone: "thoughtful",
    energyRequired: 3,
    relationshipStage: "close"
  },
  {
    id: uuidv4(),
    purpose: "reconnection",
    baseTemplate: "Hi {{name}}, I know it's been a while since we {{lastActivity}}. I've been thinking about you and wondering how you're doing with {{topic}} these days?",
    variables: [
      {
        name: "name",
        type: "text"
      },
      {
        name: "lastActivity",
        type: "text"
      },
      {
        name: "topic",
        type: "interest"
      }
    ],
    tone: "casual",
    energyRequired: 2,
    relationshipStage: "reconnecting"
  },
  {
    id: uuidv4(),
    purpose: "celebration",
    baseTemplate: "Congratulations on {{achievement}}! I know how {{meaningfulness}} this is for you. I'm so happy for you and would love to hear more about it when you have time.",
    variables: [
      {
        name: "achievement",
        type: "text"
      },
      {
        name: "meaningfulness",
        type: "selection",
        options: ["important", "meaningful", "significant", "exciting", "fulfilling"]
      }
    ],
    tone: "celebratory",
    energyRequired: 2,
    relationshipStage: "established"
  },
  {
    id: uuidv4(),
    purpose: "support",
    baseTemplate: "I heard about {{situation}} and wanted to let you know I'm thinking of you. No need to respond right away, but I'm here if you need {{supportType}}.",
    variables: [
      {
        name: "situation",
        type: "text"
      },
      {
        name: "supportType",
        type: "selection",
        options: ["someone to talk to", "a distraction", "practical help", "quiet company", "anything at all"]
      }
    ],
    tone: "warm",
    energyRequired: 3,
    relationshipStage: "close"
  },
  {
    id: uuidv4(),
    purpose: "thinking-of-you",
    baseTemplate: "I just came across this {{contentType}} about {{topic}} and immediately thought you might enjoy it. {{link}}",
    variables: [
      {
        name: "contentType",
        type: "selection",
        options: ["article", "video", "podcast", "book", "quote"]
      },
      {
        name: "topic",
        type: "interest"
      },
      {
        name: "link",
        type: "text"
      }
    ],
    tone: "casual",
    energyRequired: 1,
    relationshipStage: "established"
  }
];

// Connection Rituals Mock Data
export const mockConnectionRituals: ConnectionRitual[] = [
  {
    id: uuidv4(),
    name: "Monthly Book Exchange",
    description: "Take turns recommending a book to each other each month, with a brief discussion about why you chose it.",
    frequency: {
      unit: "months",
      value: 1,
      flexibility: 7
    },
    interactionType: "message",
    duration: 15,
    structure: "On the 1st of each month, share your book recommendation with a few sentences about why you think they'll enjoy it. Schedule a brief catch-up to hear their thoughts after they've had a chance to read it.",
    prompts: [
      "What reminded you of them in this book?",
      "What was your favorite part or insight?",
      "How did it connect to conversations you've had before?"
    ],
    energyCost: 2,
    relationshipTypes: ["friend", "close-friend", "family"]
  },
  {
    id: uuidv4(),
    name: "Quarterly Deep Dive",
    description: "A scheduled longer conversation focused on meaningful life updates and reflections.",
    frequency: {
      unit: "months",
      value: 3,
      flexibility: 14
    },
    interactionType: "call",
    duration: 60,
    structure: "Schedule a 60-minute call with a loose agenda covering: recent life highlights, current challenges, what you're learning, and future aspirations. Take turns sharing on each topic.",
    prompts: [
      "What has been most surprising about the last few months?",
      "What are you currently struggling with or working through?",
      "What's something new you're learning or exploring?",
      "What are you looking forward to in the coming months?"
    ],
    energyCost: 4,
    relationshipTypes: ["close-friend", "family", "partner"]
  },
  {
    id: uuidv4(),
    name: "Weekly Highlight Exchange",
    description: "Share the highlight of your week and one challenge you're facing.",
    frequency: {
      unit: "weeks",
      value: 1,
      flexibility: 2
    },
    interactionType: "message",
    duration: 10,
    structure: "Each weekend, send a brief message with your high point and challenge from the week. Keep it concise but authentic.",
    prompts: [
      "What brought you the most joy or satisfaction this week?",
      "What's one challenge you're currently navigating?",
      "Is there anything you need support with in the coming week?"
    ],
    energyCost: 2,
    relationshipTypes: ["close-friend", "family", "partner"]
  },
  {
    id: uuidv4(),
    name: "Media Recommendation Exchange",
    description: "Share and discuss podcasts, articles, or videos that made you think of each other.",
    frequency: {
      unit: "weeks",
      value: 2,
      flexibility: 4
    },
    interactionType: "message",
    duration: 15,
    structure: "When you come across interesting content, save it to share during your next exchange. Include a sentence or two about why you're sharing it with this specific person.",
    prompts: [
      "What specific element made you think of them?",
      "What part do you think they'll find most interesting?",
      "How does this connect to conversations you've had before?"
    ],
    energyCost: 1,
    relationshipTypes: ["friend", "acquaintance", "colleague"]
  },
  {
    id: uuidv4(),
    name: "Seasonal Check-in",
    description: "A structured catch-up at the start of each new season to reconnect and align.",
    frequency: {
      unit: "months",
      value: 3,
      flexibility: 14
    },
    interactionType: "video",
    duration: 45,
    structure: "Schedule a video call near the equinox or solstice. Share seasonal reflections, upcoming plans, and current life themes.",
    prompts: [
      "How are you feeling as we enter this new season?",
      "What are you hoping to focus on in the coming months?",
      "What's something you'd like to do together (virtually or in-person) before the next season?"
    ],
    energyCost: 3,
    relationshipTypes: ["friend", "close-friend", "family"]
  },
  {
    id: uuidv4(),
    name: "Gratitude Practice",
    description: "Regular sharing of things you're grateful for about each other and life in general.",
    frequency: {
      unit: "months",
      value: 1,
      flexibility: 7
    },
    interactionType: "message",
    duration: 10,
    structure: "On a consistent monthly date, share 3 things you're grateful for in general and 1 specific thing about the other person.",
    prompts: [
      "What small joy are you appreciating lately?",
      "What's something the other person did that you appreciated?",
      "What's something about your relationship that you're grateful for?"
    ],
    energyCost: 2,
    relationshipTypes: ["close-friend", "family", "partner"]
  }
];

// Shared Experiences Mock Data
export const mockSharedExperiences: SharedExperience[] = [
  {
    id: uuidv4(),
    title: "The 36 Questions That Lead to Love",
    category: "activity",
    description: "A set of increasingly intimate questions designed to accelerate closeness between two people. Take turns answering each question honestly.",
    url: "https://www.nytimes.com/2015/01/09/style/no-37-big-wedding-or-small.html",
    interestTags: ["psychology", "relationships", "communication"],
    timeRequired: 90,
    energyRequired: 4,
    discussionPrompts: [
      "Which question was most surprising to answer?",
      "Did you learn anything new about yourself?",
      "Which question would you like to explore further?"
    ],
    relationshipTypes: ["close-friend", "partner"]
  },
  {
    id: uuidv4(),
    title: "How to Do Nothing: Resisting the Attention Economy",
    category: "article",
    description: "Jenny Odell's examination of the attention economy and how to reclaim our time and attention.",
    url: "https://www.theguardian.com/lifeandstyle/2019/apr/14/jenny-odell-how-to-do-nothing",
    interestTags: ["mindfulness", "technology", "society", "attention"],
    timeRequired: 20,
    energyRequired: 2,
    discussionPrompts: [
      "How do you feel about your relationship with technology?",
      "What practices help you stay present in your daily life?",
      "What aspects of 'doing nothing' do you find most challenging?"
    ],
    relationshipTypes: ["friend", "close-friend", "colleague"]
  },
  {
    id: uuidv4(),
    title: "Virtual Museum Tour",
    category: "activity",
    description: "Explore a museum exhibit together virtually and discuss your impressions.",
    url: "https://artsandculture.google.com/partner",
    interestTags: ["art", "culture", "history", "virtual"],
    timeRequired: 45,
    energyRequired: 2,
    discussionPrompts: [
      "Which piece caught your attention the most and why?",
      "Did this remind you of any experiences you've had?",
      "What themes or ideas stood out to you?"
    ],
    relationshipTypes: ["friend", "family", "partner"]
  },
  {
    id: uuidv4(),
    title: "The Science of Well-Being Course",
    category: "course",
    description: "Yale's popular course on happiness and well-being, available free online. Take it together and discuss your insights.",
    url: "https://www.coursera.org/learn/the-science-of-well-being",
    interestTags: ["psychology", "happiness", "personal growth", "learning"],
    timeRequired: 120,
    energyRequired: 3,
    discussionPrompts: [
      "Which misconception about happiness surprised you most?",
      "What practice from the course will you try implementing?",
      "How do you define well-being for yourself?"
    ],
    relationshipTypes: ["close-friend", "family", "partner"]
  },
  {
    id: uuidv4(),
    title: "Perspective-Taking Letter Exchange",
    category: "activity",
    description: "Write letters to each other from the perspective of your 80-year-old self, reflecting on what's truly important.",
    interestTags: ["reflection", "writing", "perspectives", "values"],
    timeRequired: 60,
    energyRequired: 3,
    discussionPrompts: [
      "What surprised you about what your older self wanted to communicate?",
      "What current priorities shifted when you took this perspective?",
      "What advice would your 80-year-old self give about your relationship?"
    ],
    relationshipTypes: ["close-friend", "partner"]
  },
  {
    id: uuidv4(),
    title: "The School of Life: On Being A Good Listener",
    category: "video",
    description: "Short video on what makes someone a good listener and how to improve this vital relationship skill.",
    url: "https://www.youtube.com/watch?v=-BdbiZcNBXg",
    interestTags: ["communication", "relationships", "listening", "emotional intelligence"],
    timeRequired: 15,
    energyRequired: 1,
    discussionPrompts: [
      "What qualities do you most appreciate in a listener?",
      "When do you find it hardest to listen well?",
      "How could we improve how we listen to each other?"
    ],
    relationshipTypes: ["friend", "close-friend", "family", "partner", "colleague"]
  },
  {
    id: uuidv4(),
    title: "Parallel Reading Experience",
    category: "activity",
    description: "Choose a short story or article to read simultaneously and then discuss.",
    interestTags: ["reading", "literature", "discussion", "perspectives"],
    timeRequired: 45,
    energyRequired: 2,
    discussionPrompts: [
      "Which character or aspect did you most relate to?",
      "What do you think was the author's intention?",
      "How did your interpretation differ from mine?"
    ],
    relationshipTypes: ["friend", "close-friend", "family", "partner"]
  },
  {
    id: uuidv4(),
    title: "TED Talk: The Power of Vulnerability",
    category: "video",
    description: "Brené Brown's influential talk on the importance of vulnerability in human connection.",
    url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability",
    interestTags: ["vulnerability", "connection", "psychology", "emotions"],
    timeRequired: 30,
    energyRequired: 3,
    discussionPrompts: [
      "How comfortable are you with being vulnerable?",
      "What helps you feel safe enough to be vulnerable with someone?",
      "How has vulnerability strengthened or challenged your relationships?"
    ],
    relationshipTypes: ["close-friend", "family", "partner"]
  }
];

// Filter categories and values for UI
export const questionCategories = [
  "personal-values", 
  "aspirations", 
  "experiences", 
  "beliefs"
];

export const relationshipTypes = [
  "acquaintance",
  "colleague", 
  "friend", 
  "close-friend", 
  "family", 
  "partner"
];

export const messagePurposes = [
  "thinking-of-you", 
  "appreciation", 
  "reconnection", 
  "celebration", 
  "support"
];

export const toneOptions = [
  "warm", 
  "casual", 
  "thoughtful", 
  "celebratory"
];

export const experienceCategories = [
  "article", 
  "video", 
  "activity", 
  "game", 
  "course"
];

export const depthLevelDescriptions = [
  { level: 1, label: "Light", description: "Surface-level questions suitable for newer relationships or lighter conversations." },
  { level: 2, label: "Medium", description: "Moderately personal questions that encourage reflection without requiring deep vulnerability." },
  { level: 3, label: "Deep", description: "Intimate questions best suited for established relationships where trust is present." }
];