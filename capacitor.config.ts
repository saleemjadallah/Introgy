
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.introgy.app',
  appName: 'Introgy',
  webDir: 'dist',
  server: {
    url: 'https://introgy.ai',
    androidScheme: 'https',
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
      overlaysWebView: false
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF"
    },
    PurchasesPlugin: {
      // RevenueCat configuration
      apiKey: {
        apple: "appl_wHXBFRFAOUUpWRqauPXyZEUElmq" // API key for iOS
      },
      observerMode: true
    },
    App: {
      appName: "Introgy",
      appVersion: "1.0.0"
    },
    GoogleAuth: {
      scopes: [
        'profile',
        'email',
        'openid'
      ],
      serverClientId: '308656966304-ouvq7u7q9sms8rujjtqpevaqr120vdge.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
      iosClientId: '308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com',
      webClientId: '308656966304-ouvq7u7q9sms8rujjtqpevaqr120vdge.apps.googleusercontent.com',
      androidClientId: '308656966304-0ubb5ad2qcfig4086jp3g3rv7q1kt5m2.apps.googleusercontent.com',
      clientId: '308656966304-ouvq7u7q9sms8rujjtqpevaqr120vdge.apps.googleusercontent.com'
    }
  },
  ios: {
    contentInset: "always",
    scrollEnabled: true,
    scheme: "introgy",
    backgroundColor: "#121212"
  },
  android: {
    backgroundColor: "#121212",
    overrideUserAgent: "Introgy Android App",
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;
