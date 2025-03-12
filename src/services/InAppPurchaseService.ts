
import { Capacitor } from '@capacitor/core';
import { Product, Purchase, VerificationResult, PurchaseListener } from './in-app-purchase/types';
import { getMockProducts } from './in-app-purchase/mockProducts';
import { verifyPurchase } from './in-app-purchase/purchaseVerification';
import { restorePurchases } from './in-app-purchase/purchaseRestoration';

export { PRODUCT_IDS } from './in-app-purchase/types';
export type { Product, Purchase, VerificationResult, ProductType } from './in-app-purchase/types';

class InAppPurchaseService {
  private isNative = Capacitor.isNativePlatform();
  private productCache: Product[] = [];
  private listeners: PurchaseListener[] = [];
  private platform: 'ios' | 'android' | 'web' = 'web';

  constructor() {
    console.log('InAppPurchaseService initialized, native:', this.isNative);
    
    if (this.isNative) {
      if (Capacitor.getPlatform() === 'ios') {
        this.platform = 'ios';
      } else if (Capacitor.getPlatform() === 'android') {
        this.platform = 'android';
      }
      
      this.productCache = getMockProducts();
    }
  }

  async getProducts(): Promise<Product[]> {
    if (!this.isNative) {
      return getMockProducts();
    }
    
    if (this.productCache.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
      this.productCache = getMockProducts();
    }
    
    return this.productCache;
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

    console.log('Simulating purchase for product:', productId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const purchase = {
      productId,
      transactionId: `transaction-${Date.now()}`,
      timestamp: Date.now(),
      receipt: `receipt-${Date.now()}`,
      platform: this.platform as 'ios' | 'android'
    };
    
    this.listeners.forEach(listener => listener(purchase));
    return purchase;
  }

  async verifyPurchase(purchase: Purchase, userId: string): Promise<VerificationResult> {
    return verifyPurchase(purchase, userId, this.platform);
  }

  async restorePurchases(): Promise<Purchase[]> {
    if (!this.isNative) {
      console.log('Restore attempted in non-native environment');
      return [];
    }
    
    console.log('Simulating restore purchases');
    const purchases = await restorePurchases(this.platform);
    purchases.forEach(purchase => this.listeners.forEach(listener => listener(purchase)));
    return purchases;
  }

  addPurchaseListener(listener: PurchaseListener): void {
    this.listeners.push(listener);
  }

  removePurchaseListener(listener: PurchaseListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
}

export const inAppPurchaseService = new InAppPurchaseService();
