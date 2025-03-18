
import { CommunicationProfile, ProfileTemplate } from '@/types/communication-preferences';

interface UseTemplateManagementProps {
  createProfile: (profile: Omit<CommunicationProfile, 'profileId' | 'userId' | 'lastUpdated'>) => CommunicationProfile;
  toast: any;
}

export function useTemplateManagement({
  createProfile,
  toast
}: UseTemplateManagementProps) {
  
  // Create a profile from a template
  const createFromTemplate = (templateId: string, profileName: string, templates: ProfileTemplate[]) => {
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      toast({
        title: 'Template not found',
        description: 'The template you selected could not be found.',
        variant: 'destructive',
      });
      return null;
    }
    
    const profile = createProfile({
      ...template.profile as CommunicationProfile,
      profileName,
      isDefault: false, // This will be set in createProfile if it's the first profile
    });
    
    return profile;
  };

  return {
    createFromTemplate
  };
}
