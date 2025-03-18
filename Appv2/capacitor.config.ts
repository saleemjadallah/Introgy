import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.introgy.app',
  appName: 'Introgy',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    url: 'https://introgy.ai',
    cleartext: true
  },
  // Add custom URL scheme for deep linking
  ios: {
    scheme: 'introgy'
  },
  // Custom URL handling for Android is configured in AndroidManifest.xml
  // We'll update that file separately
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      showSpinner: true,
      spinnerColor: "#999999",
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
    },
  }
};

export default config;
