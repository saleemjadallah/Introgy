
import { MindfulnessPractice } from "@/types/mindfulness";
import { v4 as uuidv4 } from "uuid";

// Social Recovery Meditations
const socialRecoveryPractices: MindfulnessPractice[] = [
  {
    id: uuidv4(),
    title: "Social Cool-Down",
    category: "Social Recovery",
    subcategory: "Social Cool-Down",
    duration: 10,
    description: "A guided practice to help you release tension and recharge after social interactions.",
    script: `Find a comfortable position and allow your body to settle. [pause]

Take a deep breath in, and as you exhale, begin to notice the sensations in your body after socializing. [pause]

Notice any areas of tension—perhaps in your shoulders, jaw, or chest. [pause]

With each breath, imagine releasing a little of that social energy. [pause]

Acknowledge any conversations or interactions that are still playing in your mind. You don't need to analyze them right now—simply observe them as they arise and then let them go. [pause]

Bring your awareness to the quiet space you're creating within yourself. [pause]

Remember that this transition time is valuable and necessary. You're not withdrawing—you're restoring your natural balance. [pause]

As you continue breathing, feel yourself reclaiming your personal energy and creating space within. [pause]

Before we close, take a moment to appreciate yourself for engaging socially and now for honoring your need to restore. [pause]

When you're ready, gently bring your awareness back to the room, knowing you can return to this restful state whenever you need.`,
    tags: ["post-social", "recovery", "unwinding", "tension-release"],
    energyImpact: -4,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Interaction Processing",
    category: "Social Recovery",
    subcategory: "Interaction Processing",
    duration: 15,
    description: "A mindful reflection practice to help process social experiences in a healthy way.",
    script: `Find a comfortable seated position and close your eyes if that feels right for you. [pause]

Begin by taking three deep breaths, allowing each exhale to release any tension you're holding. [pause]

Bring to mind a recent social interaction that you'd like to process. [pause]

As you observe this interaction in your mind, try to do so with curiosity rather than judgment. [pause]

Notice any feelings that arise—perhaps satisfaction from connecting, or perhaps discomfort from certain moments. Whatever feelings emerge, simply acknowledge them. [pause]

Now, consider what you learned or what went well during this interaction. [pause]

If challenging moments come to mind, view them as opportunities for learning rather than failures. [pause]

Remember that as an introvert, you process experiences deeply, which is a strength—not a weakness. [pause]

As you prepare to close this practice, set an intention to release any overthinking about this interaction. You've given it thoughtful attention, and now you can let it rest. [pause]

Gently return your awareness to your breath and then to the room around you, carrying with you any insights you've gained.`,
    tags: ["reflection", "social-processing", "overthinking", "emotional-regulation"],
    energyImpact: -3,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Overthinking Release",
    category: "Social Recovery",
    subcategory: "Overthinking Release",
    duration: 8,
    description: "A practice to quiet mental loops and release social analysis patterns.",
    script: `Begin by settling into a comfortable position, either seated or lying down. [pause]

Take a slow breath in through your nose, and out through your mouth. [pause]

Notice if your mind is engaged in replaying social situations or conversations. [pause]

As you identify these thought patterns, imagine them as leaves floating on a stream—present, but moving along. [pause]

With each breath, picture placing a thought that you've been revisiting onto a leaf and watching it drift away. [pause]

If you notice resistance to letting these thoughts go, acknowledge that your analytical mind is trying to protect you. Gently thank it, and continue the practice. [pause]

Now, bring your attention to the present moment—the sensations in your body, the sound of your breath. [pause]

Remember that releasing overthinking isn't about suppressing thoughts, but about choosing where to direct your valuable mental energy. [pause]

As we close, set an intention to return to this practice whenever you notice yourself caught in overthinking about social situations. [pause]

Slowly bring your awareness back to your surroundings, carrying with you a sense of mental spaciousness.`,
    tags: ["overthinking", "rumination", "thought-loops", "mental-clarity"],
    energyImpact: -4,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  }
];

// Energy Conservation Practices
const energyConservationPractices: MindfulnessPractice[] = [
  {
    id: uuidv4(),
    title: "Boundary Reinforcement",
    category: "Energy Conservation",
    subcategory: "Boundary Reinforcement",
    duration: 7,
    description: "A visualization practice for protecting your personal space and energy.",
    script: `Find a position where you feel supported and comfortable. [pause]

Take a few moments to notice your breath, without changing it. [pause]

Now, bring awareness to the space around your body—a few inches out from your skin in all directions. [pause]

Imagine this space as your personal energy field. [pause]

As you breathe in, visualize this field becoming clearer and more defined. [pause]

With each exhale, imagine this boundary becoming gently strengthened—not rigid, but resilient. [pause]

Picture this boundary as selectively permeable—allowing connection and positive energy to flow, while buffering against draining interactions. [pause]

If you anticipate challenging social situations ahead, visualize yourself within this strengthened field, engaging while maintaining your sense of self. [pause]

Remember that maintaining healthy boundaries isn't selfish—it's necessary for your wellbeing and allows you to be more present when you choose to engage. [pause]

As we close, take a deep breath and affirm your right to maintain this energetic boundary in any situation. [pause]

Gently return your awareness to the room, carrying this sense of protected space with you.`,
    tags: ["boundaries", "energy-protection", "personal-space", "visualization"],
    energyImpact: -2,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Energy Shield",
    category: "Energy Conservation",
    subcategory: "Energy Shield",
    duration: 5,
    description: "A mental technique for maintaining your energy in group settings.",
    script: `Begin by sitting comfortably with your spine relatively straight. [pause]

Take three deep breaths, feeling your body become more grounded with each exhale. [pause]

Bring to mind a social situation where you often feel your energy being depleted. [pause]

As you inhale, imagine drawing in a golden light that fills your body. [pause]

With each exhale, visualize this light expanding slightly beyond your body, creating a subtle shield around you. [pause]

This shield doesn't disconnect you from others—rather, it helps you engage authentically while maintaining your energetic integrity. [pause]

Imagine this shield having a one-way valve—allowing your compassion and attention to flow outward, while preventing external energies from draining you. [pause]

When you're in a group situation, you can briefly recall this shield by taking a conscious breath. [pause]

Practice returning to this visualization now, noticing how quickly you can establish that sense of protection. [pause]

As we complete this practice, affirm: "I engage with others while honoring my energy needs." [pause]

Gently return your awareness to the present moment, knowing you can access this shield anytime.`,
    tags: ["energy-protection", "groups", "visualization", "quick-practice"],
    energyImpact: 0,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Overstimulation Grounding",
    category: "Energy Conservation",
    subcategory: "Overstimulation Grounding",
    duration: 3,
    description: "A quick practice for managing sensory overwhelm in stimulating environments.",
    script: `Wherever you are, take a moment to adjust your position so you feel stable. [pause]

If possible, close your eyes. If not, soften your gaze and look slightly downward. [pause]

Take a slow breath in through your nose for a count of four. [pause]

Hold for a moment. [pause]

Exhale through your mouth for a count of six, creating a slight whooshing sound if comfortable. [pause]

Now, bring your attention to three points of contact between your body and the surfaces supporting you. [pause]

Feel these points grounding you, creating stability amidst overstimulation. [pause]

Next, locate two sounds in your environment—first, the most prominent one, then a subtler sound in the background. [pause]

Finally, bring attention to one sensation in your body that feels neutral or pleasant. [pause]

This 3-2-1 practice can be your anchor when feeling overwhelmed. [pause]

Take another deep breath, and as you exhale, imagine excess stimulation leaving your body. [pause]

Remember you can step away from overstimulating situations when needed—this is self-care, not avoidance. [pause]

Whenever you're ready, gently transition back to your surroundings, carrying this sense of groundedness with you.`,
    tags: ["overstimulation", "grounding", "quick-relief", "sensory-management"],
    energyImpact: -3,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  }
];

// Quiet Strength Cultivation
const quietStrengthPractices: MindfulnessPractice[] = [
  {
    id: uuidv4(),
    title: "Introvert Strengths",
    category: "Quiet Strength",
    subcategory: "Introvert Strengths",
    duration: 12,
    description: "A confidence-building practice focusing on the natural strengths of introverts.",
    script: `Find a comfortable position that allows you to be both relaxed and alert. [pause]

Begin with a few deep breaths, allowing your body to settle. [pause]

Bring your awareness to the quiet space within you—the interior landscape that is so rich for introverts. [pause]

Consider your natural ability to listen deeply to others. Recall a time when your careful listening helped someone feel truly heard. [pause]

Now, reflect on your observational skills. Remember situations where you noticed subtle details or patterns that others missed. [pause]

Appreciate your capacity for deep focus and concentration. Bring to mind moments when this ability allowed you to create, solve problems, or understand complex ideas. [pause]

Acknowledge your thoughtfulness before speaking—how you consider your words carefully, adding value rather than noise to conversations. [pause]

Recognize your rich inner life and how it fuels your creativity, empathy, and wisdom. [pause]

As you breathe deeply, affirm: "My introvert nature is a source of unique strength and perspective." [pause]

When you encounter situations that seem to favor extroverted traits, return to this awareness of your valuable qualities. [pause]

As we close, take a moment to appreciate the depth and richness you bring to the world precisely because of your introvert nature. [pause]

Slowly return your awareness to your surroundings, carrying this sense of quiet confidence with you.`,
    tags: ["confidence", "strengths", "self-appreciation", "introvert-pride"],
    energyImpact: 2,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Inner Voice Clarity",
    category: "Quiet Strength",
    subcategory: "Inner Voice Clarity",
    duration: 15,
    description: "A practice for tuning into your authentic thoughts and wisdom.",
    script: `Begin by finding a comfortable seated position where you feel supported and stable. [pause]

Take several deep breaths, allowing each exhale to help you settle more fully into this moment. [pause]

Bring your awareness to the various voices that might be present in your mind—perhaps the voice of doubt, the voice of external expectations, or the voice of self-criticism. [pause]

Now, imagine these voices gently receding, like background noise gradually diminishing. [pause]

In the growing quietness, listen for your authentic inner voice—the one that speaks from your deepest values and wisdom. [pause]

This voice is often quieter than the others, speaking with simplicity and clarity rather than urgency or judgment. [pause]

If a question or situation has been on your mind, gently place it in this quiet inner space and listen. [pause]

Notice what arises without forcing or analyzing. Your inner wisdom often communicates through subtle impressions, images, or a sense of knowing. [pause]

When external influences are strong, you might temporarily lose connection with this voice. This practice helps you recognize its unique tone and presence. [pause]

As we prepare to close, set an intention to pause throughout your day to reconnect with this authentic inner voice, especially before making decisions. [pause]

Gradually bring your awareness back to your surroundings, knowing you can return to this inner clarity anytime.`,
    tags: ["authenticity", "inner-wisdom", "decision-making", "self-trust"],
    energyImpact: 1,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Self-Acceptance",
    category: "Quiet Strength",
    subcategory: "Self-Acceptance",
    duration: 10,
    description: "A meditation for embracing and appreciating your introvert nature.",
    script: `Find a position that feels comfortable and supportive for your body. [pause]

Take a few moments to settle in, noticing your breath flowing naturally. [pause]

Bring awareness to any judgments you might hold about your introvert traits—perhaps wishing you were more outgoing, more spontaneous in groups, or quicker with words. [pause]

As these judgments arise, imagine them as clouds in the sky of your mind—present, but not permanent, and not the entirety of the sky. [pause]

Now, bring to mind the gifts that come with your introvert nature. [pause]

Consider your ability to form deep connections rather than numerous casual ones. [pause]

Appreciate your capacity for rich inner reflection and meaningful thought. [pause]

Acknowledge your ability to notice nuances in situations and people that others might miss. [pause]

With each breath, silently repeat: "I accept myself fully as I am." [pause]

Remember that the world needs both extroverted and introverted energies—your way of being brings necessary depth and consideration. [pause]

If resistance arises, meet it with gentleness. Self-acceptance is a practice, not a perfect state to achieve. [pause]

As we close, place a hand over your heart if that feels comfortable, and offer yourself appreciation for showing up authentically in a world that doesn't always understand introversion. [pause]

Gently return your awareness to the room, carrying this sense of self-acceptance with you.`,
    tags: ["self-acceptance", "introvert-pride", "self-compassion", "authenticity"],
    energyImpact: 0,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  }
];

// Preparation Mindfulness
const preparationPractices: MindfulnessPractice[] = [
  {
    id: uuidv4(),
    title: "Pre-Social Centering",
    category: "Preparation",
    subcategory: "Pre-Social Centering",
    duration: 5,
    description: "A calming practice to center yourself before social events.",
    script: `Find a comfortable seated position and close your eyes if that feels right for you. [pause]

Take three deep breaths, feeling your body become more grounded with each exhale. [pause]

Bring awareness to any anticipatory thoughts or feelings about the upcoming social situation. [pause]

Without judgment, acknowledge these thoughts and feelings, noticing where they might manifest in your body—perhaps as butterflies in your stomach or tension in your shoulders. [pause]

Gently place your hand on your abdomen and take a few breaths that expand into your hand. [pause]

As you breathe, remind yourself: "I can be social in my own authentic way." [pause]

Now, set a simple intention for this upcoming interaction. Perhaps to listen well, to connect meaningfully with one or two people, or simply to be present. [pause]

Visualize yourself moving through the social situation with this intention, remaining connected to your center. [pause]

Remember that you can take brief breaks during social events—stepping outside, visiting the restroom, or finding a quieter corner—to reconnect with this centered feeling. [pause]

Before we close, take one more deep breath, filling yourself with calm presence. [pause]

When you're ready, gently open your eyes, carrying this centeredness with you as you prepare to engage.`,
    tags: ["pre-social", "centering", "anxiety-reduction", "intention-setting"],
    energyImpact: -2,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Anxiety Reduction",
    category: "Preparation",
    subcategory: "Anxiety Reduction",
    duration: 8,
    description: "A technique for managing pre-social nervousness and anxiety.",
    script: `Begin by finding a comfortable position where you can be undisturbed for the next few minutes. [pause]

Take a deep breath in through your nose for a count of four. [pause]

Hold your breath for a count of one. [pause]

Exhale slowly through your mouth for a count of six. [pause]

Continue this breathing pattern as we proceed. [pause]

Now, notice any anxious thoughts about upcoming social interactions. Rather than trying to eliminate these thoughts, simply observe them. [pause]

As you breathe, imagine each exhale creating a bit more space around these anxious thoughts. [pause]

Bring awareness to your body, scanning from your feet to your head for areas of tension. [pause]

With each exhale, imagine softening around any tension you discover. [pause]

Now, place both feet firmly on the ground and feel the stability of the earth supporting you. [pause]

Remind yourself that social interactions are temporary experiences—you can move through them at your own pace and step away when needed. [pause]

Consider what you might need to feel more at ease—perhaps arriving a bit early to acclimate to the space, having an exit plan, or identifying a quiet area for brief breaks. [pause]

As we close, affirm: "I have the resources to navigate this social situation in a way that honors my needs." [pause]

Take one final deep breath before gently returning your awareness to your surroundings.`,
    tags: ["anxiety", "nervousness", "social-preparation", "breathing-technique"],
    energyImpact: -3,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Intention Setting",
    category: "Preparation",
    subcategory: "Intention Setting",
    duration: 7,
    description: "A focus practice for creating meaningful interactions.",
    script: `Find a position that feels comfortable and grounded. [pause]

Take a few deep breaths, allowing your attention to settle into the present moment. [pause]

Bring to mind an upcoming social situation or interaction. [pause]

Rather than focusing on potential challenges, consider what would make this interaction meaningful for you. [pause]

Ask yourself: "What quality would I like to bring to this interaction?" Perhaps it's presence, curiosity, authenticity, or compassion. [pause]

Now, consider one simple, specific intention that embodies this quality. For example, "I will listen fully before responding" or "I will share something genuine about myself." [pause]

Visualize yourself embodying this intention during the interaction. What might it look like? How might it feel in your body? [pause]

Remember that this intention is for your own integrity and experience—not about controlling outcomes or others' perceptions. [pause]

If the interaction becomes overwhelming, you can silently return to this intention as an anchor. [pause]

Take a moment to appreciate yourself for approaching social situations with such thoughtfulness—this is a strength. [pause]

When you're ready, take a deep breath and affirm your intention once more. [pause]

Gently return your awareness to your surroundings, carrying this clear intention with you.`,
    tags: ["intention-setting", "meaningful-interaction", "preparation", "social-purpose"],
    energyImpact: 1,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  }
];

// Deep Focus Enhancement
const deepFocusPractices: MindfulnessPractice[] = [
  {
    id: uuidv4(),
    title: "Concentration Strengthening",
    category: "Deep Focus",
    subcategory: "Concentration Strengthening",
    duration: 10,
    description: "A practice for developing sustained attention and focus.",
    script: `Find a comfortable seated position where your spine can be relatively straight. [pause]

Take a few moments to settle in, noticing the weight of your body being supported. [pause]

Choose a single point of focus—this could be your breath at the nostrils, a simple object in front of you, or a point on the wall. [pause]

Bring your full attention to this chosen point. [pause]

When you notice your mind wandering—which is natural and will happen often—gently return your attention to your chosen focus point. [pause]

Each time you notice your attention has wandered and you bring it back, you're strengthening your concentration—just as you build muscle by lifting and lowering a weight. [pause]

If you find yourself becoming frustrated with mind-wandering, remember this is not about perfection but about the practice of returning, again and again. [pause]

Now, see if you can slightly extend the duration of your focused attention before it wanders. [pause]

Notice the quality of your attention—is it tight and strained, or relaxed and clear? Aim for the latter. [pause]

As introverts, we often have a natural capacity for deep focus—this practice helps us refine this ability. [pause]

For the final minute, maintain your focus with renewed intention. [pause]

As we close, recognize that this simple practice, done regularly, can significantly enhance your ability to concentrate in all areas of life. [pause]

Slowly expand your awareness back to the room around you.`,
    tags: ["concentration", "focus", "attention-training", "mind-training"],
    energyImpact: 0,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Flow State Access",
    category: "Deep Focus",
    subcategory: "Flow State Access",
    duration: 12,
    description: "A technique for entering and maintaining a deep work state.",
    script: `Begin by settling into a comfortable position where you feel both relaxed and alert. [pause]

Take several deep breaths, feeling your body becoming more present with each exhale. [pause]

Bring to mind a task or project that requires your deep focus and engagement. [pause]

Now, imagine clearing a space—both physically and mentally—for this single activity. [pause]

Set a clear intention for what you will focus on, making it specific enough to engage with immediately. [pause]

Take a moment to connect with your motivation for this task—not just external requirements, but what meaningful aspect of it calls to you. [pause]

Now, visualize yourself engaged in this activity with full absorption—time falling away, self-consciousness diminishing, and your attention merging with the activity itself. [pause]

Recognize potential distractions that might arise, and mentally rehearse gently redirecting your attention back to your focus. [pause]

Take a few moments to notice any resistance or hesitation about fully engaging with this task, acknowledging these feelings without judgment. [pause]

As you prepare to begin your focused work, set an intention to trust your natural rhythm—allowing yourself to settle into the work gradually, knowing that flow often emerges after the initial resistance. [pause]

Remember that as an introvert, your capacity for deep, sustained focus is a natural strength—one that becomes more accessible with practice. [pause]

Take one final deep breath, and as you exhale, imagine yourself crossing a threshold into your focused state. [pause]

When you're ready, gently open your eyes and begin your work with this quality of presence.`,
    tags: ["flow-state", "deep-work", "productivity", "focus-technique"],
    energyImpact: 3,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  },
  {
    id: uuidv4(),
    title: "Mental Clarity",
    category: "Deep Focus",
    subcategory: "Mental Clarity",
    duration: 8,
    description: "A practice for reducing mental noise and achieving clarity.",
    script: `Find a comfortable position and allow your body to settle. [pause]

Take three deep breaths, making each exhale slightly longer than the inhale. [pause]

Bring awareness to your current mental state—noticing if there's clarity or cloudiness, spaciousness or crowding, calm or agitation. [pause]

Without trying to change anything yet, simply observe the quality of your thoughts. [pause]

Now, imagine your mind as a clear blue sky, and your thoughts as clouds passing through it. [pause]

Notice that regardless of how many clouds are present, the sky itself—your awareness—remains spacious and unchanged. [pause]

For the next few moments, practice being the observer of your thoughts rather than being caught in them. When you notice yourself getting pulled into a thought stream, gently return to the perspective of the sky. [pause]

Now, with each breath, imagine creating just a bit more space between your thoughts. [pause]

If your mind is particularly busy, you might silently note "thinking, thinking" when you notice thought activity, then return to the sensation of your breath. [pause]

Remember that mental clarity isn't about having no thoughts—it's about having a spacious relationship with the thoughts that arise. [pause]

As we close, notice the quality of your attention now compared to when we began. [pause]

Carry this sense of mental spaciousness with you as you gently return your awareness to your surroundings.`,
    tags: ["mental-clarity", "thought-awareness", "mind-quieting", "presence"],
    energyImpact: -1,
    expertReviewed: true,
    imageUrl: "/placeholder.svg"
  }
];

// Combine all practices
export const mindfulnessPractices: MindfulnessPractice[] = [
  ...socialRecoveryPractices,
  ...energyConservationPractices,
  ...quietStrengthPractices,
  ...preparationPractices,
  ...deepFocusPractices
];

// API endpoint simulation functions
export const getPractices = (filters?: PracticeFilterOptions) => {
  let filteredPractices = [...mindfulnessPractices];
  
  if (filters) {
    if (filters.category) {
      filteredPractices = filteredPractices.filter(practice => 
        practice.category === filters.category
      );
    }
    
    if (filters.maxDuration) {
      filteredPractices = filteredPractices.filter(practice => 
        practice.duration <= filters.maxDuration
      );
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filteredPractices = filteredPractices.filter(practice => 
        filters.tags!.some(tag => practice.tags.includes(tag))
      );
    }
    
    if (filters.energyLevel !== undefined) {
      // If low energy (0-30%), recommend calming practices
      if (filters.energyLevel < 30) {
        filteredPractices = filteredPractices.filter(practice => 
          practice.energyImpact <= 0
        );
      } 
      // If mid energy (30-70%), recommend balanced practices
      else if (filters.energyLevel < 70) {
        filteredPractices = filteredPractices.filter(practice => 
          practice.energyImpact >= -2 && practice.energyImpact <= 2
        );
      } 
      // If high energy (70-100%), recommend grounding practices
      else {
        filteredPractices = filteredPractices.filter(practice => 
          practice.energyImpact <= 0
        );
      }
    }
  }
  
  return filteredPractices;
};

export const getPracticeById = (id: string) => {
  return mindfulnessPractices.find(practice => practice.id === id);
};

export const getRecommendedPractices = (batteryLevel: number, timeOfDay: 'morning' | 'afternoon' | 'evening', previousPractices: string[] = []) => {
  // Simple recommendation algorithm based on energy level and time of day
  let recommendations: MindfulnessPractice[] = [];
  
  // Base recommendations on battery level
  if (batteryLevel < 30) {
    // Low battery: recommend calming, recharging practices
    recommendations = mindfulnessPractices.filter(p => 
      p.energyImpact <= 0 && 
      p.duration <= 10 // Shorter practices when battery is low
    );
  } else if (batteryLevel < 70) {
    // Medium battery: recommend balanced practices
    recommendations = mindfulnessPractices.filter(p => 
      p.energyImpact >= -3 && p.energyImpact <= 3
    );
  } else {
    // High battery: can handle more engaging practices
    recommendations = mindfulnessPractices.filter(p => 
      p.energyImpact >= -5 && p.energyImpact <= 5
    );
  }
  
  // Further filter by time of day
  if (timeOfDay === 'morning') {
    // Morning: more energizing practices
    recommendations = recommendations.filter(p => p.energyImpact >= -2);
  } else if (timeOfDay === 'evening') {
    // Evening: more calming practices
    recommendations = recommendations.filter(p => p.energyImpact <= 2);
  }
  
  // Remove practices that user has recently done
  if (previousPractices.length > 0) {
    recommendations = recommendations.filter(p => !previousPractices.includes(p.id));
  }
  
  // Return top 3 recommendations, or all if less than 3
  return recommendations.slice(0, 3);
};

// Function to record a completed practice (client-side simulation)
export const recordCompletedPractice = (
  practiceId: string, 
  effectivenessRating: number, 
  energyChange: number, 
  notes?: string
) => {
  // In a real implementation, this would send data to a backend
  console.log('Practice completed:', {
    practiceId,
    effectivenessRating,
    energyChange,
    notes,
    timestamp: new Date().toISOString()
  });
  
  // For now, just store in localStorage
  const completedPractices = localStorage.getItem('completedPractices') 
    ? JSON.parse(localStorage.getItem('completedPractices')!) 
    : [];
  
  completedPractices.push({
    practiceId,
    effectivenessRating,
    energyChange,
    notes,
    timestamp: new Date().toISOString()
  });
  
  localStorage.setItem('completedPractices', JSON.stringify(completedPractices));
  
  return {
    success: true,
    message: 'Practice completion recorded'
  };
};
