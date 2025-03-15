
import { 
  Product, 
  Purchase, 
  VerificationResult,
  ProductType
} from './in-app-purchase/types';
import { productService } from './in-app-purchase/productService';
import { purchaseService } from './in-app-purchase/purchaseService';

export { PRODUCT_IDS } from './in-app-purchase/types';
export type { Product, Purchase, VerificationResult, ProductType } from './in-app-purchase/types';

// This is the main service that delegates to more specialized services
class InAppPurchaseService {
  constructor() {
    // Initialize purchase service on creation
    purchaseService.initialize();
  }

  async getProducts(): Promise<Product[]> {
    return productService.getProducts();
  }

  async purchaseProduct(productId: string): Promise<Purchase | null> {
    return purchaseService.purchaseProduct(productId);
  }

  async verifyPurchase(purchase: Purchase, userId: string): Promise<VerificationResult> {
    return purchaseService.verifyPurchase(purchase, userId);
  }

  async restorePurchases(): Promise<Purchase[]> {
    return purchaseService.restorePurchases();
  }

  async checkEntitlementStatus(): Promise<boolean> {
    return purchaseService.checkEntitlementStatus();
  }

  async setUserId(userId: string): Promise<void> {
    return purchaseService.setUserId(userId);
  }

  async presentPaywall(offeringId?: string): Promise<boolean> {
    return purchaseService.presentPaywall(offeringId);
  }

  addPurchaseListener(listener: (purchase: Purchase) => void): void {
    purchaseService.addPurchaseListener(listener);
  }

  removePurchaseListener(listener: (purchase: Purchase) => void): void {
    purchaseService.removePurchaseListener(listener);
  }
}

// Export a singleton instance
export const inAppPurchaseService = new InAppPurchaseService();
