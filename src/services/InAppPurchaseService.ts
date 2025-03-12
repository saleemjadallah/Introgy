
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
      
      // For development, we'll simulate some basic products
      this.productCache = this.getMockProducts();
    }
  }

  // Get all available products
  async getProducts(): Promise<Product[]> {
    if (!this.isNative) {
      return this.getMockProducts();
    }
    
    // Since we don't have a real plugin right now, use mock data
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

    // Since we don't have a real plugin, simulate a purchase for now
    console.log('Simulating purchase for product:', productId);
    
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
      // In a real implementation, we would call our edge function to verify
      // Since we don't have the plugin installed, simulate a successful verification
      console.log('Simulating purchase verification for', purchase.productId);
      
      const planType = purchase.productId.includes('yearly') ? 'yearly' : 'monthly';
      const expiresAt = new Date();
      if (planType === 'yearly') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }
      
      // Store the purchase in the database
      const { data, error } = await supabase.rpc('upgrade_to_premium', { 
        plan_type: planType 
      });
      
      if (error) {
        console.error('Error storing purchase in database:', error);
        return {
          success: false,
          planType: 'monthly',
          expiresAt: new Date().toISOString(),
          error: error.message
        };
      }
      
      return {
        success: true,
        planType: planType,
        expiresAt: expiresAt.toISOString(),
        error: undefined
      };
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
    
    // Since we don't have a real plugin, just simulate for now
    console.log('Simulating restore purchases');
    
    try {
      // Check if user has an active subscription in the database
      const { data, error } = await supabase
        .from('premium_subscriptions')
        .select('*')
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error || !data) {
        console.log('No active subscription found');
        return [];
      }
      
      // Create a simulated purchase based on the found subscription
      const restoredPurchase: Purchase = {
        productId: data.plan_type === 'yearly' ? PRODUCT_IDS.PREMIUM_YEARLY : PRODUCT_IDS.PREMIUM_MONTHLY,
        transactionId: `restored-${Date.now()}`,
        timestamp: new Date(data.created_at).getTime(),
        platform: this.platform as 'ios' | 'android'
      };
      
      // Notify listeners about the restored purchase
      this.listeners.forEach(listener => listener(restoredPurchase));
      
      return [restoredPurchase];
    } catch (err) {
      console.error('Error restoring purchases:', err);
      return [];
    }
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
