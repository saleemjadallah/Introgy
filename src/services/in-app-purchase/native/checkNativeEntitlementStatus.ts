
import { 
  CustomerInfo,
  ENTITLEMENTS
} from '../types';
import { revenueCatService } from '../revenueCatService';

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
