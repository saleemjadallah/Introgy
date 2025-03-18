
import { 
  Purchase, 
  RevenueCatOfferings,
  RevenueCatPackage,
  PACKAGE_TYPE,
  PRODUCT_CATEGORY,
  PRODUCT_TYPE,
  SubscriptionOption,
  DEFAULT_INTRO_PRICE
} from '../types';
import { revenueCatService } from '../revenueCatService';

/**
 * Handles native platform in-app purchases via RevenueCat
 */
export async function purchaseNative(
  productId: string, 
  isInitialized: boolean,
  platform: 'ios' | 'android',
  notifyListeners: (purchase: Purchase) => void
): Promise<Purchase | null> {
  if (!isInitialized) {
    await revenueCatService.initialize();
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
    
    // Create a fully-specified subscription option
    const enhancedSubscriptionOption: SubscriptionOption = {
      id: productId,
      storeProductId: productId,
      productId: productId,
      pricingPhases: [],
      tags: [],
      isBasePlan: true,
      billingPeriod: productId.includes('yearly') ? 'P1Y' : 'P1M',
      isPrepaid: false,
      presentedOfferingIdentifier: offerings.offerings.current.identifier
    };
    
    // Ensure product has the correct type properties before purchase
    const enhancedPackage: RevenueCatPackage = {
      ...packageToPurchase,
      product: {
        ...packageToPurchase.product,
        productCategory: PRODUCT_CATEGORY.SUBSCRIPTION,
        productType: PRODUCT_TYPE.AUTO_RENEWABLE_SUBSCRIPTION,
        discounts: packageToPurchase.product.discounts || [],
        subscriptionPeriod: productId.includes('yearly') ? 'P1Y' : 'P1M',
        defaultOption: enhancedSubscriptionOption,
        subscriptionOptions: [enhancedSubscriptionOption],
        // Always provide a valid introPrice
        introPrice: packageToPurchase.product.introPrice || DEFAULT_INTRO_PRICE
      }
    };
    
    // Purchase the package using the correct options structure
    const options = {
      aPackage: enhancedPackage,
      presentedOfferingIdentifier: offerings.offerings.current.identifier
    };
    
    // Use any to bypass type checking since we're deliberately adapting our types
    const purchaseResultData = await revenueCatService.purchasePackage(options as any);
    
    // The result has a different structure than our types indicated
    const purchaseResult = purchaseResultData as unknown as { customerInfo: any; productIdentifier: string };
    
    console.log('RevenueCat purchase successful:', purchaseResult.productIdentifier);
    
    // Create our Purchase object
    const purchase: Purchase = {
      productId: purchaseResult.productIdentifier,
      transactionId: `revenuecat-${Date.now()}`,
      timestamp: Date.now(),
      platform
    };
    
    // Notify listeners
    notifyListeners(purchase);
    
    return purchase;
  } catch (error) {
    console.error('Error purchasing with RevenueCat:', error);
    return null;
  }
}
