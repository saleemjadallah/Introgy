
import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DeepQuestion } from '@/types/meaningful-interactions';
import { useToast } from '@/hooks/use-toast';
import { MeaningfulInteractionFilters } from './types';

export function useQuestions(initialQuestions: DeepQuestion[]) {
  const [questions, setQuestions] = useState<DeepQuestion[]>(() => initialQuestions);
  const [questionFilters, setQuestionFilters] = useState<MeaningfulInteractionFilters>({});
  const [savedQuestions, setSavedQuestions] = useState<DeepQuestion[]>([]);
  const { toast } = useToast();

  // Check if filters are empty
  const areFiltersEmpty = useMemo(() => {
    const { categories, depthLevels, relationshipTypes, energyLevels, topics, searchTerm } = questionFilters;
    return (
      (!categories || categories.length === 0) &&
      (!depthLevels || depthLevels.length === 0) &&
      (!relationshipTypes || relationshipTypes.length === 0) &&
      (!energyLevels || energyLevels.length === 0) &&
      (!topics || topics.length === 0) &&
      (!searchTerm || searchTerm.trim() === '')
    );
  }, [questionFilters]);
  
  // Filtered questions based on current filters
  const filteredQuestions = useMemo(() => {
    // If no filters are active, return all questions without filtering
    if (areFiltersEmpty) return questions;
    
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
  }, [questions, questionFilters, areFiltersEmpty]);

  // Function to generate personalized questions asynchronously
  const generatePersonalizedQuestions = (
    relationshipType: string, 
    topicPreferences: string[] = [], 
    depthLevel: number = 2,
    count: number = 3
  ): DeepQuestion[] => {
    try {
      // Pre-filter compatible questions to avoid heavy processing during scoring
      const compatibleQuestions = useMemo(() => 
        questions.filter(q => 
          q.relationshipTypes.includes(relationshipType) && 
          q.depthLevel <= depthLevel
        ),
        [relationshipType, depthLevel]
      );
      
      // Calculate scores in a less intensive way
      const scoredQuestions = useMemo(() => {
        // Take a reasonable subset to reduce computation
        const questionsToProcess = compatibleQuestions.slice(0, Math.min(compatibleQuestions.length, 50));
        
        return questionsToProcess.map(q => {
          let score = 0;
          
          // Score based on topic matching - simplified calculation
          if (topicPreferences.length > 0) {
            let matchCount = 0;
            for (let i = 0; i < topicPreferences.length; i++) {
              if (q.topics.includes(topicPreferences[i])) matchCount++;
            }
            score += matchCount * 3;
          }
          
          // Score based on depth level match - simpler calculation
          score += depthLevel === q.depthLevel ? 4 : 2;
          
          // Random factor with less precision to reduce computation
          score += Math.floor(Math.random() * 10) / 10;
          
          return { ...q, score };
        });
      }, [compatibleQuestions, topicPreferences, depthLevel]);
      
      // Sort by score and take top 'count' - use a more efficient sort
      const results = scoredQuestions
        .sort((a, b) => b.score - a.score)
        .slice(0, count)
        .map(({ score, ...q }) => q); // Remove the score property
      
      // Show toast notification
      setTimeout(() => {
        toast({
          title: "Questions Generated",
          description: `Generated ${results.length} personalized questions based on your preferences.`,
        });
      }, 200);
      
      return results;
    } catch (error) {
      console.error('Error generating personalized questions:', error);
      
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

  return {
    questions: filteredQuestions,
    questionFilters,
    setQuestionFilters,
    savedQuestions,
    setSavedQuestions,
    saveQuestion,
    generatePersonalizedQuestions
  };
}
