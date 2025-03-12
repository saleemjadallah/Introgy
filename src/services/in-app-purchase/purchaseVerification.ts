import { supabase } from "@/integrations/supabase/client";
import { Purchase, VerificationResult, CustomerInfo, ENTITLEMENTS } from './types';

export async function verifyPurchase(
  purchase: Purchase, 
  userId: string,
  platform: 'ios' | 'android' | 'web'
): Promise<VerificationResult> {
  try {
    console.log('Verifying purchase for', purchase.productId);
    
    const planType = purchase.productId.includes('yearly') ? 'yearly' : 'monthly';
    const expiresAt = new Date();
    if (planType === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }
    
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

export function processCustomerInfo(customerInfo: CustomerInfo): VerificationResult {
  try {
    // Check if the premium entitlement is active
    const premiumEntitlement = customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM];
    
    if (!premiumEntitlement) {
      return {
        success: false,
        planType: 'monthly',
        expiresAt: new Date().toISOString(),
        error: 'No active premium entitlement'
      };
    }
    
    // Determine plan type based on subscription period
    const planType: 'monthly' | 'yearly' = 
      premiumEntitlement.periodType.includes('annual') ? 'yearly' : 'monthly';
    
    // Get expiration date
    const expiresAt = premiumEntitlement.expirationDate || 
      new Date(Date.now() + 31536000000).toISOString(); // Default to 1 year if no expiration
    
    return {
      success: true,
      planType,
      expiresAt,
      error: undefined
    };
  } catch (err) {
    console.error('Error processing customer info:', err);
    return {
      success: false,
      planType: 'monthly',
      expiresAt: new Date().toISOString(),
      error: err.message
    };
  }
}
