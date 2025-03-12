
import { CustomerInfo, Purchase, VerificationResult } from './types';

/**
 * Converts RevenueCat CustomerInfo to our Purchase objects
 */
export function convertCustomerInfoToPurchases(
  customerInfo: CustomerInfo, 
  platform: 'ios' | 'android' | 'web'
): Purchase[] {
  try {
    if (!customerInfo.activeSubscriptions || customerInfo.activeSubscriptions.length === 0) {
      return [];
    }
    
    return customerInfo.activeSubscriptions.map(productId => {
      return {
        productId,
        transactionId: `revenuecat-${Date.now()}`,
        timestamp: Date.now(),
        platform: platform === 'web' ? undefined : platform
      };
    });
  } catch (err) {
    console.error('Error converting customer info to purchases:', err);
    return [];
  }
}
