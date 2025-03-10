
import { MindfulnessPractice } from "@/types/mindfulness";
import { v4 as uuidv4 } from "uuid";

// Social Recovery Meditations
export const socialRecoveryPractices: MindfulnessPractice[] = [
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
