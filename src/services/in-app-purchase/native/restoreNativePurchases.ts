
import { 
  Purchase, 
  CustomerInfo
} from '../types';
import { revenueCatService } from '../revenueCatService';
import { convertCustomerInfoToPurchases } from '../customerInfoUtils';

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
