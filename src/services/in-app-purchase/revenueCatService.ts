import { Capacitor } from '@capacitor/core';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { 
  CustomerInfo, 
  Purchase,
  PurchasePackageOptions,
  RevenueCatPackage,
  PurchasesIntroPrice,
  PRODUCT_CATEGORY
} from './types';

class RevenueCatService {
  private platform: 'ios' | 'android' = Capacitor.getPlatform() === 'ios' ? 'ios' : 'android';
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      // Initialize RevenueCat SDK with platform-specific API key
      const apiKey = this.platform === 'ios' 
        ? 'ios_api_key_here' 
        : 'android_api_key_here';
      
      await Purchases.configure({
        apiKey,
        appUserID: null // Will use anonymous ID initially
      });
      
      this.isInitialized = true;
      console.log('RevenueCat SDK initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
      return false;
    }
  }

  async setUserId(userId: string): Promise<void> {
    try {
      await Purchases.logIn({ appUserID: userId });
      console.log('RevenueCat user ID set:', userId);
    } catch (error) {
      console.error('Error setting RevenueCat user ID:', error);
    }
  }

  async getOfferings() {
    try {
      const offeringsResult = await Purchases.getOfferings();
      return offeringsResult;
    } catch (error) {
      console.error('Error getting offerings from RevenueCat:', error);
      throw error;
    }
  }

  async purchasePackage(options: PurchasePackageOptions) {
    try {
      // Convert our package type to match RevenueCat's expected format
      
      // Create a proper IntroPrice object if the product has one
      const purchaseOptions = {
        aPackage: {
          ...options.aPackage,
          product: {
            ...options.aPackage.product,
            // If product already has the right introPrice type, use it, otherwise keep it undefined
            discounts: options.aPackage.product.discounts || [],
            productCategory: PRODUCT_CATEGORY.SUBSCRIPTION,
            productType: 'subscription',
            subscriptionPeriod: options.aPackage.packageType === 'ANNUAL' ? 'P1Y' : 'P1M',
            defaultOption: options.aPackage.product.defaultOption || true,
            subscriptionOptions: options.aPackage.product.subscriptionOptions || []
          }
        },
        presentedOfferingIdentifier: options.presentedOfferingIdentifier
      };
      
      const purchaseResult = await Purchases.purchasePackage(purchaseOptions);
      return purchaseResult;
    } catch (error) {
      console.error('Error purchasing package from RevenueCat:', error);
      throw error;
    }
  }

  async getCustomerInfo() {
    try {
      const customerInfoResult = await Purchases.getCustomerInfo();
      return customerInfoResult;
    } catch (error) {
      console.error('Error getting customer info from RevenueCat:', error);
      throw error;
    }
  }

  async restorePurchases() {
    try {
      const restoreResult = await Purchases.restorePurchases();
      return restoreResult;
    } catch (error) {
      console.error('Error restoring purchases from RevenueCat:', error);
      throw error;
    }
  }

  addCustomerInfoUpdateListener(callback: (info: CustomerInfo) => void): void {
    Purchases.addCustomerInfoUpdateListener(callback);
  }

  removeCustomerInfoUpdateListener(callback: (info: CustomerInfo) => void): void {
    // RevenueCat doesn't have a direct way to remove a specific listener
    // In a real app, you'd manage this differently
    console.log('Note: RevenueCat does not support removing specific listeners');
  }
}

export const revenueCatService = new RevenueCatService();
