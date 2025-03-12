
import { useEffect } from 'react';
import { capacitorService } from '@/services/CapacitorService';
import { useAuth } from '@/contexts/auth';

const CapacitorInit = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Hide the splash screen after app is ready
    const hideSplash = async () => {
      // Wait for the UI to be fully loaded
      setTimeout(async () => {
        await capacitorService.hideSplashScreen();
      }, 500);
    };
    
    hideSplash();
    
    // Set status bar style based on system theme
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      capacitorService.setStatusBarStyleDark();
    } else {
      capacitorService.setStatusBarStyleLight();
    }

    // Log device information for debugging
    const logDeviceInfo = async () => {
      if (capacitorService.isNativePlatform()) {
        const deviceInfo = await capacitorService.getDeviceInfo();
        console.log('Device info:', deviceInfo);
      }
    };
    
    logDeviceInfo();

    // Listen for theme changes
    const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        capacitorService.setStatusBarStyleDark();
      } else {
        capacitorService.setStatusBarStyleLight();
      }
    };
    
    themeMediaQuery.addEventListener('change', handleThemeChange);
    
    return () => {
      themeMediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // If user logs in, we could set up user-specific configurations
  useEffect(() => {
    if (user) {
      // Store user ID in secure preferences
      capacitorService.setPreference('lastLoggedInUserId', user.id);
    }
  }, [user]);

  // This component doesn't render anything visible
  return null;
};

export default CapacitorInit;
