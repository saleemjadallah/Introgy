
import { MindfulnessPractice } from "@/types/mindfulness";
import { v4 as uuidv4 } from "uuid";

// Preparation Mindfulness
export const preparationPractices: MindfulnessPractice[] = [
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
