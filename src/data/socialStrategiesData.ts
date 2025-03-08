
import { Strategy } from "@/types/social-strategies";

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Generate current date
const now = new Date();

export const socialStrategiesData: Strategy[] = [
  // Professional strategies
  {
    id: generateId(),
    title: "The 5-Minute Pre-Meeting Recharge",
    description: "A quick mental preparation technique before meetings to boost confidence and reduce anxiety.",
    scenarioType: "professional",
    type: "preparation",
    energyLevel: "low",
    prepTime: 5,
    steps: [
      "Find a quiet place (bathroom stall, empty office, etc.) for 5 minutes before the meeting",
      "Take 3 deep breaths, inhaling for 4 counts and exhaling for 6",
      "Mentally review 1-2 key points you want to contribute to the meeting",
      "Visualize yourself speaking calmly and confidently",
      "Remind yourself that you don't need to speak unless you have something valuable to add"
    ],
    examplePhrases: [
      "I've been thinking about this issue, and one approach could be...",
      "I'd like to add a perspective on this that we might consider..."
    ],
    challenges: [
      {
        challenge: "Feeling pressured to speak up immediately",
        solution: "It's perfectly acceptable to say 'I'd like to think about that for a moment' to give yourself time to collect your thoughts."
      },
      {
        challenge: "Mind goes blank during the meeting",
        solution: "Keep small note cards with bullet points of your ideas. Glance at them if needed."
      }
    ],
    tags: ["meetings", "preparation", "anxiety-reduction", "mental", "quick"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: generateId(),
    title: "The Strategic Position",
    description: "Position yourself strategically in meetings to minimize social pressure and maximize comfort.",
    scenarioType: "professional",
    type: "quick",
    energyLevel: "low",
    prepTime: 2,
    steps: [
      "Arrive at the meeting room a few minutes early",
      "Choose a seat near the exit for an easy escape if needed",
      "Alternatively, sit next to the most supportive colleague",
      "Avoid sitting directly across from the most dominant personality",
      "Keep water nearby to give yourself a natural pause when needed"
    ],
    challenges: [
      {
        challenge: "All the strategic seats are taken",
        solution: "Take any available seat but focus on maintaining a comfortable posture and breathing to stay centered."
      },
      {
        challenge: "Being asked to sit somewhere specific",
        solution: "Comply gracefully, but use other techniques like controlled breathing to maintain comfort."
      }
    ],
    tags: ["meetings", "positioning", "comfort", "environmental", "quick"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: generateId(),
    title: "Networking with Purpose",
    description: "A structured approach to networking events that conserves energy while making meaningful connections.",
    scenarioType: "professional",
    type: "energy-conservation",
    energyLevel: "medium",
    prepTime: 15,
    steps: [
      "Before the event, set a clear goal (e.g., meet 3 specific people or have 5 meaningful conversations)",
      "Research attendees and prepare 2-3 specific questions for key contacts",
      "Schedule only 60-90 minutes at the event, even if it runs longer",
      "Take 5-minute breaks every 20 minutes (bathroom, refreshments, checking phone)",
      "Use the 'bookend' technique: start with high energy, conserve in the middle, wrap up with energy"
    ],
    examplePhrases: [
      "I'm interested in your work on [specific project]. What challenges did you encounter?",
      "I've set a goal to learn about [topic] tonight. I'd love to hear your perspective.",
      "I've enjoyed our conversation. I'd like to continue this another time - may I have your contact information?"
    ],
    challenges: [
      {
        challenge: "Getting trapped in a conversation",
        solution: "Use prepared exit lines like 'I need to say hello to a few other people before the event ends, but I'd love to continue this conversation later.'"
      },
      {
        challenge: "Feeling overwhelmed by the crowd",
        solution: "Find a quiet corner or step outside for a 2-minute breathing break. Use this time to reset your energy."
      }
    ],
    tags: ["networking", "energy-management", "professional", "events", "connections"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: generateId(),
    title: "Presentation Energy Distribution",
    description: "A technique to allocate your social energy strategically before, during, and after presentations.",
    scenarioType: "professional",
    type: "energy-conservation",
    energyLevel: "high",
    prepTime: 30,
    steps: [
      "Schedule 1 hour of alone time before your presentation",
      "Decline all non-essential meetings on presentation day",
      "During the presentation, focus energy on key points and transitions",
      "Prepare for Q&A by anticipating likely questions",
      "Schedule 2 hours of recovery time after the presentation"
    ],
    challenges: [
      {
        challenge: "Being asked to socialize immediately after presenting",
        solution: "Have a prepared response: 'I'd love to discuss more, but I need to review some notes first. Can we connect in about 30 minutes?'"
      },
      {
        challenge: "Running out of energy during a long presentation",
        solution: "Build in audience participation segments (like polls or quick discussions) to give yourself brief mental breaks."
      }
    ],
    tags: ["presentations", "energy-management", "preparation", "public-speaking", "recovery"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  },

  // Social gathering strategies
  {
    id: generateId(),
    title: "The Time-Boxed Social",
    description: "Set a specific time limit for social events to preserve energy and reduce anxiety.",
    scenarioType: "social-gatherings",
    type: "energy-conservation",
    energyLevel: "medium",
    prepTime: 10,
    steps: [
      "Decide in advance exactly how long you'll stay (1-2 hours is often sufficient)",
      "Set a silent alarm on your phone as a reminder",
      "Inform the host when you arrive that you have another commitment later",
      "Focus on quality interactions rather than quantity during your limited time",
      "Leave when planned, regardless of how you're feeling in the moment"
    ],
    examplePhrases: [
      "I can only stay until 9:00 tonight, but I wanted to make sure I came to celebrate with you.",
      "Thank you so much for having me. I need to head out now for another commitment, but I've had a wonderful time."
    ],
    challenges: [
      {
        challenge: "Host or friends pressuring you to stay longer",
        solution: "Be firm but appreciative: 'I wish I could stay longer because I'm having a great time, but I really do need to go. Let's plan something soon!'"
      },
      {
        challenge: "Feeling awkward about leaving when others are staying",
        solution: "Remember that leaving at your peak energy is better than staying until you're depleted. You'll leave a better impression."
      }
    ],
    tags: ["parties", "time-management", "boundaries", "energy-conservation"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: generateId(),
    title: "The Purposeful Contribution",
    description: "Volunteer for a specific role at social gatherings to give structure to your interactions.",
    scenarioType: "social-gatherings",
    type: "connection",
    energyLevel: "medium",
    prepTime: 5,
    steps: [
      "Offer to help with a specific task (e.g., mixing drinks, taking photos, serving food)",
      "Use your role as a natural conversation starter",
      "Take short breaks from your role when needed",
      "Transition to general socializing once you feel comfortable",
      "Return to your role if you need a structured break from open socializing"
    ],
    examplePhrases: [
      "I'd be happy to be the photographer tonight if that would help.",
      "Would you like me to help set up the food table? I'm pretty good at organizing things."
    ],
    challenges: [
      {
        challenge: "Getting stuck in the helper role all night",
        solution: "Set a time limit for your task, then gracefully hand it off: 'I've enjoyed being the photographer. Would anyone else like to take some pictures for a while?'"
      },
      {
        challenge: "Role doesn't facilitate the interactions you hoped for",
        solution: "Shift to a different role or use your current role to transition: 'While I'm setting up these appetizers, I'd love to hear about your recent trip.'"
      }
    ],
    tags: ["parties", "role-playing", "structure", "contributions", "conversation-starters"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  },

  // One-on-one strategies
  {
    id: generateId(),
    title: "The Deep Connection Framework",
    description: "A structured approach to meaningful one-on-one conversations that feels natural and authentic.",
    scenarioType: "one-on-one",
    type: "connection",
    energyLevel: "medium",
    prepTime: 15,
    steps: [
      "Before meeting, identify 3 potential topics you genuinely want to discuss",
      "Start with light observations before moving to deeper topics",
      "Practice the 'question, listen, relate, question' technique",
      "Share a relevant personal story to encourage reciprocal sharing",
      "Be comfortable with natural silence - it's not your responsibility to fill every gap"
    ],
    examplePhrases: [
      "What was the highlight of your week? Mine was...",
      "That reminds me of something I experienced... [brief story]. Have you ever had a similar experience?",
      "That's really interesting. What made you decide to take that approach?"
    ],
    challenges: [
      {
        challenge: "Conversation feels forced or unnatural",
        solution: "Acknowledge it lightly: 'I feel like we're both a bit tired today. Maybe we could just enjoy our coffee and chat about something easy like the last good movie we saw?'"
      },
      {
        challenge: "The other person doesn't reciprocate depth",
        solution: "Respect their boundaries and adjust your approach. Not every conversation needs to be deep to be meaningful."
      }
    ],
    tags: ["friendship", "dating", "deep-conversations", "connection", "authenticity"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: generateId(),
    title: "The Introvert's Date Strategy",
    description: "Plan dates that leverage introvert strengths and minimize energy drain while creating connection.",
    scenarioType: "one-on-one",
    type: "preparation",
    energyLevel: "medium",
    prepTime: 20,
    steps: [
      "Choose side-by-side activities rather than face-to-face (walking, museum, movie + dinner)",
      "Select venues with moderate sensory stimulation (quiet cafes, nature walks)",
      "Prepare 3-5 open-ended questions based on their interests",
      "Plan for a clear endpoint (2-3 hours is ideal for early dates)",
      "Allow buffer time before and after for mental preparation and recovery"
    ],
    examplePhrases: [
      "I know this great little café that's quiet enough for good conversation. Would you like to try it?",
      "I enjoyed hearing about your interest in [topic]. What first got you interested in that?"
    ],
    challenges: [
      {
        challenge: "Date suggests a high-energy venue (loud bar, club, crowded event)",
        solution: "Offer an alternative: 'That could be fun, but I know I won't be at my best there. How about we start at [quieter place] and see how the evening goes?'"
      },
      {
        challenge: "Running out of prepared conversation topics",
        solution: "Use the environment for inspiration or try the 'past, present, future' technique - ask about something they did recently, are doing now, or plan to do."
      }
    ],
    tags: ["dating", "planning", "energy-management", "venues", "conversation"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  },

  // Family events strategies
  {
    id: generateId(),
    title: "Family Gathering Survival Kit",
    description: "A comprehensive approach to managing extended family gatherings while preserving your wellbeing.",
    scenarioType: "family-events",
    type: "energy-conservation",
    energyLevel: "high",
    prepTime: 30,
    steps: [
      "Schedule 'escape breaks' every 90 minutes (go for a walk, help in kitchen, play with pets/kids)",
      "Identify allies who understand your need for space",
      "Prepare neutral responses to potentially triggering questions",
      "Create a dedicated quiet space you can retreat to when needed",
      "Plan a recovery day after the gathering"
    ],
    examplePhrases: [
      "I'm going to step outside for some fresh air - I'll be back in a few minutes.",
      "That's an interesting question. I'm still figuring that out, but right now I'm focusing on [neutral topic].",
      "I've offered to help Uncle John with setting up the yard games. I'll catch up with everyone later."
    ],
    challenges: [
      {
        challenge: "Family members who don't understand your need for breaks",
        solution: "Frame it positively: 'I want to be fully present when we talk, so I need a few minutes to recharge now and then.'"
      },
      {
        challenge: "Feeling guilty about taking space",
        solution: "Remember that you'll be a better family member when you honor your needs. Quality interaction is better than quantity."
      }
    ],
    tags: ["family", "holidays", "boundaries", "energy-management", "self-care"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: generateId(),
    title: "The One-on-One Family Connection",
    description: "Connect meaningfully with family members by creating pockets of one-on-one time during group events.",
    scenarioType: "family-events",
    type: "connection",
    energyLevel: "medium",
    prepTime: 5,
    steps: [
      "Identify 2-3 specific family members you want to connect with",
      "Create natural opportunities for brief one-on-one conversations (help with dishes, sit together during a meal)",
      "Ask about their specific interests rather than general questions",
      "Listen actively and ask follow-up questions",
      "Express appreciation for the conversation before rejoining the group"
    ],
    examplePhrases: [
      "Aunt Sarah, I'd love to hear more about your garden this year. Want to take a quick walk outside?",
      "I've been meaning to ask you about your new job. How's that going so far?"
    ],
    challenges: [
      {
        challenge: "Conversation being constantly interrupted",
        solution: "Suggest a specific activity away from the main group: 'Would you like to help me pick up a few things from the store? It would be nice to catch up.'"
      },
      {
        challenge: "Relative dominates with superficial talk",
        solution: "Ask a specific, meaningful question about something you know they care about to redirect the conversation."
      }
    ],
    tags: ["family", "one-on-one", "connection", "conversation", "relationships"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  },

  // Public spaces strategies
  {
    id: generateId(),
    title: "The Public Transport Sanctuary",
    description: "Create a comfortable personal space in public transportation to reduce social drain.",
    scenarioType: "public-spaces",
    type: "quick",
    energyLevel: "low",
    prepTime: 2,
    steps: [
      "Position yourself near exits when possible",
      "Create a sensory barrier with headphones (even if not listening to anything)",
      "Have a specific focus activity (book, podcast, game on phone)",
      "Prepare a polite but firm phrase for unwanted conversation",
      "Practice deep breathing if feeling overwhelmed"
    ],
    examplePhrases: [
      "I'm sorry, I need to focus on this right now.",
      "Excuse me, I'd like to continue reading/listening if you don't mind."
    ],
    challenges: [
      {
        challenge: "Someone sits next to you and wants to talk",
        solution: "Politely indicate your preference: 'I hope you don't mind, but I really need this time to decompress. Thank you for understanding.'"
      },
      {
        challenge: "Feeling anxious in crowded transport",
        solution: "Focus on a fixed point and count your breaths. Remind yourself that this is temporary."
      }
    ],
    tags: ["commuting", "boundaries", "public-transport", "quick", "personal-space"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: generateId(),
    title: "The Retail Interaction Script",
    description: "A simple framework for comfortable interactions with retail and service workers.",
    scenarioType: "public-spaces",
    type: "preparation",
    energyLevel: "low",
    prepTime: 5,
    steps: [
      "Prepare your request or question in advance",
      "Lead with a brief greeting and your name if appropriate",
      "State your request clearly and directly",
      "Express appreciation regardless of outcome",
      "End with a simple closing"
    ],
    examplePhrases: [
      "Hi there. I'm looking for [specific item]. Could you tell me where I might find it?",
      "Hello. I ordered [item] online for pickup. My name is [your name].",
      "Thank you for your help. I appreciate it."
    ],
    challenges: [
      {
        challenge: "Worker asks unrelated personal questions",
        solution: "Provide brief, polite responses and redirect: 'I'm doing well, thanks. About that [item] I was asking about...'"
      },
      {
        challenge: "Feeling pressured by sales tactics",
        solution: "Have a prepared response: 'Thank you for the information. I need some time to think about it. I'll let you know if I have questions.'"
      }
    ],
    tags: ["shopping", "scripts", "service-interactions", "retail", "brief-encounters"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  },

  // Digital communication strategies
  {
    id: generateId(),
    title: "The Video Call Energy Saver",
    description: "Techniques to reduce the unique social drain of video calls and meetings.",
    scenarioType: "digital-communication",
    type: "energy-conservation",
    energyLevel: "medium",
    prepTime: 10,
    steps: [
      "Schedule calls with 15-minute buffers before and after",
      "Set up your background to minimize visual distractions",
      "Use 'hide self view' option once you've confirmed your setup",
      "Take 'micro-breaks' by momentarily looking away from faces when others are speaking",
      "Use the chat function strategically to participate without speaking"
    ],
    challenges: [
      {
        challenge: "Being asked to keep your camera on when you'd prefer not to",
        solution: "Offer a compromise: 'I'll turn my camera on for introductions and important discussion points, but may turn it off at other times to help me focus better.'"
      },
      {
        challenge: "Multiple back-to-back video calls",
        solution: "Request at least one call be audio-only, or take a 5-minute break with camera and microphone off between calls."
      }
    ],
    tags: ["zoom", "video-calls", "meetings", "virtual", "energy-management"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: generateId(),
    title: "The Email Communications Framework",
    description: "A structured approach to email that improves clarity while reducing anxiety about digital communication.",
    scenarioType: "digital-communication",
    type: "preparation",
    energyLevel: "low",
    prepTime: 15,
    steps: [
      "Use a consistent template for common email types",
      "Write the body first, subject line last",
      "Clearly state purpose in the first sentence",
      "Use bullet points for multiple items or questions",
      "Review once for content, once for tone, then send"
    ],
    examplePhrases: [
      "I'm writing to request [specific information/action] by [date if applicable].",
      "Could you please clarify the following points: [numbered list]",
      "Thank you for considering this. I look forward to your response."
    ],
    challenges: [
      {
        challenge: "Overthinking and rewriting emails repeatedly",
        solution: "Set a timer for email composition. When it rings, do one final review and send."
      },
      {
        challenge: "Receiving vague or confusing responses",
        solution: "Use the 'clarification template': 'Thank you for your response. To ensure I understand correctly, you're saying that [your interpretation]. Is that right?'"
      }
    ],
    tags: ["email", "communication", "templates", "digital", "efficiency"],
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  }
];
