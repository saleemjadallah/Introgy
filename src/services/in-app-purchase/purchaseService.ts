
import { Capacitor } from '@capacitor/core';
import { 
  Purchase, 
  CustomerInfo, 
  PurchaseListener,
  VerificationResult,
  ENTITLEMENTS
} from './types';
import { revenueCatService } from './revenueCatService';
import { verifyPurchase } from './purchaseVerification';
import { restorePurchases } from './purchaseRestoration';
import { ListenerManager } from './listenerManager';
import { 
  purchaseNative, 
  verifyNativePurchase, 
  checkNativeEntitlementStatus,
  restoreNativePurchases
} from './native';

class PurchaseService {
  private isNative = Capacitor.isNativePlatform();
  private platform: 'ios' | 'android' | 'web' = 'web';
  private isInitialized = false;
  private listenerManager = new ListenerManager();

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
          this.handleCustomerInfoUpdate(info);
        });
        
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Error initializing purchase service:', error);
    }
  }

  private handleCustomerInfoUpdate(info: CustomerInfo): void {
    // Convert customer info to purchases
    if (!info.activeSubscriptions || info.activeSubscriptions.length === 0) {
      return;
    }
    
    info.activeSubscriptions.forEach(productId => {
      const purchase = {
        productId,
        transactionId: `revenuecat-${Date.now()}`,
        timestamp: Date.now(),
        platform: this.platform === 'web' ? undefined : this.platform
      };
      this.listenerManager.notifyListeners(purchase);
    });
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
      
      this.listenerManager.notifyListeners(mockPurchase);
      return mockPurchase;
    }

    // For native platforms, we'll use the RevenueCat paywall instead
    // of direct product purchase when possible
    const offeringId = productId.includes('yearly') ? 'premium_yearly' : 'premium_monthly';
    const paywallPresented = await revenueCatService.presentPaywall(offeringId);
    
    if (!paywallPresented) {
      // Fall back to the direct purchase if the paywall can't be presented
      return purchaseNative(
        productId, 
        this.isInitialized, 
        this.platform as 'ios' | 'android',
        this.listenerManager.notifyListeners.bind(this.listenerManager)
      );
    }
    
    // For paywall purchases, we don't return a purchase object
    // as the flow is handled by RevenueCat and we'll receive updates 
    // via the customerInfoUpdateListener
    return null;
  }

  async verifyPurchase(purchase: Purchase, userId: string): Promise<VerificationResult> {
    if (!this.isNative) {
      return verifyPurchase(purchase, userId, this.platform);
    }
    
    return verifyNativePurchase(
      purchase, 
      userId, 
      this.platform as 'ios' | 'android',
      this.isInitialized
    );
  }

  async restorePurchases(): Promise<Purchase[]> {
    if (!this.isNative) {
      console.log('Restore attempted in non-native environment');
      return restorePurchases('web');
    }
    
    return restoreNativePurchases(
      this.isInitialized,
      this.platform as 'ios' | 'android',
      this.listenerManager.notifyListeners.bind(this.listenerManager)
    );
  }

  async checkEntitlementStatus(): Promise<boolean> {
    if (!this.isNative) {
      // For web, check with our backend
      const restoredPurchases = await restorePurchases('web');
      return restoredPurchases.length > 0;
    }
    
    // For native platforms, use RevenueCat's entitlement check
    return revenueCatService.checkEntitlementStatus('premium');
  }

  async setUserId(userId: string): Promise<void> {
    if (!this.isNative || !this.isInitialized) return;
    
    try {
      await revenueCatService.setUserId(userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }

  async presentPaywall(offeringId?: string): Promise<boolean> {
    if (!this.isNative || !this.isInitialized) return false;
    
    try {
      return await revenueCatService.presentPaywall(offeringId);
    } catch (error) {
      console.error('Error presenting paywall:', error);
      return false;
    }
  }

  addPurchaseListener(listener: PurchaseListener): void {
    this.listenerManager.addListener(listener);
  }

  removePurchaseListener(listener: PurchaseListener): void {
    this.listenerManager.removeListener(listener);
  }
}

export const purchaseService = new PurchaseService();
