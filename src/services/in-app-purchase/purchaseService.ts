
import { Capacitor } from '@capacitor/core';
import { 
  Purchase, 
  CustomerInfo, 
  RevenueCatOfferings,
  RevenueCatPackage,
  PurchasePackageOptions,
  PACKAGE_TYPE
} from './types';
import { ENTITLEMENTS } from './mockProducts';
import { revenueCatService } from './revenueCatService';
import { verifyPurchase, processCustomerInfo } from './purchaseVerification';
import { restorePurchases } from './purchaseRestoration';

type PurchaseListener = (purchase: Purchase) => void;

class PurchaseService {
  private isNative = Capacitor.isNativePlatform();
  private listeners: PurchaseListener[] = [];
  private platform: 'ios' | 'android' | 'web' = 'web';
  private isInitialized = false;

  constructor() {
    if (this.isNative) {
      if (Capacitor.getPlatform() === 'ios') {
        this.platform = 'ios';
      } else if (Capacitor.getPlatform() === 'android') {
        this.platform = 'android';
      }
    }
  }

  async initialize(): Promise<void> {
    if (!this.isNative || this.isInitialized) return;
    
    try {
      const initialized = await revenueCatService.initialize();
      
      if (initialized) {
        // Set up a listener for purchase events
        revenueCatService.addCustomerInfoUpdateListener((info) => {
          console.log('RevenueCat customer info updated:', info);
          const purchases = this.convertCustomerInfoToPurchases(info);
          purchases.forEach(purchase => this.notifyListeners(purchase));
        });
        
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Error initializing purchase service:', error);
    }
  }

  private notifyListeners(purchase: Purchase): void {
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

    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('Purchasing product with RevenueCat:', productId);
      
      // Get the offerings first
      const offeringsResult = await revenueCatService.getOfferings();
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
      
      // Purchase the package using the correct options structure
      const options: PurchasePackageOptions = {
        aPackage: packageToPurchase,
        presentedOfferingIdentifier: offerings.offerings.current.identifier
      };
      
      const purchaseResultData = await revenueCatService.purchasePackage(options);
      
      // The result has a different structure than our types indicated
      const purchaseResult = purchaseResultData as unknown as { customerInfo: CustomerInfo; productIdentifier: string };
      
      console.log('RevenueCat purchase successful:', purchaseResult.productIdentifier);
      
      // Create our Purchase object
      const purchase: Purchase = {
        productId: purchaseResult.productIdentifier,
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

  async verifyPurchase(purchase: Purchase, userId: string): Promise<import('./types').VerificationResult> {
    if (!this.isNative) {
      return verifyPurchase(purchase, userId, this.platform);
    }
    
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Get the customer info from RevenueCat
      const customerInfoResult = await revenueCatService.getCustomerInfo();
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

  async restorePurchases(): Promise<Purchase[]> {
    if (!this.isNative) {
      console.log('Restore attempted in non-native environment');
      return restorePurchases('web');
    }
    
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('Restoring purchases with RevenueCat');
      
      // Restore purchases with RevenueCat
      const restoreResultData = await revenueCatService.restorePurchases();
      const customerInfo = restoreResultData as unknown as CustomerInfo;
      
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
    
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Get customer info from RevenueCat
      const customerInfoResult = await revenueCatService.getCustomerInfo();
      const customerInfo = customerInfoResult as unknown as CustomerInfo;
      
      // Check if the premium entitlement is active
      return !!customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM];
    } catch (error) {
      console.error('Error checking entitlement status:', error);
      return false;
    }
  }

  async setUserId(userId: string): Promise<void> {
    if (!this.isNative || !this.isInitialized) return;
    
    try {
      await revenueCatService.setUserId(userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }

  addPurchaseListener(listener: PurchaseListener): void {
    this.listeners.push(listener);
  }

  removePurchaseListener(listener: PurchaseListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
}

export const purchaseService = new PurchaseService();
