
import { Capacitor } from '@capacitor/core';
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
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
      // Set debug log level first
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
      
      // Use consistent API keys with native initialization
      let apiKey = '';
      
      if (this.platform === 'ios') {
        apiKey = 'appl_wHXBFRFAOUUpWRqauPXyZEUElmq'; // iOS API key
      } else if (this.platform === 'android') {
        apiKey = 'goog_YkwgHvPZnlbmIfTBBQLPKHulLkX'; // Android API key
      }
      
      // Configure with platform-specific API key
      await Purchases.configure({
        apiKey,
        appUserID: null, // Will use anonymous ID initially
      });
      
      this.isInitialized = true;
      console.log('RevenueCat SDK initialized successfully with API key:', apiKey);
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
      // Create a default subscription option that includes all required properties
      const enhancedSubscriptionOption: SubscriptionOption = {
        id: options.aPackage.product.identifier,
        storeProductId: options.aPackage.product.identifier,
        productId: options.aPackage.product.identifier,
        pricingPhases: [],
        tags: [],
        isBasePlan: true,
        billingPeriod: options.aPackage.packageType === 'ANNUAL' ? 'P1Y' : 'P1M',
        isPrepaid: false,
        presentedOfferingIdentifier: options.presentedOfferingIdentifier
      };
      
      // Convert our options to what RevenueCat expects
      const revenueCatOptions = {
        aPackage: {
          ...options.aPackage,
          product: {
            ...options.aPackage.product,
            // Ensure all required properties are present
            discounts: options.aPackage.product.discounts || [],
            productCategory: PRODUCT_CATEGORY.SUBSCRIPTION,
            productType: PRODUCT_TYPE.AUTO_RENEWABLE_SUBSCRIPTION,
            subscriptionPeriod: options.aPackage.packageType === 'ANNUAL' ? 'P1Y' : 'P1M',
            defaultOption: enhancedSubscriptionOption,
            subscriptionOptions: [enhancedSubscriptionOption],
            // Ensure introPrice is always defined
            introPrice: options.aPackage.product.introPrice || DEFAULT_INTRO_PRICE
          }
        },
        presentedOfferingIdentifier: options.presentedOfferingIdentifier
      };
      
      console.log('Purchasing package with options:', JSON.stringify(revenueCatOptions));
      
      // Use any to bypass type checking since we're deliberately adapting our types to RevenueCat's
      const purchaseResult = await Purchases.purchasePackage(revenueCatOptions as any);
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

  // Updated method to correctly use the Capacitor RevenueCat plugin's API
  async presentPaywall(offeringIdentifier?: string) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // The RevenueCat Capacitor plugin uses 'showPaywall' method, not presentPaywall
      if (this.platform === 'ios' || this.platform === 'android') {
        // Check if the method exists and call it
        if (typeof Purchases.showPaywall === 'function') {
          await Purchases.showPaywall({ 
            offering: offeringIdentifier || 'premium'
          });
          console.log('RevenueCat paywall presented successfully');
          return true;
        } else {
          // Fallback for older versions of the plugin
          console.warn('RevenueCat showPaywall method not available on this version of the plugin');
          return false;
        }
      } else {
        console.warn('RevenueCat paywall is only available on iOS and Android');
        return false;
      }
    } catch (error) {
      console.error('Error presenting RevenueCat paywall:', error);
      return false;
    }
  }

  async checkEntitlementStatus(entitlementId: string = 'premium'): Promise<boolean> {
    try {
      const result = await this.getCustomerInfo();
      
      // Fixed: access the CustomerInfo object correctly based on the plugin's response structure
      const customerInfo = result.customerInfo;
      
      // Check if the entitlements object exists and the specific entitlement is active
      return (
        customerInfo?.entitlements?.active && 
        customerInfo.entitlements.active[entitlementId] !== undefined
      );
    } catch (error) {
      console.error('Error checking entitlement status:', error);
      return false;
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
