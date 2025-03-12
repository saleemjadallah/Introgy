import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

/**
 * A service that provides a unified interface to Capacitor plugins.
 * Allows for better code organization and easier mocking in tests.
 */
class CapacitorService {
  private isNative = Capacitor.isNativePlatform();

  constructor() {
    this.initializePlugins();
  }

  /**
   * Initialize plugins and set up event listeners
   */
  private async initializePlugins() {
    if (!this.isNative) return;

    try {
      // Set up app state change listeners
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
        // You could trigger analytics events here or pause/resume certain features
      });

      // Set up deep link listeners
      App.addListener('appUrlOpen', (data) => {
        console.log('App opened with URL:', data.url);
        // Here you would handle deep links
      });

      // Set up back button handling (Android)
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          // Show exit confirmation or handle gracefully
          console.log('User tried to exit the app');
        }
      });

      // Initialize status bar for iOS
      if (Capacitor.getPlatform() === 'ios') {
        await StatusBar.setStyle({ style: Style.Dark });
      }

      // Request notification permissions
      await LocalNotifications.requestPermissions();
    } catch (error) {
      console.error('Error initializing Capacitor plugins:', error);
    }
  }

  // App-related methods
  async minimizeApp(): Promise<void> {
    if (!this.isNative) return;
    await App.minimizeApp();
  }

  async exitApp(): Promise<void> {
    if (!this.isNative) return;
    await App.exitApp();
  }

  // Status Bar methods
  async setStatusBarStyleDark(): Promise<void> {
    if (!this.isNative) return;
    await StatusBar.setStyle({ style: Style.Dark });
  }

  async setStatusBarStyleLight(): Promise<void> {
    if (!this.isNative) return;
    await StatusBar.setStyle({ style: Style.Light });
  }

  async hideStatusBar(): Promise<void> {
    if (!this.isNative) return;
    await StatusBar.hide();
  }

  async showStatusBar(): Promise<void> {
    if (!this.isNative) return;
    await StatusBar.show();
  }

  // Device information
  async getDeviceInfo() {
    if (!this.isNative) return null;
    return await Device.getInfo();
  }

  async getDeviceId() {
    if (!this.isNative) return null;
    const info = await Device.getId();
    return info.identifier; // Changed from uuid to identifier which is the correct property
  }

  // Local Notifications
  async scheduleNotification(options: ScheduleOptions): Promise<void> {
    if (!this.isNative) {
      console.log('Would schedule notification in native app:', options);
      return;
    }
    
    try {
      const hasPermission = await this.checkNotificationPermission();
      if (!hasPermission) {
        await LocalNotifications.requestPermissions();
      }
      await LocalNotifications.schedule(options);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async checkNotificationPermission(): Promise<boolean> {
    if (!this.isNative) return false;
    
    const { display } = await LocalNotifications.checkPermissions();
    return display === 'granted';
  }

  // Preferences (Storage)
  async setPreference(key: string, value: string): Promise<void> {
    if (!this.isNative) {
      localStorage.setItem(key, value);
      return;
    }
    await Preferences.set({ key, value });
  }

  async getPreference(key: string): Promise<string | null> {
    if (!this.isNative) {
      return localStorage.getItem(key);
    }
    const { value } = await Preferences.get({ key });
    return value;
  }

  async removePreference(key: string): Promise<void> {
    if (!this.isNative) {
      localStorage.removeItem(key);
      return;
    }
    await Preferences.remove({ key });
  }

  isNativePlatform(): boolean {
    return this.isNative;
  }

  getPlatform(): string {
    return Capacitor.getPlatform();
  }
}

// Export a singleton instance
export const capacitorService = new CapacitorService();
