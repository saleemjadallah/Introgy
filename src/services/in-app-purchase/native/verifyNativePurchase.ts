
import { 
  Purchase, 
  CustomerInfo,
  VerificationResult,
  ENTITLEMENTS
} from '../types';
import { revenueCatService } from '../revenueCatService';
import { verifyPurchase } from '../purchaseVerification';
import { processCustomerInfo } from '../purchaseVerification';

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
