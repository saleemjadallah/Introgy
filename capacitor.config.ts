import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4cb77e9924114b1d9e47bac88f43f4af',
  appName: 'Introgy',
  webDir: 'dist',
  server: {
    url: process.env.NODE_ENV === 'development' 
      ? 'https://4cb77e99-2411-4b1d-9e47-bac88f43f4af.lovableproject.com?forceHideBadge=true'
      : 'https://introgy-app.netlify.app', // This will be your Netlify URL once deployed
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Increased from 2000 to 3000ms
      launchAutoHide: true,
      backgroundColor: "#121212",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true, // Added spinner for better UX
      spinnerColor: "#627286", // Using the app's text-secondary color
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen", // Custom layout name
      useDialog: false // Use native splash screen instead of a dialog (Android)
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#121212",
      overlaysWebView: false,
      animated: true
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF"
    },
    App: {
      appName: "Introgy",
      appVersion: "1.0.0"
    }
  },
  ios: {
    contentInset: "always",
    allowsLinkPreview: false,
    scrollEnabled: true,
    // Add App Store metadata
    scheme: "introgy",
    backgroundColor: "#121212"
  },
  android: {
    allowsLinkPreview: false,
    backgroundColor: "#121212",
    overrideUserAgent: "Introgy Android App",
    captureInput: true,
    webContentsDebuggingEnabled: false // Set to false for production
  }
};

export default config;
