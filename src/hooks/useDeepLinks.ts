import { useEffect } from 'react';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

/**
 * A hook to handle deep links in the application.
 * This hook logs all incoming deep links and can be used to debug URL opening issues.
 */
const useDeepLinks = () => {
  useEffect(() => {
    // Only needed on native platforms
    if (!Capacitor.isNativePlatform()) return;

    const handleUrlOpen = async (event: URLOpenListenerEvent) => {
      const url = event.url;
      
      console.log('App opened with URL:', url);
      toast.info(`Deep link received: ${url}`);
      
      // Parse and log all URL components for debugging
      try {
        const parsedUrl = new URL(url);
        console.log('Deep link debug info:', {
          fullUrl: url,
          protocol: parsedUrl.protocol,
          host: parsedUrl.host,
          pathname: parsedUrl.pathname,
          search: parsedUrl.search,
          hash: parsedUrl.hash,
          searchParams: Object.fromEntries(new URLSearchParams(parsedUrl.search).entries()),
          hashParams: parsedUrl.hash ? Object.fromEntries(new URLSearchParams(parsedUrl.hash.substring(1)).entries()) : {}
        });
      } catch (e) {
        console.error('Failed to parse deep link URL:', e);
      }
    };
    
    // Listen for URL open events (deep links)
    let cleanupFunction: (() => void) | undefined;
    
    const listenerPromise = App.addListener('appUrlOpen', handleUrlOpen);
    
    listenerPromise.then(listener => {
      cleanupFunction = () => listener.remove();
    });
    
    // For testing on development - log initial URL if any
    if (window.location.search || window.location.hash) {
      console.log('Initial URL has search or hash:', window.location.href);
    }
    
    return () => {
      if (cleanupFunction) cleanupFunction();
    };
  }, []);
  
  return null;
};

export default useDeepLinks;
