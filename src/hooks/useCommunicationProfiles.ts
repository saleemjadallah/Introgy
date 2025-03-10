import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  CommunicationProfile, 
  SharingConfiguration,
  ProfileTemplate 
} from '@/types/communication-preferences';
import { useToast } from '@/hooks/use-toast';

// LocalStorage keys
const PROFILES_KEY = 'communicationProfiles';
const SHARES_KEY = 'profileShares';

export function useCommunicationProfiles() {
  const [profiles, setProfiles] = useState<CommunicationProfile[]>([]);
  const [shares, setShares] = useState<SharingConfiguration[]>([]);
  const [activeProfile, setActiveProfile] = useState<CommunicationProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load profiles from localStorage
  useEffect(() => {
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
        
        // Load shares
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

    loadProfiles();
  }, [toast]);

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

  // Create a new profile
  const createProfile = (newProfile: Omit<CommunicationProfile, 'profileId' | 'userId' | 'lastUpdated'>) => {
    // Generate an ID for the new profile
    const profileId = uuidv4();
    
    // Create profile with generated ID and current timestamp
    const profile: CommunicationProfile = {
      ...newProfile,
      profileId,
      userId: 'current-user', // For now, hardcode user ID
      lastUpdated: new Date(),
    };
    
    // If this is the first profile, make it the default
    if (profiles.length === 0) {
      profile.isDefault = true;
    }
    
    // Add to profiles collection
    const updatedProfiles = [...profiles, profile];
    saveProfiles(updatedProfiles);
    
    toast({
      title: 'Profile created',
      description: `Your communication profile "${profile.profileName}" has been created.`,
    });
    
    return profile;
  };

  // Update an existing profile
  const updateProfile = (profileId: string, updates: Partial<CommunicationProfile>) => {
    const updatedProfiles = profiles.map(profile => {
      if (profile.profileId === profileId) {
        return {
          ...profile,
          ...updates,
          lastUpdated: new Date(),
        };
      }
      return profile;
    });
    
    saveProfiles(updatedProfiles);
    
    toast({
      title: 'Profile updated',
      description: 'Your communication profile has been updated.',
    });
  };

  // Delete a profile
  const deleteProfile = (profileId: string) => {
    const profileToDelete = profiles.find(p => p.profileId === profileId);
    
    if (!profileToDelete) {
      toast({
        title: 'Profile not found',
        description: 'The profile you tried to delete could not be found.',
        variant: 'destructive',
      });
      return;
    }
    
    // Delete all shares for this profile
    const updatedShares = shares.filter(share => share.profileId !== profileId);
    saveShares(updatedShares);
    
    // Delete the profile
    const updatedProfiles = profiles.filter(profile => profile.profileId !== profileId);
    
    // If we're deleting the default profile and there are other profiles,
    // make another one the default
    if (profileToDelete.isDefault && updatedProfiles.length > 0) {
      updatedProfiles[0].isDefault = true;
    }
    
    saveProfiles(updatedProfiles);
    
    toast({
      title: 'Profile deleted',
      description: `Profile "${profileToDelete.profileName}" has been deleted.`,
    });
  };

  // Set a profile as the default
  const setDefaultProfile = (profileId: string) => {
    const updatedProfiles = profiles.map(profile => ({
      ...profile,
      isDefault: profile.profileId === profileId,
    }));
    
    saveProfiles(updatedProfiles);
    
    // Update active profile if necessary
    const newDefault = updatedProfiles.find(p => p.profileId === profileId);
    if (newDefault) {
      setActiveProfile(newDefault);
    }
    
    toast({
      title: 'Default profile updated',
      description: 'Your default communication profile has been updated.',
    });
  };

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
      isDefault: profiles.length === 0, // First profile is default
    });
    
    return profile;
  };

  // Create a sharing configuration
  const createShareLink = (
    profileId: string, 
    expiresInDays: number = 30, 
    accessCode?: string,
    customMessage?: string,
    sharingFormat: 'link' | 'card' | 'pdf' = 'link'
  ) => {
    const profile = profiles.find(p => p.profileId === profileId);
    
    if (!profile) {
      toast({
        title: 'Profile not found',
        description: 'The profile you tried to share could not be found.',
        variant: 'destructive',
      });
      return null;
    }
    
    const shareId = uuidv4();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt);
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    const shareConfig: SharingConfiguration = {
      shareId,
      profileId,
      createdAt,
      expiresAt,
      accessCode,
      customMessage,
      accessLog: [],
      sharingFormat,
    };
    
    const updatedShares = [...shares, shareConfig];
    saveShares(updatedShares);
    
    toast({
      title: 'Profile shared',
      description: 'Your communication profile has been shared successfully.',
    });
    
    return shareConfig;
  };

  // Revoke a sharing configuration
  const revokeShare = (shareId: string) => {
    const updatedShares = shares.filter(share => share.shareId !== shareId);
    saveShares(updatedShares);
    
    toast({
      title: 'Sharing revoked',
      description: 'The shared profile has been revoked and is no longer accessible.',
    });
  };

  // Access a shared profile
  const accessSharedProfile = (shareId: string, accessCode?: string) => {
    const share = shares.find(s => s.shareId === shareId);
    
    if (!share) {
      return { success: false, message: 'Shared profile not found.' };
    }
    
    // Check if expired
    if (new Date() > share.expiresAt) {
      return { success: false, message: 'This shared profile has expired.' };
    }
    
    // Check access code if required
    if (share.accessCode && share.accessCode !== accessCode) {
      return { success: false, message: 'Invalid access code.' };
    }
    
    // Update access log
    const updatedShare = {
      ...share,
      accessLog: [
        ...share.accessLog,
        {
          accessedAt: new Date(),
          accessCount: 1,
        },
      ],
    };
    
    const updatedShares = shares.map(s => 
      s.shareId === shareId ? updatedShare : s
    );
    
    saveShares(updatedShares);
    
    // Get the profile
    const profile = profiles.find(p => p.profileId === share.profileId);
    
    if (!profile) {
      return { success: false, message: 'Profile not found.' };
    }
    
    return { 
      success: true, 
      profile, 
      sharingFormat: share.sharingFormat,
      customMessage: share.customMessage 
    };
  };

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