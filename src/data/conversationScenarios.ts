
import { Scenario } from "@/types/conversation";

const scenarios: Scenario[] = [
  {
    id: "job-interview",
    name: "Job Interview",
    type: "professional",
    difficulty: "intermediate",
    duration: "extended",
    personaType: "interviewer",
    description: "Practice answering common job interview questions for a position in your field.",
    initialMessage: "Thanks for coming in today. Could you start by telling me a little about yourself and why you're interested in this position?"
  },
  {
    id: "networking-event",
    name: "Networking Event",
    type: "professional",
    difficulty: "intermediate",
    duration: "short",
    personaType: "direct communicator",
    description: "Practice introducing yourself and making meaningful connections at a networking event.",
    initialMessage: "Hi there! I don't think we've met before. I'm Alex. What brings you to this event today?"
  },
  {
    id: "team-meeting",
    name: "Team Meeting Contribution",
    type: "professional",
    difficulty: "beginner",
    duration: "quick",
    personaType: "colleague",
    description: "Practice speaking up in a team meeting and sharing your ideas effectively.",
    initialMessage: "We're looking for new ideas to improve our project workflow. Does anyone have suggestions they'd like to share?"
  },
  {
    id: "presentation-qa",
    name: "Presentation Q&A",
    type: "professional",
    difficulty: "advanced",
    duration: "short",
    personaType: "direct communicator",
    description: "Practice answering challenging questions after giving a presentation.",
    initialMessage: "Thanks for your presentation. I have some concerns about the timeline you proposed. Could you elaborate on how you arrived at those estimates?"
  },
  {
    id: "casual-party",
    name: "Casual Party Chat",
    type: "social",
    difficulty: "beginner",
    duration: "quick",
    personaType: "acquaintance",
    description: "Practice casual conversation with someone you just met at a friend's party.",
    initialMessage: "Hey, I'm Jamie. I think we have a mutual friend in Sam. How do you know the host?"
  },
  {
    id: "dinner-party",
    name: "Dinner Party",
    type: "social",
    difficulty: "intermediate",
    duration: "extended",
    personaType: "rambler",
    description: "Navigate a dinner party conversation with multiple topics and a talkative dinner companion.",
    initialMessage: "I was just telling everyone about this amazing documentary I watched last week about deep sea creatures. Have you seen it? If not, let me tell you all about it..."
  },
  {
    id: "first-date",
    name: "First Date",
    type: "social",
    difficulty: "intermediate",
    duration: "extended",
    personaType: "acquaintance",
    description: "Practice conversation on a first date, balancing questions and sharing about yourself.",
    initialMessage: "It's nice to finally meet in person. This place has great reviews. Have you been here before?"
  },
  {
    id: "boundary-setting",
    name: "Setting Boundaries",
    type: "challenging",
    difficulty: "advanced",
    duration: "short",
    personaType: "close-talker",
    description: "Practice setting boundaries with someone who is asking too much of your time.",
    initialMessage: "Hey, I really need your help with this project this weekend. I know it's last minute, but I'm really counting on you. You can do it, right?"
  },
  {
    id: "conflict-resolution",
    name: "Conflict Resolution",
    type: "challenging",
    difficulty: "advanced",
    duration: "extended",
    personaType: "direct communicator",
    description: "Practice resolving a disagreement with a colleague in a professional manner.",
    initialMessage: "I have some concerns about how you handled the client meeting yesterday. Some of the information you presented wasn't accurate."
  },
  {
    id: "saying-no",
    name: "Saying No",
    type: "challenging",
    difficulty: "intermediate",
    duration: "quick",
    personaType: "friend",
    description: "Practice politely declining requests without feeling guilty.",
    initialMessage: "Hey, are you free this weekend? I need help moving to my new apartment. It'll probably take all day Saturday and Sunday."
  },
  {
    id: "small-talk-neighbor",
    name: "Small Talk with Neighbor",
    type: "daily",
    difficulty: "beginner",
    duration: "quick",
    personaType: "acquaintance",
    description: "Practice casual small talk with a neighbor you see regularly.",
    initialMessage: "Beautiful weather we're having today, isn't it? I noticed you've been doing some gardening in your yard."
  },
  {
    id: "restaurant-order",
    name: "Restaurant Order Issue",
    type: "daily",
    difficulty: "beginner",
    duration: "quick",
    personaType: "customer service",
    description: "Practice addressing an issue with your order at a restaurant.",
    initialMessage: "Hi there, how is everything tasting so far?"
  },
  {
    id: "service-provider",
    name: "Talking to Service Provider",
    type: "daily",
    difficulty: "intermediate",
    duration: "short",
    personaType: "customer service",
    description: "Practice explaining a problem to a service provider and requesting assistance.",
    initialMessage: "Thank you for calling customer support. My name is Taylor. How can I help you today?"
  }
];

export const getScenarios = (): Scenario[] => {
  return scenarios;
};

export const getScenarioById = (id: string): Scenario | undefined => {
  return scenarios.find(scenario => scenario.id === id);
};

export const getScenariosByType = (type: string): Scenario[] => {
  if (type === "all") return scenarios;
  return scenarios.filter(scenario => scenario.type === type);
};
