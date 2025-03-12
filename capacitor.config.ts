
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4cb77e9924114b1d9e47bac88f43f4af',
  appName: 'Introgy',
  webDir: 'dist',
  server: {
    url: process.env.NODE_ENV === 'development' 
      ? 'https://4cb77e99-2411-4b1d-9e47-bac88f43f4af.lovableproject.com?forceHideBadge=true'
      : 'https://introgy-app.netlify.app',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#121212",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#627286",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: false
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
    PurchasesPlugin: {
      // RevenueCat configuration can be added here if needed
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
    scheme: "introgy",
    backgroundColor: "#121212"
  },
  android: {
    allowsLinkPreview: false,
    backgroundColor: "#121212",
    overrideUserAgent: "Introgy Android App",
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;
