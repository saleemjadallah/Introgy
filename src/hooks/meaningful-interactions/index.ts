
import { useState, useEffect } from 'react';
import { 
  mockDeepQuestions, 
  mockMessageTemplates, 
  mockConnectionRituals, 
  mockSharedExperiences 
} from '@/data/meaningfulInteractionsData';
import { useQuestions } from './useQuestions';
import { useTemplates } from './useTemplates';
import { useRituals } from './useRituals';
import { useExperiences } from './useExperiences';
import { useLocalStorage } from './useLocalStorage';
import { UseMeaningfulInteractionsProps } from './types';

export function useMeaningfulInteractions({
  initialQuestions = mockDeepQuestions,
  initialTemplates = mockMessageTemplates,
  initialRituals = mockConnectionRituals,
  initialExperiences = mockSharedExperiences
}: UseMeaningfulInteractionsProps = {}) {
  // Create hooks for each specific concern
  const questionsHook = useQuestions(initialQuestions);
  const templatesHook = useTemplates(initialTemplates);
  const ritualsHook = useRituals(initialRituals);
  const experiencesHook = useExperiences(initialExperiences);
  const { saveToLocalStorage } = useLocalStorage();
  
  // Composite state for loading
  const [isLoading, setIsLoading] = useState(false);

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const savedQuestionsData = localStorage.getItem('savedQuestions');
      if (savedQuestionsData) {
        questionsHook.setSavedQuestions(JSON.parse(savedQuestionsData));
      }
      
      const customTemplatesData = localStorage.getItem('customTemplates');
      if (customTemplatesData) {
        templatesHook.setCustomTemplates(JSON.parse(customTemplatesData));
      }
      
      const activeRitualsData = localStorage.getItem('activeRituals');
      if (activeRitualsData) {
        ritualsHook.setActiveRituals(JSON.parse(activeRitualsData));
      }
      
      const sharedExperiencesData = localStorage.getItem('sharedExperiences');
      if (sharedExperiencesData) {
        experiencesHook.setSharedExperiences(JSON.parse(sharedExperiencesData));
      }
    } catch (error) {
      console.error('Error loading saved interaction data:', error);
    }
  }, []);

  // Save changes to localStorage with debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      saveToLocalStorage('savedQuestions', questionsHook.savedQuestions);
    }, 300); // Debounce 300ms
    return () => clearTimeout(handler);
  }, [questionsHook.savedQuestions, saveToLocalStorage]);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      saveToLocalStorage('customTemplates', templatesHook.customTemplates);
    }, 300);
    return () => clearTimeout(handler);
  }, [templatesHook.customTemplates, saveToLocalStorage]);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      saveToLocalStorage('activeRituals', ritualsHook.activeRituals);
    }, 300);
    return () => clearTimeout(handler);
  }, [ritualsHook.activeRituals, saveToLocalStorage]);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      saveToLocalStorage('sharedExperiences', experiencesHook.sharedExperiences);
    }, 300);
    return () => clearTimeout(handler);
  }, [experiencesHook.sharedExperiences, saveToLocalStorage]);

  // Combine all the hooks into a single API
  return {
    // Questions
    questions: questionsHook.questions,
    questionFilters: questionsHook.questionFilters,
    setQuestionFilters: questionsHook.setQuestionFilters,
    savedQuestions: questionsHook.savedQuestions,
    saveQuestion: questionsHook.saveQuestion,
    generatePersonalizedQuestions: questionsHook.generatePersonalizedQuestions,
    
    // Templates
    messageTemplates: templatesHook.messageTemplates,
    templateFilters: templatesHook.templateFilters,
    setTemplateFilters: templatesHook.setTemplateFilters,
    customTemplates: templatesHook.customTemplates,
    fillMessageTemplate: templatesHook.fillMessageTemplate,
    createCustomTemplate: templatesHook.createCustomTemplate,
    
    // Rituals
    rituals: ritualsHook.rituals,
    ritualFilters: ritualsHook.ritualFilters,
    setRitualFilters: ritualsHook.setRitualFilters,
    activeRituals: ritualsHook.activeRituals,
    adoptRitual: ritualsHook.adoptRitual,
    trackRitualCompletion: ritualsHook.trackRitualCompletion,
    
    // Experiences
    experiences: experiencesHook.experiences,
    experienceFilters: experiencesHook.experienceFilters,
    setExperienceFilters: experiencesHook.setExperienceFilters,
    sharedExperiences: experiencesHook.sharedExperiences,
    saveSharedExperience: experiencesHook.saveSharedExperience,
    getExperienceRecommendations: experiencesHook.getExperienceRecommendations,
    
    // State
    isLoading: isLoading || experiencesHook.isLoading
  };
}

// Re-export all types 
export * from './types';
