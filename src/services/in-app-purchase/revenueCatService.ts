
import { Capacitor } from '@capacitor/core';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { 
  CustomerInfo, 
  Purchase,
  PurchasePackageOptions,
  RevenueCatPackage,
  PurchasesIntroPrice,
  PRODUCT_CATEGORY,
  PRODUCT_TYPE,
  SubscriptionOption,
  DEFAULT_INTRO_PRICE
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
      // Create a default subscription option if one is not provided
      const defaultSubscriptionOption: SubscriptionOption = {
        id: options.aPackage.product.identifier,
        storeProductId: options.aPackage.product.identifier,
        productId: options.aPackage.product.identifier,
        pricingPhases: []
      };
      
      // Create a valid options object with all required properties for RevenueCat
      const purchaseOptions: PurchasePackageOptions = {
        aPackage: {
          ...options.aPackage,
          product: {
            ...options.aPackage.product,
            // Ensure all required properties are present
            discounts: options.aPackage.product.discounts || [],
            productCategory: PRODUCT_CATEGORY.SUBSCRIPTION,
            productType: PRODUCT_TYPE.AUTO_RENEWABLE_SUBSCRIPTION,
            subscriptionPeriod: options.aPackage.packageType === 'ANNUAL' ? 'P1Y' : 'P1M',
            // Use proper SubscriptionOption type instead of boolean
            defaultOption: options.aPackage.product.defaultOption || defaultSubscriptionOption,
            subscriptionOptions: options.aPackage.product.subscriptionOptions || [],
            // Ensure introPrice is always defined
            introPrice: options.aPackage.product.introPrice || DEFAULT_INTRO_PRICE
          }
        },
        presentedOfferingIdentifier: options.presentedOfferingIdentifier
      };
      
      console.log('Purchasing package with options:', JSON.stringify(purchaseOptions));
      // Pass the options to RevenueCat for purchase
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
