
import { Capacitor } from '@capacitor/core';
import { supabase } from "@/integrations/supabase/client";

// Product IDs should match what you configure in App Store/Play Store
export const PRODUCT_IDS = {
  PREMIUM_MONTHLY: 'app.introgy.premium.monthly',
  PREMIUM_YEARLY: 'app.introgy.premium.yearly',
};

export type ProductType = 'monthly' | 'yearly';

export interface Purchase {
  productId: string;
  transactionId: string;
  timestamp: number;
  receipt?: string;
  platform?: 'ios' | 'android';
}

export interface VerificationResult {
  success: boolean;
  planType: ProductType;
  expiresAt: string;
  error?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  priceAsNumber: number;
  currency: string;
  type: ProductType;
}

class InAppPurchaseService {
  private isNative = Capacitor.isNativePlatform();
  private productCache: Product[] = [];
  private listeners: Array<(purchase: Purchase) => void> = [];
  private platform: 'ios' | 'android' | 'web' = 'web';

  constructor() {
    // In a real implementation, this would connect to native plugins
    // and set up event listeners for purchases
    console.log('InAppPurchaseService initialized, native:', this.isNative);
    
    if (this.isNative) {
      // Determine platform
      if (Capacitor.getPlatform() === 'ios') {
        this.platform = 'ios';
      } else if (Capacitor.getPlatform() === 'android') {
        this.platform = 'android';
      }
      
      // In a real implementation, here we would:
      // 1. Initialize the native plugin
      // 2. Set up listeners for purchase events
      // 3. Restore purchases
      
      // For development, we'll simulate some basic products
      this.productCache = this.getMockProducts();
    }
  }

  // Get all available products
  async getProducts(): Promise<Product[]> {
    if (!this.isNative) {
      return this.getMockProducts();
    }
    
    // In a real implementation, we would query the device's app store
    if (this.productCache.length === 0) {
      // For development, simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      this.productCache = this.getMockProducts();
    }
    
    return this.productCache;
  }

  // Purchase a product
  async purchaseProduct(productId: string): Promise<Purchase | null> {
    if (!this.isNative) {
      console.log('Purchase attempted in non-native environment:', productId);
      
      // For testing in browser
      const mockPurchase = {
        productId,
        transactionId: `mock-${Date.now()}`,
        timestamp: Date.now(),
        receipt: `mock-receipt-${Date.now()}`,
        platform: 'ios' as const
      };
      
      // Notify listeners
      this.listeners.forEach(listener => listener(mockPurchase));
      
      return mockPurchase;
    }

    // In a real implementation, we would:
    // 1. Call the native plugin to initiate purchase
    // 2. Handle the purchase flow
    // 3. Return the purchase info when complete
    
    console.log('Initiating purchase for product:', productId);
    
    // For development, simulate a successful purchase
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const purchase = {
      productId,
      transactionId: `transaction-${Date.now()}`,
      timestamp: Date.now(),
      receipt: `receipt-${Date.now()}`,
      platform: this.platform as 'ios' | 'android'
    };
    
    // Notify listeners
    this.listeners.forEach(listener => listener(purchase));
    
    return purchase;
  }

  // Verify purchase with backend
  async verifyPurchase(purchase: Purchase, userId: string): Promise<VerificationResult> {
    try {
      // Call our edge function to verify the purchase
      const { data, error } = await supabase.functions.invoke('verify-purchase', {
        body: {
          userId,
          receipt: purchase.receipt || purchase.transactionId,
          productId: purchase.productId,
          platform: purchase.platform || this.platform
        }
      });
      
      if (error) {
        console.error('Purchase verification error:', error);
        return {
          success: false,
          planType: 'monthly',
          expiresAt: new Date().toISOString(),
          error: error.message
        };
      }
      
      console.log('Purchase verification result:', data);
      return data as VerificationResult;
    } catch (err) {
      console.error('Error during purchase verification:', err);
      return {
        success: false,
        planType: 'monthly',
        expiresAt: new Date().toISOString(),
        error: err.message
      };
    }
  }

  // Restore previous purchases
  async restorePurchases(): Promise<Purchase[]> {
    if (!this.isNative) {
      console.log('Restore attempted in non-native environment');
      return [];
    }
    
    // In a real implementation, we would call the native plugin
    // to restore purchases from the app store
    
    console.log('Restoring purchases');
    
    // For development, return empty array
    return [];
  }

  // Add a purchase listener
  addPurchaseListener(listener: (purchase: Purchase) => void): void {
    this.listeners.push(listener);
  }

  // Remove a purchase listener
  removePurchaseListener(listener: (purchase: Purchase) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Helper for mock data
  private getMockProducts(): Product[] {
    return [
      {
        id: PRODUCT_IDS.PREMIUM_MONTHLY,
        title: 'Premium Monthly',
        description: 'Monthly premium subscription',
        price: '$7.99',
        priceAsNumber: 7.99,
        currency: 'USD',
        type: 'monthly'
      },
      {
        id: PRODUCT_IDS.PREMIUM_YEARLY,
        title: 'Premium Yearly',
        description: 'Yearly premium subscription (save 37%)',
        price: '$59.99',
        priceAsNumber: 59.99,
        currency: 'USD',
        type: 'yearly'
      }
    ];
  }
}

// Export a singleton instance
export const inAppPurchaseService = new InAppPurchaseService();
