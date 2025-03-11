
import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MessageTemplate } from '@/types/meaningful-interactions';
import { useToast } from '@/hooks/use-toast';
import { MeaningfulInteractionFilters } from './types';

export function useTemplates(initialTemplates: MessageTemplate[]) {
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(() => initialTemplates);
  const [templateFilters, setTemplateFilters] = useState<MeaningfulInteractionFilters>({});
  const [customTemplates, setCustomTemplates] = useState<MessageTemplate[]>([]);
  const { toast } = useToast();

  // Check if template filters are empty
  const areTemplateFiltersEmpty = useMemo(() => {
    const { categories, relationshipTypes, energyLevels, searchTerm } = templateFilters;
    return (
      (!categories || categories.length === 0) &&
      (!relationshipTypes || relationshipTypes.length === 0) &&
      (!energyLevels || energyLevels.length === 0) &&
      (!searchTerm || searchTerm.trim() === '')
    );
  }, [templateFilters]);
  
  // Filtered message templates
  const filteredTemplates = useMemo(() => {
    // Skip filtering if no filters are applied
    if (areTemplateFiltersEmpty) return messageTemplates;
    
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
  }, [messageTemplates, templateFilters, areTemplateFiltersEmpty]);

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

  return {
    messageTemplates: filteredTemplates,
    templateFilters,
    setTemplateFilters,
    customTemplates,
    setCustomTemplates,
    fillMessageTemplate,
    createCustomTemplate
  };
}
