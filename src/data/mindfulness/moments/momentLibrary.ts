
import { MindfulMoment, MomentCategory } from "@/types/mindfulness";

// Breathing Techniques
const breathingMoments: MindfulMoment[] = [
  {
    id: "breathing-box",
    title: "Box Breathing",
    category: "breathing",
    duration: 60, // seconds
    situation: ["stress", "anxiety", "pre-social", "focus"],
    energyLevel: {
      min: 2,
      max: 8
    },
    content: {
      instructions: "Breathe in for 4, hold for 4, out for 4, hold for 4",
      script: "Find a comfortable position. We'll practice box breathing - a technique to calm your nervous system. Begin by exhaling completely. Then, breathe in through your nose for 4 seconds. Hold your breath for 4 seconds. Exhale through your mouth for 4 seconds. Hold your breath for 4 seconds. This is one cycle. Let's continue for a few more cycles, maintaining this steady rhythm. In for 4... hold for 4... out for 4... hold for 4...",
      animationId: "box-breathing"
    },
    tags: ["calming", "focus", "anxiety-relief"]
  },
  {
    id: "breathing-478",
    title: "4-7-8 Calming Breath",
    category: "breathing",
    duration: 90, // seconds
    situation: ["bedtime", "anxiety", "overwhelm"],
    energyLevel: {
      min: 4,
      max: 10
    },
    content: {
      instructions: "Breathe in for 4, hold for 7, out for 8",
      script: "This relaxing breath practice will help calm your nervous system. Sit comfortably or lie down. Close your mouth and inhale quietly through your nose for 4 seconds. Hold your breath for 7 seconds. Exhale completely through your mouth for 8 seconds, making a gentle 'whoosh' sound. This completes one cycle. Let's repeat this cycle 3 more times together. Breathe in through your nose for 4... hold for 7... and exhale through your mouth for 8...",
      animationId: "breath-478"
    },
    tags: ["deep-relaxation", "sleep", "stress-relief"]
  },
  {
    id: "breathing-energy",
    title: "Energy-Boosting Breath",
    category: "breathing",
    duration: 60, // seconds
    situation: ["fatigue", "low-energy", "pre-social"],
    energyLevel: {
      min: 1,
      max: 5
    },
    content: {
      instructions: "Quick inhales through nose, longer exhales through mouth",
      script: "This energizing breath practice will help increase your alertness. Sit with a straight spine. We'll practice quick, forceful inhales followed by longer exhales. Take a quick, sharp inhale through your nose, then exhale slowly through your mouth. Continue with a rhythm that feels energizing but not uncomfortable. Inhale... exhale... inhale... exhale... Feel the energy beginning to circulate through your body with each breath cycle.",
      animationId: "energy-breath"
    },
    tags: ["energizing", "alertness", "vitality"]
  },
  {
    id: "breathing-anxiety",
    title: "Anxiety-Reducing Breath",
    category: "breathing",
    duration: 90, // seconds
    situation: ["anxiety", "panic", "pre-social", "overwhelm"],
    energyLevel: {
      min: 6,
      max: 10
    },
    content: {
      instructions: "Long, deep inhales and extended, slow exhales",
      script: "This practice helps activate your parasympathetic nervous system to reduce anxiety. Begin by placing one hand on your chest and one on your belly. Take a slow, deep breath in through your nose for 5 seconds, allowing your belly to expand. Then exhale slowly through your mouth for 6 seconds, completely emptying your lungs. Feel your body relaxing with each exhale. Let's continue this pattern, focusing on making each exhale slightly longer than your inhale. Breathe in... and out...",
      animationId: "anxiety-breath"
    },
    tags: ["anxiety-relief", "calming", "grounding"]
  }
];

// Grounding Exercises
const groundingMoments: MindfulMoment[] = [
  {
    id: "grounding-54321",
    title: "5-4-3-2-1 Sensory Grounding",
    category: "grounding",
    duration: 120, // seconds
    situation: ["anxiety", "overwhelm", "dissociation"],
    energyLevel: {
      min: 5,
      max: 10
    },
    content: {
      instructions: "Notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
      script: "This grounding technique uses your five senses to bring you back to the present moment. Start by taking a deep breath. Now, name 5 things you can see around you. Look for small details you might not usually notice. Next, name 4 things you can physically feel - your clothes, the air, the surface you're touching. Now, listen carefully for 3 things you can hear. Then, try to notice 2 things you can smell or like the smell of. Finally, notice 1 thing you can taste or would like to taste. Take another deep breath and notice how you feel more present.",
    },
    tags: ["anxiety-relief", "present-moment", "overwhelm"]
  },
  {
    id: "grounding-bodyscan",
    title: "Quick Body Scan",
    category: "grounding",
    duration: 90, // seconds
    situation: ["stress", "tension", "pre-social"],
    energyLevel: {
      min: 3,
      max: 9
    },
    content: {
      instructions: "Systematically notice sensations in different body parts",
      script: "This quick body scan will help bring awareness to physical sensations, grounding you in the present. Start with three deep breaths. Now bring attention to your feet - notice any sensations without judgment. Move your awareness up to your legs, noticing any tension or comfort. Continue to your torso, shoulders, arms, and hands - just observing what's there. Finally, bring awareness to your neck, face, and head. Take a final deep breath, feeling your whole body as you inhale and exhale.",
    },
    tags: ["body-awareness", "tension-release", "centering"]
  },
  {
    id: "grounding-environment",
    title: "Physical Environment Anchoring",
    category: "grounding",
    duration: 60, // seconds
    situation: ["anxiety", "overwhelm", "unfamiliar-settings"],
    energyLevel: {
      min: 5,
      max: 10
    },
    content: {
      instructions: "Engage with your physical surroundings to anchor yourself",
      script: "This practice helps you anchor yourself in your physical environment. Start by noticing the space around you. Feel the surface supporting you - its texture, firmness, temperature. Place your palms on this surface and apply gentle pressure, feeling the stability it provides. Look around and identify objects in your environment - their colors, shapes, and positions. Take a moment to orient yourself to where you are right now. Feel your feet on the ground, establishing a solid connection with the earth. Take three deep breaths, feeling more grounded with each exhale.",
    },
    tags: ["spatial-awareness", "stability", "presence"]
  },
  {
    id: "grounding-sensory",
    title: "Quick Sensory Shift",
    category: "grounding",
    duration: 45, // seconds
    situation: ["overthinking", "rumination", "mental-loop"],
    energyLevel: {
      min: 3,
      max: 8
    },
    content: {
      instructions: "Use strong sensory input to shift attention to the present",
      script: "This practice helps interrupt mental loops by shifting attention to strong sensory experiences. Find something with a distinct texture nearby. Run your fingers over it slowly, noticing every detail of how it feels. If possible, hold something cold like a glass of water - focus completely on the sensation of coldness. Listen intently to the sounds around you, from closest to furthest away. Take a deep breath and notice any scents in the air. This quick sensory shift helps bring your attention back to the present moment and out of thought spirals.",
    },
    tags: ["pattern-interrupt", "present-moment", "sensory-focus"]
  }
];

// Thought Reset Patterns
const thoughtResetMoments: MindfulMoment[] = [
  {
    id: "thought-labeling",
    title: "Thought Labeling",
    category: "thought-reset",
    duration: 90, // seconds
    situation: ["overthinking", "rumination", "anxiety"],
    energyLevel: {
      min: 4,
      max: 9
    },
    content: {
      instructions: "Notice thoughts and gently label them without judgment",
      script: "This practice helps create distance from overwhelming thoughts. Sit comfortably and close your eyes if that feels right. For the next minute, simply notice what thoughts arise in your mind. As each thought appears, gently label it: 'planning,' 'worrying,' 'remembering,' 'judging,' etc. Don't try to change the thoughts - just notice and label them. Then let them pass, like clouds moving across the sky. Notice how you can observe your thoughts without being completely absorbed by them. Continue noticing and labeling for a few more moments.",
    },
    tags: ["metacognition", "thought-awareness", "mental-space"]
  },
  {
    id: "thought-cleanse",
    title: "Mental Cleanse Visualization",
    category: "thought-reset",
    duration: 120, // seconds
    situation: ["mental-clutter", "overthinking", "transition"],
    energyLevel: {
      min: 3,
      max: 8
    },
    content: {
      instructions: "Visualize releasing thoughts and mental clutter",
      script: "This visualization helps clear mental clutter. Close your eyes and take three deep breaths. Imagine your thoughts as visible objects - perhaps as leaves on a stream, clouds in the sky, or bubbles rising in water. See each thought that's been occupying your mind take form. Now visualize these thought-objects gently moving away - floating downstream, drifting across the sky, or rising up and disappearing. Don't force them away, just allow them to naturally move on. Feel the mental space that opens up as each thought departs. Take a final deep breath into this clearer mental space.",
    },
    tags: ["visualization", "mental-clarity", "letting-go"]
  },
  {
    id: "thought-reframe",
    title: "Cognitive Reframing",
    category: "thought-reset",
    duration: 120, // seconds
    situation: ["negative-thoughts", "self-criticism", "social-worry"],
    energyLevel: {
      min: 3,
      max: 8
    },
    content: {
      instructions: "Notice a challenging thought and explore alternative perspectives",
      script: "This practice helps shift perspective on difficult thoughts. Take a moment to identify one thought that's been challenging for you recently. Notice how this thought feels in your body. Now, gently ask yourself: 'Is this thought definitely true? What evidence might suggest otherwise? How would I view this situation if it happened to someone I care about? What's a more balanced or compassionate way to view this?' You don't need to force a positive perspective - just explore alternative viewpoints with curiosity. Notice if any shift occurs in how you relate to the original thought.",
    },
    tags: ["perspective-shift", "cognitive-flexibility", "self-compassion"]
  },
  {
    id: "thought-postpone",
    title: "Worry Postponement",
    category: "thought-reset",
    duration: 60, // seconds
    situation: ["worry", "anxiety", "focus-needed"],
    energyLevel: {
      min: 4,
      max: 9
    },
    content: {
      instructions: "Schedule a specific time for worrying later",
      script: "This technique helps contain worry by creating a designated time for it later. Notice what worries are currently on your mind. For each worry, mentally say: 'I see you, and I'll give you my full attention later.' Decide on a specific 15-minute period later today when you'll have your 'worry time.' Visualize placing each worry in a container (like a box or folder) that you'll open during that scheduled time. Now, take three breaths, knowing you've created a plan to address these concerns appropriately, and you can release them for now. If the worries return before your scheduled time, gently remind yourself they have their allotted time later.",
    },
    tags: ["worry-management", "focus", "mental-containment"]
  }
];

// Energy Check-ins
const energyCheckMoments: MindfulMoment[] = [
  {
    id: "energy-bodyscan",
    title: "Body Energy Scan",
    category: "energy-check",
    duration: 60, // seconds
    situation: ["awareness", "check-in", "pre-decision"],
    energyLevel: {
      min: 1,
      max: 10
    },
    content: {
      instructions: "Scan your body to assess energy levels in different areas",
      script: "This scan helps you check in with your body's current energy state. Sit comfortably and close your eyes if that feels right. Starting with your feet and moving upward, notice the quality of energy in each area of your body. Some areas might feel heavy, buzzing, tense, relaxed, or empty. There's no right or wrong - just notice. Pay special attention to your chest, shoulders, and head - common areas where introverts might feel energy depletion. Complete the scan with three breaths, allowing yourself to have a clearer picture of your current energetic state.",
    },
    tags: ["body-awareness", "energy-mapping", "self-knowledge"]
  },
  {
    id: "energy-weather",
    title: "Emotional Weather Report",
    category: "energy-check",
    duration: 45, // seconds
    situation: ["emotional-awareness", "transition", "check-in"],
    energyLevel: {
      min: 1,
      max: 10
    },
    content: {
      instructions: "Describe your emotional state as weather patterns",
      script: "This practice uses weather as a metaphor for emotional states. Take three breaths to center yourself. Ask: 'What's my emotional weather right now?' Notice if you're experiencing sunshine, fog, storms, gentle rain, wind, or any other weather pattern. You might have multiple weather patterns happening simultaneously in different areas. There's no need to change anything - simply notice with curiosity. Consider: How long has this weather been present? Is it intensifying or passing? Acknowledge your current emotional weather without judgment, knowing that like all weather, it will eventually change.",
    },
    tags: ["emotional-awareness", "metaphor", "acceptance"]
  },
  {
    id: "energy-needs",
    title: "Quick Needs Assessment",
    category: "energy-check",
    duration: 30, // seconds
    situation: ["decision-point", "depletion", "self-care"],
    energyLevel: {
      min: 1,
      max: 10
    },
    content: {
      instructions: "Quickly identify your most pressing needs right now",
      script: "This quick check-in helps identify what you need most in this moment. Take two deep breaths. Ask yourself: 'What do I need right now?' Scan through different possibilities: Rest? Hydration? Movement? Quiet? Connection? Space? Nourishment? Structure? Freedom? Wait for your intuitive response - it might come as a word, image, or bodily sensation. Once you've identified your most pressing need, consider one small step you could take toward meeting this need. This brief practice helps maintain well-being by regularly checking in with your changing needs.",
    },
    tags: ["self-care", "needs-awareness", "micro-adjustment"]
  },
  {
    id: "energy-resources",
    title: "Resource Inventory",
    category: "energy-check",
    duration: 45, // seconds
    situation: ["overwhelm", "depletion", "preparation"],
    energyLevel: {
      min: 1,
      max: 6
    },
    content: {
      instructions: "Identify inner and outer resources available to you",
      script: "This practice helps you take inventory of your available resources. Take three centered breaths. First, notice any inner resources you can access right now - patience, humor, determination, kindness, adaptability, etc. Acknowledge these inner strengths. Next, consider outer resources available to you - supportive people, tools, physical items, information, services, or environments. This quick inventory reminds you of the resources you have, even when feeling depleted. Consider which resources might be most helpful for your current situation as you complete this practice.",
    },
    tags: ["resource-awareness", "strength-finding", "support-mapping"]
  }
];

// Combine all moments into one library
export const mindfulMoments: MindfulMoment[] = [
  ...breathingMoments,
  ...groundingMoments,
  ...thoughtResetMoments,
  ...energyCheckMoments
];

// Helper functions to work with the library
export const getMomentsByCategory = (category: MomentCategory): MindfulMoment[] => {
  return mindfulMoments.filter(moment => moment.category === category);
};

export const getMomentById = (id: string): MindfulMoment | undefined => {
  return mindfulMoments.find(moment => moment.id === id);
};

export const getSuggestedMoments = (
  batteryLevel: number, 
  situation?: string[]
): MindfulMoment[] => {
  // Convert battery level to 1-10 scale
  const energyLevel = Math.round(batteryLevel / 10);
  
  // Filter moments by energy level
  let filteredMoments = mindfulMoments.filter(moment => 
    energyLevel >= moment.energyLevel.min && 
    energyLevel <= moment.energyLevel.max
  );
  
  // If situation provided, further filter by situation
  if (situation && situation.length > 0) {
    filteredMoments = filteredMoments.filter(moment => 
      situation.some(s => moment.situation.includes(s))
    );
  }
  
  // Return up to 3 moments, prioritizing those that best match the energy level
  return filteredMoments
    .sort((a, b) => {
      const aMidpoint = (a.energyLevel.min + a.energyLevel.max) / 2;
      const bMidpoint = (b.energyLevel.min + b.energyLevel.max) / 2;
      return Math.abs(aMidpoint - energyLevel) - Math.abs(bMidpoint - energyLevel);
    })
    .slice(0, 3);
};
