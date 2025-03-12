
import { Capacitor } from '@capacitor/core';
import { Product, RevenueCatOfferings } from './types';
import { getMockProducts } from './mockProducts';
import { revenueCatService } from './revenueCatService';

class ProductService {
  private isNative = Capacitor.isNativePlatform();
  private productCache: Product[] = [];

  async getProducts(): Promise<Product[]> {
    if (!this.isNative) {
      return getMockProducts();
    }
    
    if (this.productCache.length > 0) {
      return this.productCache;
    }
    
    try {
      // Fetch offerings from RevenueCat
      const offeringsResult = await revenueCatService.getOfferings();
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
      console.error('Error getting products:', error);
      // Fall back to mock products
      this.productCache = getMockProducts();
      return this.productCache;
    }
  }

  clearCache(): void {
    this.productCache = [];
  }
}

export const productService = new ProductService();
