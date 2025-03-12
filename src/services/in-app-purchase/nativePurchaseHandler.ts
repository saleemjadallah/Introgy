
import { 
  Purchase, 
  CustomerInfo, 
  RevenueCatOfferings,
  RevenueCatPackage,
  PurchasePackageOptions,
  PACKAGE_TYPE,
  ENTITLEMENTS,
  PRODUCT_CATEGORY,
  PRODUCT_TYPE,
  SubscriptionOption,
  VerificationResult,
  DEFAULT_INTRO_PRICE
} from './types';
import { revenueCatService } from './revenueCatService';
import { convertCustomerInfoToPurchases } from './customerInfoUtils';
import { verifyPurchase, processCustomerInfo } from './purchaseVerification';

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
    
    // Create a default subscription option
    const defaultSubscriptionOption: SubscriptionOption = {
      id: productId,
      storeProductId: productId,
      productId: productId,
      pricingPhases: []
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
        defaultOption: defaultSubscriptionOption,
        subscriptionOptions: [],
        // Always provide a valid introPrice
        introPrice: packageToPurchase.product.introPrice || DEFAULT_INTRO_PRICE
      }
    };
    
    // Purchase the package using the correct options structure
    const options: PurchasePackageOptions = {
      aPackage: enhancedPackage,
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

/**
 * Verifies a purchase on native platforms using RevenueCat
 */
export async function verifyNativePurchase(
  purchase: Purchase, 
  userId: string, 
  platform: 'ios' | 'android',
  isInitialized: boolean
): Promise<VerificationResult> {
  if (!isInitialized) {
    await revenueCatService.initialize();
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
      await verifyPurchase(purchase, userId, platform);
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

/**
 * Checks entitlement status on native platforms
 */
export async function checkNativeEntitlementStatus(
  isInitialized: boolean
): Promise<boolean> {
  if (!isInitialized) {
    await revenueCatService.initialize();
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

/**
 * Restores purchases on native platforms
 */
export async function restoreNativePurchases(
  isInitialized: boolean,
  platform: 'ios' | 'android',
  notifyListeners: (purchase: Purchase) => void
): Promise<Purchase[]> {
  if (!isInitialized) {
    await revenueCatService.initialize();
  }

  try {
    console.log('Restoring purchases with RevenueCat');
    
    // Restore purchases with RevenueCat
    const restoreResultData = await revenueCatService.restorePurchases();
    const customerInfo = restoreResultData as unknown as CustomerInfo;
    
    // Convert to our Purchase type
    const purchases = convertCustomerInfoToPurchases(customerInfo, platform);
    
    // Notify listeners
    purchases.forEach(purchase => notifyListeners(purchase));
    
    return purchases;
  } catch (error) {
    console.error('Error restoring purchases with RevenueCat:', error);
    return [];
  }
}
