import { useEffect } from 'react';
import useGoogleAuth from '@/hooks/useGoogleAuth';
import useDeepLinks from '@/hooks/useDeepLinks';
import { Capacitor } from '@capacitor/core';

const DeepLinkHandler: React.FC = () => {
  // Initialize deep link handlers
  useGoogleAuth();
  useDeepLinks();
  
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      console.log('DeepLinkHandler activated for native platform');
    } else {
      console.log('DeepLinkHandler activated for web platform');
      
      // On web, log any URL parameters that might be present
      if (window.location.search || window.location.hash) {
        console.log('Initial URL has parameters:', {
          fullUrl: window.location.href,
          search: window.location.search,
          hash: window.location.hash,
          searchParams: Object.fromEntries(new URLSearchParams(window.location.search).entries()),
          hashParams: window.location.hash ? Object.fromEntries(new URLSearchParams(window.location.hash.substring(1)).entries()) : {}
        });
      }
    }
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default DeepLinkHandler;
