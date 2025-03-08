
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface GlossaryTerm {
  term: string;
  definition: string;
  letter: string;
}

const glossaryData: GlossaryTerm[] = [
  { letter: "A", term: "Alone Time", definition: "Deliberately scheduled periods of solitude that introverts require to recharge their mental and emotional energy. Not to be confused with loneliness." },
  { letter: "A", term: "Ambivert", definition: "A person whose personality displays a balance of introvert and extrovert traits, often adapting their social approach based on the context." },
  { letter: "A", term: "Anxious Introversion", definition: "A type of introversion characterized by both a preference for solitude and heightened social anxiety; differs from social introversion in that the desire for solitude stems partially from fear rather than preference alone." },
  { letter: "B", term: "Behavioral Inhibition System (BIS)", definition: "A neurological system theorized to be more active in introverts, making them more sensitive to potential threats and negative outcomes, contributing to their cautious approach to novel situations." },
  { letter: "B", term: "Boundary Setting", definition: "The practice of establishing and communicating personal limits regarding social interaction, which is essential for introverts to manage their energy levels." },
  { letter: "C", term: "Cognitive Stimulation Theory", definition: "The theory suggesting introverts process more information per second than extroverts, leading to quicker mental fatigue in stimulating environments." },
  { letter: "C", term: "Contemplative Focus", definition: "The introvert's natural ability to maintain deep concentration on tasks or thoughts for extended periods without external input." },
  { letter: "C", term: "Conversational Overload", definition: "The state where an introvert becomes mentally exhausted from processing multiple conversational inputs simultaneously, particularly in group settings." },
  { letter: "D", term: "Deep Processing", definition: "The introvert tendency to thoroughly analyze information, experiences, and conversations rather than engaging with them superficially." },
  { letter: "D", term: "Defensive Pessimism", definition: "A cognitive strategy often used by introverts where they set low expectations and think through potential problems as a way to prepare for social situations." },
  { letter: "D", term: "Directed Attention Fatigue", definition: "Mental exhaustion resulting from extended periods of focused attention, which introverts may experience more acutely due to their deep processing style." },
  { letter: "E", term: "Energy Conservation", definition: "Strategic behaviors introverts employ to minimize unnecessary social exertion, preserving mental resources for essential or meaningful interactions." },
  { letter: "E", term: "Extroversion", definition: "A personality trait characterized by deriving energy from external stimulation and social interaction; the complement to introversion on the personality spectrum." },
  { letter: "E", term: "Environmental Sensitivity", definition: "Heightened awareness and responsiveness to external stimuli (sounds, lights, activity) that many introverts experience, contributing to quicker overstimulation." },
  { letter: "F", term: "Focused Conversation", definition: "A discussion with clear purpose and depth, typically preferred by introverts over scattered small talk." },
  { letter: "F", term: "Flow State", definition: "A psychological state of complete immersion in an activity, which introverts often achieve during solitary, meaningful tasks." },
  { letter: "F", term: "Frontal Lobe Activity", definition: "The increased blood flow to the frontal lobe of the brain in introverts, associated with internal mental processes like problem-solving, planning, and reflection." },
  { letter: "G", term: "Gray Matter Density", definition: "Studies suggest introverts may have higher gray matter density in certain brain regions associated with abstract thought and decision-making." },
  { letter: "G", term: "Growth Zone", definition: "The range of social interaction that challenges an introvert's comfort level enough to promote personal development without causing excessive stress." },
  { letter: "H", term: "High-Stimulation Environment", definition: "Settings with numerous sensory inputs (noise, movement, conversations) that can quickly deplete an introvert's mental energy." },
  { letter: "H", term: "Highly Sensitive Person (HSP)", definition: "A trait characterized by depth of processing, overarousability, emotional reactivity, and sensory sensitivity; often overlaps with introversion but is a distinct characteristic." },
  { letter: "I", term: "Introversion", definition: "A personality trait characterized by a preference for minimally stimulating environments and a focus on internal thoughts and feelings rather than external sources of stimulation." },
  { letter: "I", term: "Introvert Hangover", definition: "The feeling of mental and physical exhaustion following periods of extended social interaction, requiring significant recovery time." },
  { letter: "I", term: "Internal Processing", definition: "The introvert tendency to think through ideas thoroughly before expressing them, contrasting with the extrovert's tendency toward external processing through conversation." },
  { letter: "J", term: "Jung's Typology", definition: "Carl Jung's psychological framework that first identified introversion and extroversion as fundamental personality orientations, defining introverts as those who direct energy toward the inner world." },
  { letter: "L", term: "Long-Form Communication", definition: "Expression through writing, prepared presentations, or structured conversations where ideas can be fully developed; typically preferred by introverts over spontaneous verbal exchanges." },
  { letter: "L", term: "Low-Stimulation Environment", definition: "Settings with minimal sensory input that allow introverts to function optimally without energy depletion." },
  { letter: "M", term: "Maladaptive Social Cognition", definition: "Negative thought patterns about social interaction that can exacerbate introvert challenges, such as catastrophizing about social events." },
  { letter: "M", term: "Meaningful Interaction", definition: "Social exchanges characterized by depth, purpose, and authentic connection, which introverts typically find energizing compared to superficial socializing." },
  { letter: "M", term: "Mental Rehearsal", definition: "The introvert tendency to mentally practice conversations or interactions before they occur." },
  { letter: "N", term: "Neurotransmitter Sensitivity", definition: "Research suggests introverts may be more sensitive to dopamine than extroverts, contributing to their preference for less stimulating environments." },
  { letter: "N", term: "Non-Reactivity", definition: "The introvert's tendency to observe and process before responding, sometimes misinterpreted as aloofness or disinterest." },
  { letter: "O", term: "Observational Learning", definition: "The introvert preference for learning through watching and analyzing rather than through immediate participation." },
  { letter: "O", term: "Overstimulation", definition: "The state of mental and physical discomfort introverts experience when exposed to excessive social or sensory input beyond their processing capacity." },
  { letter: "P", term: "Parasympathetic Response", definition: "The \"rest and digest\" nervous system activation that introverts may access more readily during quiet, solitary activities." },
  { letter: "P", term: "Persona", definition: "In Jungian psychology, the social mask adopted in public; introverts often develop a more extroverted persona for professional or social necessity." },
  { letter: "P", term: "Processing Gap", definition: "The time introverts need between receiving information and formulating a response, often longer than that required by extroverts." },
  { letter: "Q", term: "Quiet Leadership", definition: "Leadership style characterized by thoughtful decision-making, deep listening, and considered action rather than charismatic or commanding presence; often employed effectively by introverts." },
  { letter: "Q", term: "Quiet Zone", definition: "A physical space with minimal distraction or interruption where introverts can work, think, or recharge effectively." },
  { letter: "R", term: "Reflective Thinking", definition: "The process of deeply considering information, experiences, or ideas, which introverts naturally engage in and prefer over immediate action." },
  { letter: "R", term: "Recharge Activity", definition: "Any solitary or low-stimulation activity that helps introverts restore mental energy after social interaction." },
  { letter: "R", term: "Reciprocity Pressure", definition: "The social expectation to match others' level of enthusiasm, disclosure, or interaction style, which can be energy-depleting for introverts." },
  { letter: "S", term: "Selective Socialization", definition: "The introvert strategy of carefully choosing social engagements based on value, meaning, and energy requirements." },
  { letter: "S", term: "Social Battery", definition: "A conceptual measure of an introvert's available mental energy for social interaction before requiring recharge time." },
  { letter: "S", term: "Social Hangover", definition: "See \"Introvert Hangover\" - the period of exhaustion following social events." },
  { letter: "S", term: "Social Introversion", definition: "Preference for solitude and small groups based on genuine enjoyment of quiet rather than social anxiety or fear." },
  { letter: "S", term: "Solitude", definition: "Time spent alone by choice, essential for introvert well-being and distinct from isolation or loneliness." },
  { letter: "S", term: "Stimulation Threshold", definition: "The point at which environmental or social input becomes overwhelming for an individual; typically lower in introverts than extroverts." },
  { letter: "T", term: "Task-Oriented Socializing", definition: "Interaction centered around activities or objectives that many introverts find less draining than open-ended socializing." },
  { letter: "T", term: "Thinking Introversion", definition: "A subtype of introversion characterized by introspection, self-reflection, and rich inner thought life, not necessarily coupled with social avoidance." },
  { letter: "T", term: "Transition Time", definition: "The period introverts need to mentally shift between activities or environments, particularly when moving from solitude to social settings." },
  { letter: "U", term: "Under-Stimulation", definition: "A state where even introverts may feel restless or bored due to insufficient meaningful mental engagement." },
  { letter: "V", term: "Verbal Economy", definition: "The introvert tendency to speak concisely and purposefully, using fewer words to express complete thoughts." },
  { letter: "V", term: "Vigilance", definition: "Heightened awareness of environmental and social cues, often experienced by introverts in group settings, which can contribute to faster mental fatigue." },
  { letter: "W", term: "Withdrawal Need", definition: "The internal signal indicating an introvert requires solitude to rebalance their mental energy, distinct from avoidance behavior." },
  { letter: "W", term: "Written Processing", definition: "The introvert preference for organizing thoughts through writing rather than talking, allowing for more thorough expression." }
];

const IntrovertGlossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get unique letters for jump links
  const uniqueLetters = Array.from(new Set(glossaryData.map(item => item.letter))).sort();
  
  // Filter glossary terms based on search
  const filteredTerms = glossaryData.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group terms by letter
  const groupedTerms = filteredTerms.reduce<Record<string, GlossaryTerm[]>>((acc, term) => {
    const letter = term.letter;
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(term);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search glossary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Alphabet navigation */}
      <div className="flex flex-wrap gap-1 justify-center text-xs font-medium">
        {uniqueLetters.map(letter => (
          <a 
            key={letter} 
            href={`#letter-${letter}`}
            className={cn(
              "px-1.5 py-0.5 rounded hover:bg-accent transition-colors",
              !Object.keys(groupedTerms).includes(letter) && "opacity-40 pointer-events-none"
            )}
          >
            {letter}
          </a>
        ))}
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          {Object.entries(groupedTerms).sort(([a], [b]) => a.localeCompare(b)).map(([letter, terms]) => (
            <div key={letter} id={`letter-${letter}`}>
              <h3 className="text-xl font-bold mb-2 sticky top-0 bg-background py-1">{letter}</h3>
              <div className="space-y-3">
                {terms.map((term, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="font-medium">{term.term}</h4>
                    <p className="text-sm text-muted-foreground">{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {filteredTerms.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No terms match your search.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default IntrovertGlossary;
