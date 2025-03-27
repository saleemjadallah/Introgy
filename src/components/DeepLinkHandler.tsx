import { useEffect } from 'react';
import useGoogleAuth from '@/hooks/useGoogleAuth';
import useDeepLinks from '@/hooks/useDeepLinks';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { supabase } from '@/integrations/supabase/client';

const DeepLinkHandler: React.FC = () => {
  // Initialize deep link handlers
  useGoogleAuth();
  useDeepLinks();
  
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      console.log('DeepLinkHandler activated for native platform');
      
      // Add enhanced deep link monitoring for debugging
      CapApp.addListener('appUrlOpen', (event) => {
        console.log('🔗 Deep link received:', event.url);
        
        try {
          // Log URL components
          const url = new URL(event.url);
          console.log('URL components:', {
            protocol: url.protocol,
            host: url.host,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash
          });
          
          // Store for debugging
          localStorage.setItem('last_deep_link', event.url);
          localStorage.setItem('last_deep_link_time', new Date().toISOString());
          
          // If this is an auth callback, handle it specially
          if (url.host === 'auth.supabase.co' && url.pathname.includes('/callback') ||
              url.pathname.includes('/auth/v1/callback')) {
            console.log('🔑 Auth callback URL detected, extracting tokens...');
            
            // Extract tokens from URL fragment or query
            const hashParams = url.hash ? Object.fromEntries(new URLSearchParams(url.hash.substring(1)).entries()) : {};
            const searchParams = Object.fromEntries(new URLSearchParams(url.search).entries());
            
            console.log('URL parameters:', {
              hash: hashParams,
              search: searchParams
            });
          }
        } catch (e) {
          console.error('Error parsing deep link URL:', e);
        }
      });
      
      // Log auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔐 Auth state changed:', event);
        console.log('Session:', session ? {
          userId: session.user?.id,
          email: session.user?.email,
          expiresAt: session.expires_at
        } : null);
      });
      
      return () => {
        subscription.unsubscribe();
      };
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
      
      // Log auth state changes for web too
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔐 Auth state changed (web):', event);
        console.log('Session:', session ? {
          userId: session.user?.id,
          email: session.user?.email,
          expiresAt: session.expires_at
        } : null);
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default DeepLinkHandler;
