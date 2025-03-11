
import { useState } from 'react';
import { 
  CommunicationProfile, 
  SharingConfiguration 
} from '@/types/communication-preferences';

// LocalStorage keys
const PROFILES_KEY = 'communicationProfiles';
const SHARES_KEY = 'profileShares';

interface UseProfileStorageProps {
  setProfiles: React.Dispatch<React.SetStateAction<CommunicationProfile[]>>;
  setActiveProfile: React.Dispatch<React.SetStateAction<CommunicationProfile | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
}

export function useProfileStorage({ 
  setProfiles, 
  setActiveProfile, 
  setIsLoading, 
  toast 
}: UseProfileStorageProps) {
  const [shares, setShares] = useState<SharingConfiguration[]>([]);

  // Load profiles from localStorage
  const loadProfiles = () => {
    try {
      // Load communication profiles
      const savedProfiles = localStorage.getItem(PROFILES_KEY);
      if (savedProfiles) {
        const parsedProfiles = JSON.parse(savedProfiles);
        // Convert string dates back to Date objects
        const profiles = parsedProfiles.map((profile: any) => ({
          ...profile,
          lastUpdated: new Date(profile.lastUpdated),
        }));
        setProfiles(profiles);
        
        // Set active profile to the default, if any
        const defaultProfile = profiles.find((p: CommunicationProfile) => p.isDefault);
        if (defaultProfile) {
          setActiveProfile(defaultProfile);
        }
      }
    } catch (error) {
      console.error('Error loading communication profiles:', error);
      toast({
        title: 'Error loading profiles',
        description: 'Failed to load your communication preferences.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load shares from localStorage
  const loadShares = () => {
    try {
      const savedShares = localStorage.getItem(SHARES_KEY);
      if (savedShares) {
        const parsedShares = JSON.parse(savedShares);
        // Convert string dates back to Date objects
        const shares = parsedShares.map((share: any) => ({
          ...share,
          createdAt: new Date(share.createdAt),
          expiresAt: new Date(share.expiresAt),
          accessLog: share.accessLog.map((log: any) => ({
            ...log,
            accessedAt: new Date(log.accessedAt),
          })),
        }));
        setShares(shares);
      }
    } catch (error) {
      console.error('Error loading shares:', error);
      toast({
        title: 'Error loading shares',
        description: 'Failed to load your sharing configurations.',
        variant: 'destructive',
      });
    }
  };

  // Save profiles to localStorage
  const saveProfiles = (updatedProfiles: CommunicationProfile[]) => {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);
    } catch (error) {
      console.error('Error saving profiles:', error);
      toast({
        title: 'Save failed',
        description: 'Failed to save your communication profiles.',
        variant: 'destructive',
      });
    }
  };
  
  // Save shares to localStorage
  const saveShares = (updatedShares: SharingConfiguration[]) => {
    try {
      localStorage.setItem(SHARES_KEY, JSON.stringify(updatedShares));
      setShares(updatedShares);
    } catch (error) {
      console.error('Error saving shares:', error);
      toast({
        title: 'Share failed',
        description: 'Failed to save your sharing configurations.',
        variant: 'destructive',
      });
    }
  };

  return {
    loadProfiles,
    loadShares,
    shares,
    setShares,
    saveProfiles,
    saveShares
  };
}
