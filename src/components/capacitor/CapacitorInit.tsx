
import { useEffect } from 'react';
import { capacitorService } from '@/services/CapacitorService';
import { useAuth } from '@/contexts/auth';
import { inAppPurchaseService } from '@/services/InAppPurchaseService';

const CapacitorInit = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize all required services
    const initializeServices = async () => {
      try {
        // Initialize RevenueCat first
        if (capacitorService.isNativePlatform()) {
          console.log('Initializing RevenueCat...');
          
          // This will trigger initialization via InAppPurchaseService -> purchaseService -> revenueCatService
          await inAppPurchaseService.getProducts();
          
          // Check entitlement status immediately
          const isEntitled = await inAppPurchaseService.checkEntitlementStatus();
          console.log('User is entitled to premium features:', isEntitled);
        }
        
        // Then do other initialization tasks
        // Hide the splash screen after app is ready and services are initialized
        setTimeout(async () => {
          await capacitorService.hideSplashScreen();
        }, 500);
      } catch (error) {
        console.error('Error during service initialization:', error);
        // Still hide splash screen even if there's an error
        capacitorService.hideSplashScreen();
      }
    };
    
    initializeServices();
    
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
