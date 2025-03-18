
export interface FamousIntrovert {
  id: number;
  name: string;
  profession: string;
  category: string;
  imageUrl: string;
  introvertTraits: string;
  contributions: string;
  howIntroversionHelped: string;
  quote?: string;
  learnMoreUrl?: string;
}

export const famousIntrovertsData: FamousIntrovert[] = [
  // Science & Innovation
  {
    id: 1,
    name: "Albert Einstein",
    profession: "Theoretical Physicist",
    category: "Science & Innovation",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    introvertTraits: "Deep thinker, enjoyed solitude, preferred small gatherings to large ones, often seen as absent-minded due to internal focus",
    contributions: "Theory of Relativity, Photoelectric effect, Mass-energy equivalence (E=mc²), significant contributions to quantum mechanics",
    howIntroversionHelped: "Einstein's love of solitude gave him space for deep contemplation. He once said, 'The monotony and solitude of a quiet life stimulates the creative mind.' His ability to focus deeply on complex problems without distraction was key to his breakthroughs.",
    quote: "The monotony and solitude of a quiet life stimulates the creative mind.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Albert_Einstein"
  },
  {
    id: 2,
    name: "Marie Curie",
    profession: "Physicist and Chemist",
    category: "Science & Innovation",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
    introvertTraits: "Reserved, focused, persistent, preferred working in her laboratory to social events",
    contributions: "Discovered the elements polonium and radium, developed theory of radioactivity, pioneered research on radiation, first woman to win a Nobel Prize and only person to win in multiple scientific fields",
    howIntroversionHelped: "Curie's intense focus and ability to work independently for long hours in solitude enabled her groundbreaking research. Her introspective nature helped her persist despite significant challenges and skepticism from the scientific community.",
    quote: "One never notices what has been done; one can only see what remains to be done.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Marie_Curie"
  },
  {
    id: 3,
    name: "Isaac Newton",
    profession: "Mathematician and Physicist",
    category: "Science & Innovation",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    introvertTraits: "Solitary, intensely focused, preferred independent work, often isolated himself for long periods",
    contributions: "Laws of motion and universal gravitation, development of calculus, foundational work in optics, construction of the first reflecting telescope",
    howIntroversionHelped: "Newton's breakthrough discoveries occurred during a period of isolation (when Cambridge University closed due to plague). His preference for working alone allowed him uninterrupted time to develop revolutionary scientific theories.",
    quote: "If I have seen further it is by standing on the shoulders of giants.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Isaac_Newton"
  },
  {
    id: 4,
    name: "Jane Goodall",
    profession: "Primatologist and Anthropologist",
    category: "Science & Innovation",
    imageUrl: "https://images.unsplash.com/photo-1507477338202-487281e6c27e",
    introvertTraits: "Patient observer, comfortable with solitude, profound connection with nature, thoughtful communicator",
    contributions: "Revolutionary studies of chimpanzees in the wild, discovery of tool use among chimps, advocacy for conservation and animal welfare",
    howIntroversionHelped: "Goodall's capacity for patient observation and comfort with solitude were essential for her groundbreaking work with chimpanzees. Her introspective nature allowed her to notice subtle behaviors that others might have missed.",
    quote: "What you do makes a difference, and you have to decide what kind of difference you want to make.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Jane_Goodall"
  },
  
  // Arts & Literature
  {
    id: 5,
    name: "J.K. Rowling",
    profession: "Author",
    category: "Arts & Literature",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    introvertTraits: "Imaginative, introspective, value-driven, comfortable with solitude",
    contributions: "Created the Harry Potter series, which revitalized children's literature and became one of the best-selling book series in history",
    howIntroversionHelped: "Rowling's rich inner world and comfort with solitude were essential to creating the elaborate wizarding world. She famously conceptualized Harry Potter during a delayed train journey, content in her own thoughts rather than seeking conversation.",
    quote: "I think that I've always been attracted to characters who are positive and come from a very negative situation and try to find their way out of it.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/J._K._Rowling"
  },
  {
    id: 6,
    name: "Vincent van Gogh",
    profession: "Painter",
    category: "Arts & Literature",
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262",
    introvertTraits: "Intensely introspective, emotional depth, preferred solitude, struggled with social interactions",
    contributions: "Created over 2,000 artworks including 'Starry Night' and 'Sunflowers', pioneered expressive brushwork and vibrant color use that influenced 20th-century art",
    howIntroversionHelped: "Van Gogh's introspection and profound emotional depth translated directly into his revolutionary artistic style. His solitude allowed him to develop a unique visual language that expressed his inner world.",
    quote: "I put my heart and soul into my work, and I have lost my mind in the process.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Vincent_van_Gogh"
  },
  {
    id: 7,
    name: "Emily Dickinson",
    profession: "Poet",
    category: "Arts & Literature",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    introvertTraits: "Reclusive, contemplative, inner-focused, rarely left her home in later years",
    contributions: "Wrote nearly 1,800 poems exploring themes of death, immortality, and nature; revolutionized American poetry with unique style, punctuation, and imagery",
    howIntroversionHelped: "Dickinson's reclusive lifestyle allowed her to develop a deeply original poetic voice. Her rich inner life and intense observations of the small details of existence informed her revolutionary work.",
    quote: "The soul should always stand ajar, ready to welcome the ecstatic experience.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Emily_Dickinson"
  },
  {
    id: 8,
    name: "Meryl Streep",
    profession: "Actress",
    category: "Arts & Literature",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728",
    introvertTraits: "Thoughtful, observant, private about personal life, prefers depth in character study to public attention",
    contributions: "Record-holding actress with 21 Academy Award nominations and 3 wins, known for transformative performances across genres and unmatched versatility",
    howIntroversionHelped: "Streep's introspective nature allows her to deeply inhabit characters. Her careful observation of human behavior and preference for privacy have contributed to her remarkable ability to transform completely for each role.",
    quote: "The great gift of human beings is that we have the power of empathy.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Meryl_Streep"
  },
  
  // Business & Entrepreneurship
  {
    id: 9,
    name: "Bill Gates",
    profession: "Microsoft Co-founder & Philanthropist",
    category: "Business & Entrepreneurship",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    introvertTraits: "Analytical, contemplative, prefers reading to socializing, takes regular 'think weeks' in isolation",
    contributions: "Co-founded Microsoft, revolutionized personal computing, became a leading global philanthropist through the Bill & Melinda Gates Foundation",
    howIntroversionHelped: "Gates' preference for deep work and focused analysis allowed him to master complex technical problems. His 'think weeks,' where he isolates himself to read and contemplate, have been crucial for strategic thinking and innovation.",
    quote: "I think introverts can do quite well. If you're clever you can learn to get the benefits of being an introvert.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Bill_Gates"
  },
  {
    id: 10,
    name: "Warren Buffett",
    profession: "Investor & Business Magnate",
    category: "Business & Entrepreneurship",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
    introvertTraits: "Reflective, disciplined, avoids unnecessary social engagements, spends hours reading and analyzing",
    contributions: "Built Berkshire Hathaway into one of the largest companies in the world, pioneered value investing strategies, committed to giving away 99% of his wealth",
    howIntroversionHelped: "Buffett's introspective nature and resistance to social pressures helped him avoid market bubbles and make contrarian investment decisions. His preference for deep reading and analysis has been fundamental to his success.",
    quote: "I insist on a lot of time being spent, almost every day, to just sit and think.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Warren_Buffett"
  },
  {
    id: 11,
    name: "Mark Zuckerberg",
    profession: "Facebook Founder & CEO",
    category: "Business & Entrepreneurship",
    imageUrl: "https://images.unsplash.com/photo-1633675254053-d96c7668c3b8",
    introvertTraits: "Reserved in public, prefers small groups, focuses deeply on technical problems, systematic thinker",
    contributions: "Created Facebook, built Meta into a tech giant, pioneered social media platforms that connect billions of people worldwide",
    howIntroversionHelped: "Zuckerberg's introspective nature and technical focus allowed him to envision and build systems that would change how people connect. His comfort with working intensely for long periods was essential during Facebook's early development.",
    quote: "The biggest risk is not taking any risk.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Mark_Zuckerberg"
  },
  {
    id: 12,
    name: "Elon Musk",
    profession: "Entrepreneur & Innovator",
    category: "Business & Entrepreneurship",
    imageUrl: "https://images.unsplash.com/photo-1562114808-b4b33b704489",
    introvertTraits: "Deep thinker, physics-based reasoning, sometimes awkward in social settings, highly focused on complex problems",
    contributions: "Founded multiple revolutionary companies including Tesla, SpaceX, and Neuralink; pushing boundaries in electric vehicles, space exploration, and brain-computer interfaces",
    howIntroversionHelped: "Musk's ability to focus intensely on complex technical problems and think from first principles has driven his companies' innovations. His willingness to pursue ideas regardless of social consensus has led to breakthroughs.",
    quote: "I think it's very important to have a feedback loop, where you're constantly thinking about what you've done and how you could be doing it better.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Elon_Musk"
  },
  
  // Leadership & Politics
  {
    id: 13,
    name: "Abraham Lincoln",
    profession: "16th U.S. President",
    category: "Leadership & Politics",
    imageUrl: "https://images.unsplash.com/photo-1589262804704-c5aa9e6def89",
    introvertTraits: "Contemplative, often melancholic, enjoyed solitary reading and writing, preferred deep conversations to small talk",
    contributions: "Led the United States through the Civil War, abolished slavery with the Emancipation Proclamation, preserved the Union, delivered the Gettysburg Address",
    howIntroversionHelped: "Lincoln's thoughtful nature and reflective temperament helped him navigate the profound moral and political complexities of his era. His love of reading and writing shaped his remarkable eloquence and wisdom.",
    quote: "Better to remain silent and be thought a fool than to speak out and remove all doubt.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Abraham_Lincoln"
  },
  {
    id: 14,
    name: "Barack Obama",
    profession: "44th U.S. President",
    category: "Leadership & Politics",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    introvertTraits: "Reflective, thoughtful, deliberate, processes internally before speaking",
    contributions: "First African American U.S. President, healthcare reform, climate change initiatives, restored diplomatic relations with Cuba",
    howIntroversionHelped: "Obama's measured, thoughtful approach was a product of his introspective nature. His ability to listen deeply and consider multiple perspectives before making decisions helped him navigate complex political challenges.",
    quote: "Reading is the gateway skill that makes all other learning possible.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Barack_Obama"
  },
  {
    id: 15,
    name: "Angela Merkel",
    profession: "Former German Chancellor",
    category: "Leadership & Politics",
    imageUrl: "https://images.unsplash.com/photo-1568490748007-771c2f52256d",
    introvertTraits: "Reserved, analytical, prefers listening to speaking, avoids unnecessary publicity, calm under pressure",
    contributions: "First female Chancellor of Germany, led through European financial crises and refugee challenges, championed environmental policies, defined EU leadership for 16 years",
    howIntroversionHelped: "Merkel's reserved demeanor and analytical approach earned her the nickname 'the scientist.' Her tendency to listen carefully and deliberate thoroughly contributed to her reputation for steady, rational leadership in crises.",
    quote: "I've often been asked what would be my wish if the fairy godmother had something to give me. I'd say 'prudence.'",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Angela_Merkel"
  },
  {
    id: 16,
    name: "Rosa Parks",
    profession: "Civil Rights Activist",
    category: "Leadership & Politics",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    introvertTraits: "Quiet determination, thoughtful, reflective, preferred to listen before speaking",
    contributions: "Catalyst for the Montgomery Bus Boycott and a symbol of the Civil Rights Movement by refusing to give up her bus seat in segregated Alabama",
    howIntroversionHelped: "Parks' quiet strength and moral clarity came partly from her introspective nature. Her action was not impulsive but rooted in deep conviction developed through reflection. As she said, 'I have learned over the years that when one's mind is made up, this diminishes fear.'",
    quote: "I would like to be remembered as a person who wanted to be free... so other people would also be free.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Rosa_Parks"
  },
  
  // Entertainment & Media
  {
    id: 17,
    name: "Lady Gaga",
    profession: "Singer & Actress",
    category: "Entertainment & Media",
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad",
    introvertTraits: "Self-described introvert despite her extravagant stage persona, reflective, experiences social anxiety, needs alone time to recharge",
    contributions: "Multiple Grammy and Academy Award-winning artist, known for musical innovation and advocacy for LGBTQ+ rights and mental health awareness",
    howIntroversionHelped: "Gaga's introspection fuels her creative process and artistic depth. The contrast between her quiet personal nature and bold stage persona demonstrates how introverts can channel their energy strategically.",
    quote: "I'm not a recluse. I'm just living my life. I don't go to nightclubs... I'm quite introspective.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Lady_Gaga"
  },
  {
    id: 18,
    name: "Keanu Reeves",
    profession: "Actor",
    category: "Entertainment & Media",
    imageUrl: "https://images.unsplash.com/photo-1542887800-faca0261c9e1",
    introvertTraits: "Thoughtful, private, listens more than speaks, avoids spotlight despite fame, known for kindness and depth",
    contributions: "Starred in numerous influential films including The Matrix and John Wick franchises, known for dedication to craft and charitable giving",
    howIntroversionHelped: "Reeves' introspective nature contributes to his authentic screen presence and ability to convey deep emotion with restraint. His preference for privacy has helped him maintain balance despite massive fame.",
    quote: "The simple act of paying attention can take you a long way.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Keanu_Reeves"
  },
  {
    id: 19,
    name: "Emma Watson",
    profession: "Actress & Activist",
    category: "Entertainment & Media",
    imageUrl: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f",
    introvertTraits: "Self-described introvert, thoughtful, values privacy, enjoys solitary activities like reading",
    contributions: "Rose to fame as Hermione in Harry Potter series, UN Women Goodwill Ambassador, founder of HeForShe campaign promoting gender equality",
    howIntroversionHelped: "Watson's reflective nature informs her thoughtful activism and career choices. Her love of reading and learning has shaped her advocacy and public voice.",
    quote: "I'm a quiet person, and I live a quiet, nice life. My capacity for being social is limited and I need a lot of alone time.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Emma_Watson"
  },
  {
    id: 20,
    name: "Steven Spielberg",
    profession: "Film Director & Producer",
    category: "Entertainment & Media",
    imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1",
    introvertTraits: "Imaginative, often shy as a child, observant, processes experiences deeply, creates from rich inner world",
    contributions: "Pioneering filmmaker behind movies like E.T., Jurassic Park, Schindler's List, and Saving Private Ryan; transformed modern cinema",
    howIntroversionHelped: "Spielberg's introspective nature and rich imagination have been central to his storytelling abilities. His childhood experiences of feeling like an outsider informed many of his films about extraordinary connections and wonder.",
    quote: "I dream for a living.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Steven_Spielberg"
  },
  
  // Sports & Athletics
  {
    id: 21,
    name: "Michael Jordan",
    profession: "Basketball Legend",
    category: "Sports & Athletics",
    imageUrl: "https://images.unsplash.com/photo-1628087236657-3ee24c5f9e54",
    introvertTraits: "Intensely competitive but privately reflective, preferred solitude before games, methodical in preparation",
    contributions: "Six-time NBA champion, five-time MVP, transformed basketball globally, built Air Jordan brand into a cultural phenomenon",
    howIntroversionHelped: "Jordan's introspective intensity and ability to focus deeply contributed to his legendary competitive drive. His preference for mental preparation and visualization before games was key to his performance.",
    quote: "I've always believed that if you put in the work, the results will come.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Michael_Jordan"
  },
  {
    id: 22,
    name: "Lionel Messi",
    profession: "Football (Soccer) Player",
    category: "Sports & Athletics",
    imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
    introvertTraits: "Quiet, reserved off the field, prefers family time to spotlight, lets his play speak for itself",
    contributions: "Multiple FIFA World Player of the Year awards, led Argentina to World Cup victory, record goal scorer, revolutionized modern football",
    howIntroversionHelped: "Messi's quiet focus and preference for letting his play speak for itself has helped him maintain consistent excellence. His ability to tune out distractions and focus on his craft contributed to his sustained success.",
    quote: "I'm more worried about being a good person than being the best football player in the world.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Lionel_Messi"
  },
  {
    id: 23,
    name: "Venus Williams",
    profession: "Tennis Champion",
    category: "Sports & Athletics",
    imageUrl: "https://images.unsplash.com/photo-1560012307-9b1cead262ad",
    introvertTraits: "Thoughtful, reserved off-court, analytical, internally motivated, values privacy",
    contributions: "Seven-time Grand Slam singles champion, four Olympic gold medals, former world No. 1, advocate for gender pay equality in tennis",
    howIntroversionHelped: "Williams' introspective nature and internal motivation have sustained her long career. Her quiet determination and focus have helped her overcome significant challenges both on and off the court.",
    quote: "I don't focus on what I'm up against. I focus on my goals and try to ignore the rest.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Venus_Williams"
  },
  {
    id: 24,
    name: "Roger Federer",
    profession: "Tennis Champion",
    category: "Sports & Athletics",
    imageUrl: "https://images.unsplash.com/photo-1595435742656-5210c1e75b3e",
    introvertTraits: "Calm demeanor, thoughtful in interviews, methodical in preparation, balances public persona with private life",
    contributions: "20 Grand Slam titles, longest-reigning world No. 1 in men's tennis, revolutionary playing style combining power and elegance",
    howIntroversionHelped: "Federer's composed temperament and analytical approach have been crucial to his longevity and success. His ability to process setbacks internally and maintain focus has distinguished his career.",
    quote: "There is no way around hard work. Embrace it.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Roger_Federer"
  },
  
  // Philosophy & Thought Leaders
  {
    id: 25,
    name: "Carl Jung",
    profession: "Psychiatrist & Psychoanalyst",
    category: "Philosophy & Thought Leaders",
    imageUrl: "https://images.unsplash.com/photo-1555861496-0666c8981751",
    introvertTraits: "Deeply introspective, coined the terms 'introvert' and 'extrovert', built a solitary tower for reflection",
    contributions: "Founded analytical psychology, developed concepts of the collective unconscious, archetypes, and psychological types",
    howIntroversionHelped: "Jung's profound capacity for introspection led to his revolutionary psychological insights. His comfort with exploring his own inner world allowed him to map the human psyche in new ways.",
    quote: "Your vision will become clear only when you can look into your own heart.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Carl_Jung"
  },
  {
    id: 26,
    name: "Mahatma Gandhi",
    profession: "Civil Rights Leader",
    category: "Philosophy & Thought Leaders",
    imageUrl: "https://images.unsplash.com/photo-1605446859583-62e882631677",
    introvertTraits: "Contemplative, practiced regular silent reflection, preferred writing to speaking, thoughtful communicator",
    contributions: "Led India to independence through nonviolent civil disobedience, inspired civil rights movements worldwide, pioneered modern peaceful resistance",
    howIntroversionHelped: "Gandhi's introspective nature and commitment to inner development were fundamental to his philosophy. His regular practice of silence and self-reflection informed his moral clarity and peaceful approach.",
    quote: "In a gentle way, you can shake the world.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Mahatma_Gandhi"
  },
  {
    id: 27,
    name: "Eleanor Roosevelt",
    profession: "Human Rights Champion & First Lady",
    category: "Philosophy & Thought Leaders",
    imageUrl: "https://images.unsplash.com/photo-1584892268773-82fd5ae3c33e",
    introvertTraits: "Naturally shy but developed public presence, reflective writer, preferred meaningful one-on-one connections",
    contributions: "Transformed the role of First Lady, chaired the UN Commission on Human Rights, helped draft the Universal Declaration of Human Rights",
    howIntroversionHelped: "Roosevelt's thoughtful nature and writing skills allowed her to articulate powerful ideas. Despite her natural shyness, she developed the courage to speak out on important issues through reflection and conviction.",
    quote: "You gain strength, courage, and confidence by every experience in which you really stop to look fear in the face.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Eleanor_Roosevelt"
  },
  {
    id: 28,
    name: "Susan Cain",
    profession: "Author & Introvert Advocate",
    category: "Philosophy & Thought Leaders",
    imageUrl: "https://images.unsplash.com/photo-1551651639-927b595f977c",
    introvertTraits: "Embraces her introversion, values depth over breadth in relationships, thoughtful communicator",
    contributions: "Author of bestselling book 'Quiet: The Power of Introverts in a World That Can't Stop Talking', TED talk with over 30 million views, founded Quiet Revolution",
    howIntroversionHelped: "Cain's personal experience as an introvert informed her groundbreaking work on introversion's value. Her thoughtful research and communication style have changed how society views personality differences.",
    quote: "There's zero correlation between being the best talker and having the best ideas.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Susan_Cain"
  },
  
  // Technology & Digital Creation
  {
    id: 29,
    name: "Steve Wozniak",
    profession: "Apple Co-founder & Engineer",
    category: "Technology & Digital Creation",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    introvertTraits: "Technical-minded, prefers working alone on engineering problems, values depth over socializing",
    contributions: "Co-founded Apple Computer, designed Apple I and Apple II computers, pioneered personal computing hardware",
    howIntroversionHelped: "Wozniak's preference for working alone and diving deep into technical problems was essential to his revolutionary hardware designs. His focus on engineering excellence rather than business spotlight complemented Jobs' vision.",
    quote: "Most inventors and engineers I've met are like me—they're shy and they live in their heads.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Steve_Wozniak"
  },
  {
    id: 30,
    name: "Larry Page",
    profession: "Google Co-founder",
    category: "Technology & Digital Creation",
    imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
    introvertTraits: "Reserved, analytical, prefers solving complex problems to public speaking",
    contributions: "Co-founded Google, developed PageRank algorithm, helped build one of the most influential technology companies in history",
    howIntroversionHelped: "Page's introspective, analytical approach was fundamental to developing Google's breakthrough search algorithms. His focus on long-term thinking over immediate social rewards has shaped Google's innovation culture.",
    quote: "If you're changing the world, you're working on important things. You're excited to get up in the morning.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Larry_Page"
  },
  {
    id: 31,
    name: "Marissa Mayer",
    profession: "Tech Executive & Engineer",
    category: "Technology & Digital Creation",
    imageUrl: "https://images.unsplash.com/photo-1505236714723-b2b5b01678d4",
    introvertTraits: "Analytical, detail-oriented, prefers data to social dynamics, works long hours alone",
    contributions: "Early Google executive who shaped its user experience, former Yahoo CEO, influential woman in tech leadership",
    howIntroversionHelped: "Mayer's capacity for intense focus and analytical thinking helped her excel in technical leadership. Her attention to detail and willingness to dive deep into data informed her product decisions at Google and Yahoo.",
    quote: "I always did something I was a little not ready to do. I think that's how you grow.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Marissa_Mayer"
  }
];

