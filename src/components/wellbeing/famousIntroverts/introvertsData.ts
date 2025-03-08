
export interface FamousIntrovert {
  id: number;
  name: string;
  profession: string;
  imageUrl: string;
  introvertTraits: string;
  contributions: string;
  howIntroversionHelped: string;
  quote?: string;
  learnMoreUrl?: string;
}

export const famousIntrovertsData: FamousIntrovert[] = [
  {
    id: 1,
    name: "Albert Einstein",
    profession: "Theoretical Physicist",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    introvertTraits: "Deep thinker, enjoyed solitude, preferred small gatherings to large ones, often seen as absent-minded due to internal focus",
    contributions: "Theory of Relativity, Photoelectric effect, Mass-energy equivalence (E=mc²), significant contributions to quantum mechanics",
    howIntroversionHelped: "Einstein's love of solitude gave him space for deep contemplation. He once said, 'The monotony and solitude of a quiet life stimulates the creative mind.' His ability to focus deeply on complex problems without distraction was key to his breakthroughs.",
    quote: "The monotony and solitude of a quiet life stimulates the creative mind.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Albert_Einstein"
  },
  {
    id: 2,
    name: "Rosa Parks",
    profession: "Civil Rights Activist",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    introvertTraits: "Quiet determination, thoughtful, reflective, preferred to listen before speaking",
    contributions: "Catalyst for the Montgomery Bus Boycott and a symbol of the Civil Rights Movement by refusing to give up her bus seat in segregated Alabama",
    howIntroversionHelped: "Parks' quiet strength and moral clarity came partly from her introspective nature. Her action was not impulsive but rooted in deep conviction developed through reflection. As she said, 'I have learned over the years that when one's mind is made up, this diminishes fear.'",
    quote: "I would like to be remembered as a person who wanted to be free... so other people would also be free.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Rosa_Parks"
  },
  {
    id: 3,
    name: "Bill Gates",
    profession: "Microsoft Co-founder & Philanthropist",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    introvertTraits: "Analytical, contemplative, prefers reading to socializing, takes regular 'think weeks' in isolation",
    contributions: "Co-founded Microsoft, revolutionized personal computing, became a leading global philanthropist through the Bill & Melinda Gates Foundation",
    howIntroversionHelped: "Gates' preference for deep work and focused analysis allowed him to master complex technical problems. His 'think weeks,' where he isolates himself to read and contemplate, have been crucial for strategic thinking and innovation.",
    quote: "I think introverts can do quite well. If you're clever you can learn to get the benefits of being an introvert.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Bill_Gates"
  },
  {
    id: 4,
    name: "J.K. Rowling",
    profession: "Author",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    introvertTraits: "Imaginative, introspective, value-driven, comfortable with solitude",
    contributions: "Created the Harry Potter series, which revitalized children's literature and became one of the best-selling book series in history",
    howIntroversionHelped: "Rowling's rich inner world and comfort with solitude were essential to creating the elaborate wizarding world. She famously conceptualized Harry Potter during a delayed train journey, content in her own thoughts rather than seeking conversation.",
    quote: "I think that I've always been attracted to characters who are positive and come from a very negative situation and try to find their way out of it.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/J._K._Rowling"
  },
  {
    id: 5,
    name: "Barack Obama",
    profession: "Former U.S. President",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    introvertTraits: "Reflective, thoughtful, deliberate, processes internally before speaking",
    contributions: "First African American U.S. President, healthcare reform, climate change initiatives, restored diplomatic relations with Cuba",
    howIntroversionHelped: "Obama's measured, thoughtful approach was a product of his introspective nature. His ability to listen deeply and consider multiple perspectives before making decisions helped him navigate complex political challenges.",
    quote: "Reading is the gateway skill that makes all other learning possible.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Barack_Obama"
  }
];
