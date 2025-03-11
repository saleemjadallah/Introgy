import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  DeepQuestion, 
  MessageTemplate, 
  ConnectionRitual,
  SharedExperience,
  MeaningfulInteractionFilters,
  MessageVariable
} from '@/types/meaningful-interactions';
import { 
  mockDeepQuestions, 
  mockMessageTemplates, 
  mockConnectionRituals, 
  mockSharedExperiences 
} from '@/data/meaningfulInteractionsData';
import { useToast } from '@/hooks/use-toast';

export interface UseMeaningfulInteractionsProps {
  initialQuestions?: DeepQuestion[];
  initialTemplates?: MessageTemplate[];
  initialRituals?: ConnectionRitual[];
  initialExperiences?: SharedExperience[];
}

export function useMeaningfulInteractions({
  initialQuestions = mockDeepQuestions,
  initialTemplates = mockMessageTemplates,
  initialRituals = mockConnectionRituals,
  initialExperiences = mockSharedExperiences
}: UseMeaningfulInteractionsProps = {}) {
  // State for each interaction type
  const [questions, setQuestions] = useState<DeepQuestion[]>(initialQuestions);
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(initialTemplates);
  const [rituals, setRituals] = useState<ConnectionRitual[]>(initialRituals);
  const [experiences, setExperiences] = useState<SharedExperience[]>(initialExperiences);
  
  // State for filters
  const [questionFilters, setQuestionFilters] = useState<MeaningfulInteractionFilters>({});
  const [templateFilters, setTemplateFilters] = useState<MeaningfulInteractionFilters>({});
  const [ritualFilters, setRitualFilters] = useState<MeaningfulInteractionFilters>({});
  const [experienceFilters, setExperienceFilters] = useState<MeaningfulInteractionFilters>({});
  
  // State for custom content
  const [savedQuestions, setSavedQuestions] = useState<DeepQuestion[]>([]);
  const [customTemplates, setCustomTemplates] = useState<MessageTemplate[]>([]);
  const [activeRituals, setActiveRituals] = useState<ConnectionRitual[]>([]);
  const [sharedExperiences, setSharedExperiences] = useState<SharedExperience[]>([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const savedQuestionsData = localStorage.getItem('savedQuestions');
      if (savedQuestionsData) {
        setSavedQuestions(JSON.parse(savedQuestionsData));
      }
      
      const customTemplatesData = localStorage.getItem('customTemplates');
      if (customTemplatesData) {
        setCustomTemplates(JSON.parse(customTemplatesData));
      }
      
      const activeRitualsData = localStorage.getItem('activeRituals');
      if (activeRitualsData) {
        setActiveRituals(JSON.parse(activeRitualsData));
      }
      
      const sharedExperiencesData = localStorage.getItem('sharedExperiences');
      if (sharedExperiencesData) {
        setSharedExperiences(JSON.parse(sharedExperiencesData));
      }
    } catch (error) {
      console.error('Error loading saved interaction data:', error);
    }
  }, []);

  // Save to localStorage when state changes
  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  // Save changes to localStorage
  useEffect(() => {
    saveToLocalStorage('savedQuestions', savedQuestions);
  }, [savedQuestions]);
  
  useEffect(() => {
    saveToLocalStorage('customTemplates', customTemplates);
  }, [customTemplates]);
  
  useEffect(() => {
    saveToLocalStorage('activeRituals', activeRituals);
  }, [activeRituals]);
  
  useEffect(() => {
    saveToLocalStorage('sharedExperiences', sharedExperiences);
  }, [sharedExperiences]);

  // Filtered questions based on current filters
  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      const { categories, depthLevels, relationshipTypes, energyLevels, topics, searchTerm } = questionFilters;
      
      if (categories && categories.length > 0 && !categories.includes(question.category)) {
        return false;
      }
      
      if (depthLevels && depthLevels.length > 0 && !depthLevels.includes(question.depthLevel)) {
        return false;
      }
      
      if (relationshipTypes && relationshipTypes.length > 0 && 
          !relationshipTypes.some(type => question.relationshipTypes.includes(type))) {
        return false;
      }
      
      if (energyLevels && energyLevels.length > 0 && 
          !energyLevels.includes(question.energyRequired)) {
        return false;
      }
      
      if (topics && topics.length > 0 && 
          !topics.some(topic => question.topics.includes(topic))) {
        return false;
      }
      
      if (searchTerm && searchTerm.trim() !== '') {
        const search = searchTerm.toLowerCase();
        return question.text.toLowerCase().includes(search) || 
               question.category.toLowerCase().includes(search) ||
               question.topics.some(topic => topic.toLowerCase().includes(search));
      }
      
      return true;
    });
  }, [questions, questionFilters]);

  // Filtered message templates
  const filteredTemplates = useMemo(() => {
    return messageTemplates.filter(template => {
      const { categories, relationshipTypes, energyLevels, searchTerm } = templateFilters;
      
      if (categories && categories.length > 0 && !categories.includes(template.purpose)) {
        return false;
      }
      
      if (relationshipTypes && relationshipTypes.length > 0 && 
          !relationshipTypes.includes(template.relationshipStage)) {
        return false;
      }
      
      if (energyLevels && energyLevels.length > 0 && 
          !energyLevels.includes(template.energyRequired)) {
        return false;
      }
      
      if (searchTerm && searchTerm.trim() !== '') {
        const search = searchTerm.toLowerCase();
        return template.baseTemplate.toLowerCase().includes(search) || 
               template.purpose.toLowerCase().includes(search) ||
               template.tone.toLowerCase().includes(search);
      }
      
      return true;
    });
  }, [messageTemplates, templateFilters]);

  // Filtered rituals
  const filteredRituals = useMemo(() => {
    return rituals.filter(ritual => {
      const { categories, relationshipTypes, energyLevels, searchTerm } = ritualFilters;
      
      if (categories && categories.length > 0 && !categories.includes(ritual.interactionType)) {
        return false;
      }
      
      if (relationshipTypes && relationshipTypes.length > 0 && 
          !relationshipTypes.some(type => ritual.relationshipTypes.includes(type))) {
        return false;
      }
      
      if (energyLevels && energyLevels.length > 0 && 
          !energyLevels.includes(ritual.energyCost)) {
        return false;
      }
      
      if (searchTerm && searchTerm.trim() !== '') {
        const search = searchTerm.toLowerCase();
        return ritual.name.toLowerCase().includes(search) || 
               ritual.description.toLowerCase().includes(search);
      }
      
      return true;
    });
  }, [rituals, ritualFilters]);

  // Filtered experiences
  const filteredExperiences = useMemo(() => {
    return experiences.filter(experience => {
      const { categories, relationshipTypes, energyLevels, topics, searchTerm } = experienceFilters;
      
      if (categories && categories.length > 0 && !categories.includes(experience.category)) {
        return false;
      }
      
      if (relationshipTypes && relationshipTypes.length > 0 && 
          !relationshipTypes.some(type => experience.relationshipTypes.includes(type))) {
        return false;
      }
      
      if (energyLevels && energyLevels.length > 0 && 
          !energyLevels.includes(experience.energyRequired)) {
        return false;
      }
      
      if (topics && topics.length > 0 && 
          !topics.some(topic => experience.interestTags.includes(topic))) {
        return false;
      }
      
      if (searchTerm && searchTerm.trim() !== '') {
        const search = searchTerm.toLowerCase();
        return experience.title.toLowerCase().includes(search) || 
               experience.description.toLowerCase().includes(search) ||
               experience.interestTags.some(tag => tag.toLowerCase().includes(search));
      }
      
      return true;
    });
  }, [experiences, experienceFilters]);

  // Function to generate personalized questions
  const generatePersonalizedQuestions = (
    relationshipType: string, 
    topicPreferences: string[] = [], 
    depthLevel: number = 2,
    count: number = 3
  ): DeepQuestion[] => {
    setIsLoading(true);
    
    try {
      // Filter questions by relationship type and depth level
      const compatibleQuestions = questions.filter(q => 
        q.relationshipTypes.includes(relationshipType) && 
        q.depthLevel <= depthLevel
      );
      
      // If topic preferences are provided, prioritize those
      let scored = compatibleQuestions.map(q => {
        let score = 0;
        
        // Score based on topic matching
        if (topicPreferences.length > 0) {
          score += q.topics.filter(t => topicPreferences.includes(t)).length * 3;
        }
        
        // Score based on depth level match
        score += (3 - Math.abs(depthLevel - q.depthLevel)) * 2;
        
        // Small random factor to add variety
        score += Math.random();
        
        return { ...q, score };
      });
      
      // Sort by score and take top 'count'
      const results = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .map(({ score, ...q }) => q); // Remove the score property
      
      setIsLoading(false);
      
      // Simulate AI generation delay
      setTimeout(() => {
        toast({
          title: "Questions Generated",
          description: `Generated ${results.length} personalized questions based on your preferences.`,
        });
      }, 500);
      
      return results;
    } catch (error) {
      console.error('Error generating personalized questions:', error);
      setIsLoading(false);
      
      toast({
        title: "Generation Failed",
        description: "There was an error generating personalized questions.",
        variant: "destructive",
      });
      
      return [];
    }
  };

  // Function to save a question
  const saveQuestion = (question: DeepQuestion) => {
    if (savedQuestions.some(q => q.id === question.id)) {
      toast({
        description: "This question is already saved.",
      });
      return;
    }
    
    setSavedQuestions([...savedQuestions, question]);
    
    toast({
      description: "Question saved to your collection.",
    });
  };

  // Function to fill template variables
  const fillMessageTemplate = (
    template: MessageTemplate, 
    variables: Record<string, string>
  ): string => {
    let filledTemplate = template.baseTemplate;
    
    for (const [key, value] of Object.entries(variables)) {
      filledTemplate = filledTemplate.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    return filledTemplate;
  };

  // Function to create a custom message template
  const createCustomTemplate = (template: Omit<MessageTemplate, 'id'>) => {
    const newTemplate = {
      ...template,
      id: uuidv4()
    };
    
    setCustomTemplates([...customTemplates, newTemplate]);
    
    toast({
      description: "Message template created and saved.",
    });
    
    return newTemplate;
  };

  // Function to adopt a ritual
  const adoptRitual = (ritual: ConnectionRitual) => {
    if (activeRituals.some(r => r.id === ritual.id)) {
      toast({
        description: "This ritual is already active.",
      });
      return;
    }
    
    setActiveRituals([...activeRituals, ritual]);
    
    toast({
      description: "Ritual added to your active rituals.",
    });
  };

  // Function to track ritual completion
  const trackRitualCompletion = (ritualId: string, notes: string = '') => {
    // In a real implementation, this would interact with a backend to track history
    toast({
      title: "Ritual Completed",
      description: "Your ritual activity has been recorded.",
    });
  };

  // Function to save a shared experience
  const saveSharedExperience = (experience: SharedExperience) => {
    if (sharedExperiences.some(e => e.id === experience.id)) {
      toast({
        description: "This experience is already saved.",
      });
      return;
    }
    
    setSharedExperiences([...sharedExperiences, experience]);
    
    toast({
      description: "Experience saved to your collection.",
    });
  };

  // Function to get experience recommendations
  const getExperienceRecommendations = (
    relationshipType: string,
    energyAvailable: number = 3,
    timeAvailable: number = 60,
    count: number = 3
  ): SharedExperience[] => {
    setIsLoading(true);
    
    try {
      // Filter experiences by relationship type, energy, and time
      const compatibleExperiences = experiences.filter(e => 
        e.relationshipTypes.includes(relationshipType) && 
        e.energyRequired <= energyAvailable &&
        e.timeRequired <= timeAvailable
      );
      
      // Add a random score for variety
      const shuffled = compatibleExperiences
        .map(e => ({ ...e, score: Math.random() }))
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .map(({ score, ...e }) => e); // Remove the score property
      
      setIsLoading(false);
      
      return shuffled;
    } catch (error) {
      console.error('Error getting experience recommendations:', error);
      setIsLoading(false);
      return [];
    }
  };

  return {
    // Data
    questions: filteredQuestions,
    messageTemplates: filteredTemplates,
    rituals: filteredRituals,
    experiences: filteredExperiences,
    savedQuestions,
    customTemplates,
    activeRituals,
    sharedExperiences,
    
    // Filters
    questionFilters,
    setQuestionFilters,
    templateFilters,
    setTemplateFilters,
    ritualFilters,
    setRitualFilters,
    experienceFilters,
    setExperienceFilters,
    
    // Functions
    generatePersonalizedQuestions,
    saveQuestion,
    fillMessageTemplate,
    createCustomTemplate,
    adoptRitual,
    trackRitualCompletion,
    saveSharedExperience,
    getExperienceRecommendations,
    
    // State
    isLoading
  };
}