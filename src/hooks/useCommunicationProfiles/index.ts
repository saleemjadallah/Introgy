
import { useState, useEffect } from 'react';
import { CommunicationProfile } from '@/types/communication-preferences';
import { useToast } from '@/hooks/use-toast';
import { useProfileStorage } from './useProfileStorage';
import { useProfileManagement } from './useProfileManagement';
import { useSharesManagement } from './useSharesManagement';
import { useTemplateManagement } from './useTemplateManagement';

export function useCommunicationProfiles() {
  const [profiles, setProfiles] = useState<CommunicationProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<CommunicationProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const { 
    loadProfiles, 
    loadShares, 
    shares, 
    setShares,
    saveProfiles,
    saveShares
  } = useProfileStorage({ setProfiles, setActiveProfile, setIsLoading, toast });

  const {
    createProfile,
    updateProfile,
    deleteProfile,
    setDefaultProfile
  } = useProfileManagement({ 
    profiles, 
    shares,
    saveProfiles, 
    saveShares,
    setShares, 
    toast 
  });

  const {
    createShareLink,
    revokeShare,
    accessSharedProfile
  } = useSharesManagement({
    profiles,
    shares,
    saveShares,
    toast
  });

  const {
    createFromTemplate
  } = useTemplateManagement({
    createProfile,
    toast
  });

  // Load profiles from localStorage
  useEffect(() => {
    loadProfiles();
    loadShares();
  }, []);

  return {
    profiles,
    shares,
    activeProfile,
    isLoading,
    createProfile,
    updateProfile,
    deleteProfile,
    setDefaultProfile,
    createFromTemplate,
    createShareLink,
    revokeShare,
    accessSharedProfile,
  };
}
