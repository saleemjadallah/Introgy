
import { MindfulnessPractice } from "@/types/mindfulness";
import { v4 as uuidv4 } from "uuid";

// Energy Conservation Practices
export const energyConservationPractices: MindfulnessPractice[] = [
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

Take three deep breaths, feeling your body becoming more grounded with each exhale. [pause]

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
