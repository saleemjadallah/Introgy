import { Capacitor } from '@capacitor/core';
import { 
  Product, 
  Purchase, 
  VerificationResult, 
  PurchaseListener,
  CustomerInfo,
  RevenueCatOfferings,
  RevenueCatPackage,
  PurchaseResult,
  PurchasePackageOptions
} from './in-app-purchase/types';
import { getMockProducts, ENTITLEMENTS, OFFERINGS } from './in-app-purchase/mockProducts';
import { verifyPurchase, processCustomerInfo } from './in-app-purchase/purchaseVerification';
import { restorePurchases, convertCustomerInfoToPurchases } from './in-app-purchase/purchaseRestoration';
import { Purchases } from '@revenuecat/purchases-capacitor';

export { PRODUCT_IDS } from './in-app-purchase/types';
export type { Product, Purchase, VerificationResult, ProductType } from './in-app-purchase/types';

class InAppPurchaseService {
  private isNative = Capacitor.isNativePlatform();
  private productCache: Product[] = [];
  private listeners: PurchaseListener[] = [];
  private platform: 'ios' | 'android' | 'web' = 'web';
  private isRevenueCatInitialized = false;

  constructor() {
    console.log('InAppPurchaseService initialized, native:', this.isNative);
    
    if (this.isNative) {
      if (Capacitor.getPlatform() === 'ios') {
        this.platform = 'ios';
      } else if (Capacitor.getPlatform() === 'android') {
        this.platform = 'android';
      }
      
      this.initializeRevenueCat();
    }
  }

  private async initializeRevenueCat() {
    if (!this.isNative) return;
    
    try {
      // Initialize RevenueCat SDK 
      // Replace with your actual RevenueCat API key
      const apiKey = this.platform === 'ios' 
        ? 'ios_api_key_here' 
        : 'android_api_key_here';
      
      await Purchases.configure({
        apiKey,
        appUserID: null // Will use anonymous ID initially
      });
      
      // Set up a listener for purchase events
      Purchases.addCustomerInfoUpdateListener((info) => {
        console.log('RevenueCat customer info updated:', info);
        // The info coming directly from the listener is already a CustomerInfo object
        const purchases = this.convertCustomerInfoToPurchases(info);
        purchases.forEach(purchase => this.notifyListeners(purchase));
      });
      
      this.isRevenueCatInitialized = true;
      console.log('RevenueCat SDK initialized successfully');
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
    }
  }

  async setUserId(userId: string) {
    if (!this.isNative || !this.isRevenueCatInitialized) return;
    
    try {
      await Purchases.logIn({ appUserID: userId });
      console.log('RevenueCat user ID set:', userId);
    } catch (error) {
      console.error('Error setting RevenueCat user ID:', error);
    }
  }

  private notifyListeners(purchase: Purchase) {
    this.listeners.forEach(listener => listener(purchase));
  }

  private convertCustomerInfoToPurchases(customerInfo: CustomerInfo): Purchase[] {
    try {
      if (!customerInfo.activeSubscriptions || customerInfo.activeSubscriptions.length === 0) {
        return [];
      }
      
      return customerInfo.activeSubscriptions.map(productId => {
        return {
          productId,
          transactionId: `revenuecat-${Date.now()}`,
          timestamp: Date.now(),
          platform: this.platform === 'web' ? undefined : this.platform
        };
      });
    } catch (err) {
      console.error('Error converting customer info to purchases:', err);
      return [];
    }
  }

  async getProducts(): Promise<Product[]> {
    if (!this.isNative) {
      return getMockProducts();
    }
    
    if (this.productCache.length > 0) {
      return this.productCache;
    }
    
    try {
      if (!this.isRevenueCatInitialized) {
        await this.initializeRevenueCat();
      }
      
      // Fetch offerings from RevenueCat
      const offeringsResult = await Purchases.getOfferings();
      const offerings = offeringsResult as unknown as { offerings: RevenueCatOfferings };
      
      if (!offerings.offerings || !offerings.offerings.current) {
        console.log('No RevenueCat offerings available, using mock products');
        this.productCache = getMockProducts();
        return this.productCache;
      }
      
      // Convert RevenueCat products to our Product type
      const products: Product[] = offerings.offerings.current.availablePackages.map(pkg => {
        const product = pkg.product;
        return {
          id: product.identifier,
          title: product.title,
          description: product.description,
          price: product.priceString,
          priceAsNumber: product.price,
          currency: product.currencyCode,
          type: product.identifier.includes('yearly') ? 'yearly' : 'monthly'
        };
      });
      
      this.productCache = products;
      return products;
    } catch (error) {
      console.error('Error getting products from RevenueCat:', error);
      // Fall back to mock products
      this.productCache = getMockProducts();
      return this.productCache;
    }
  }

  async purchaseProduct(productId: string): Promise<Purchase | null> {
    if (!this.isNative) {
      console.log('Purchase attempted in non-native environment:', productId);
      
      const mockPurchase = {
        productId,
        transactionId: `mock-${Date.now()}`,
        timestamp: Date.now(),
        receipt: `mock-receipt-${Date.now()}`,
        platform: 'ios' as const
      };
      
      this.listeners.forEach(listener => listener(mockPurchase));
      return mockPurchase;
    }

    try {
      if (!this.isRevenueCatInitialized) {
        await this.initializeRevenueCat();
      }
      
      console.log('Purchasing product with RevenueCat:', productId);
      
      // Get the offerings first
      const offeringsResult = await Purchases.getOfferings();
      const offerings = offeringsResult as unknown as { offerings: RevenueCatOfferings };
      
      if (!offerings.offerings || !offerings.offerings.current) {
        throw new Error('No RevenueCat offerings available');
      }
      
      // Find the package containing the product
      let packageToPurchase: RevenueCatPackage | undefined;
      
      for (const pkg of offerings.offerings.current.availablePackages) {
        if (pkg.product.identifier === productId) {
          packageToPurchase = pkg;
          break;
        }
      }
      
      if (!packageToPurchase) {
        throw new Error(`Package not found for product ID: ${productId}`);
      }
      
      // Purchase the package using the correct options structure to match the RevenueCat expectations
      const options: PurchasePackageOptions = {
        aPackage: packageToPurchase,
        presentedOfferingIdentifier: offerings.offerings.current.identifier
      };
      
      const purchaseResult = await Purchases.purchasePackage(options);
      
      // The result has a different structure than our types indicated
      const purchaseData = purchaseResult as unknown as PurchaseResult;
      
      console.log('RevenueCat purchase successful:', purchaseData.productIdentifier);
      
      // Create our Purchase object
      const purchase: Purchase = {
        productId: purchaseData.productIdentifier,
        transactionId: `revenuecat-${Date.now()}`,
        timestamp: Date.now(),
        platform: this.platform === 'web' ? undefined : (this.platform as 'ios' | 'android')
      };
      
      // Notify listeners
      this.notifyListeners(purchase);
      
      return purchase;
    } catch (error) {
      console.error('Error purchasing with RevenueCat:', error);
      return null;
    }
  }

  async verifyPurchase(purchase: Purchase, userId: string): Promise<VerificationResult> {
    if (!this.isNative) {
      return verifyPurchase(purchase, userId, this.platform);
    }
    
    try {
      if (!this.isRevenueCatInitialized) {
        await this.initializeRevenueCat();
      }
      
      // Get the customer info from RevenueCat
      const customerInfoResult = await Purchases.getCustomerInfo();
      
      // Need to extract customerInfo from the response
      const customerInfo = customerInfoResult as unknown as CustomerInfo;
      
      // Process the customer info
      const verificationResult = processCustomerInfo(customerInfo);
      
      // If verification successful, store in database
      if (verificationResult.success) {
        // Store in Supabase
        await verifyPurchase(purchase, userId, this.platform);
      }
      
      return verificationResult;
    } catch (error) {
      console.error('Error verifying purchase with RevenueCat:', error);
      return {
        success: false,
        planType: 'monthly',
        expiresAt: new Date().toISOString(),
        error: error.message
      };
    }
  }

  private processCustomerInfo(customerInfo: CustomerInfo): VerificationResult {
    try {
      // Check if the premium entitlement is active
      const premiumEntitlement = customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM];
      
      if (!premiumEntitlement) {
        return {
          success: false,
          planType: 'monthly',
          expiresAt: new Date().toISOString(),
          error: 'No active premium entitlement'
        };
      }
      
      // Determine plan type based on subscription period
      const planType: 'monthly' | 'yearly' = 
        premiumEntitlement.periodType.includes('annual') ? 'yearly' : 'monthly';
      
      // Get expiration date
      const expiresAt = premiumEntitlement.expirationDate || 
        new Date(Date.now() + 31536000000).toISOString(); // Default to 1 year if no expiration
      
      return {
        success: true,
        planType,
        expiresAt,
        error: undefined
      };
    } catch (err) {
      console.error('Error processing customer info:', err);
      return {
        success: false,
        planType: 'monthly',
        expiresAt: new Date().toISOString(),
        error: err.message
      };
    }
  }

  async restorePurchases(): Promise<Purchase[]> {
    if (!this.isNative) {
      console.log('Restore attempted in non-native environment');
      return restorePurchases('web');
    }
    
    try {
      if (!this.isRevenueCatInitialized) {
        await this.initializeRevenueCat();
      }
      
      console.log('Restoring purchases with RevenueCat');
      
      // Restore purchases with RevenueCat
      const restoreResult = await Purchases.restorePurchases();
      
      // Extract customerInfo from the response
      const customerInfo = restoreResult as unknown as CustomerInfo;
      
      // Convert to our Purchase type
      const purchases = this.convertCustomerInfoToPurchases(customerInfo);
      
      // Notify listeners
      purchases.forEach(purchase => this.notifyListeners(purchase));
      
      return purchases;
    } catch (error) {
      console.error('Error restoring purchases with RevenueCat:', error);
      return [];
    }
  }

  async checkEntitlementStatus(): Promise<boolean> {
    if (!this.isNative) {
      // For web, check with our backend
      const restoredPurchases = await restorePurchases('web');
      return restoredPurchases.length > 0;
    }
    
    try {
      if (!this.isRevenueCatInitialized) {
        await this.initializeRevenueCat();
      }
      
      // Get customer info from RevenueCat
      const customerInfoResult = await Purchases.getCustomerInfo();
      const customerInfo = customerInfoResult as unknown as CustomerInfo;
      
      // Check if the premium entitlement is active
      return !!customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM];
    } catch (error) {
      console.error('Error checking entitlement status:', error);
      return false;
    }
  }

  addPurchaseListener(listener: PurchaseListener): void {
    this.listeners.push(listener);
  }

  removePurchaseListener(listener: PurchaseListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
}

export const inAppPurchaseService = new InAppPurchaseService();
