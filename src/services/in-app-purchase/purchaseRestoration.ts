
import { supabase } from "@/integrations/supabase/client";
import { Purchase, PRODUCT_IDS, RevenueCatCustomerInfo } from './types';

export async function restorePurchases(platform: 'ios' | 'android' | 'web'): Promise<Purchase[]> {
  try {
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
    
    const restoredPurchase: Purchase = {
      productId: data.plan_type === 'yearly' ? PRODUCT_IDS.PREMIUM_YEARLY : PRODUCT_IDS.PREMIUM_MONTHLY,
      transactionId: `restored-${Date.now()}`,
      timestamp: new Date(data.created_at).getTime(),
      platform: platform === 'web' ? undefined : platform
    };
    
    return [restoredPurchase];
  } catch (err) {
    console.error('Error restoring purchases:', err);
    return [];
  }
}

// Convert RevenueCat customer info to our Purchase type
export function convertCustomerInfoToPurchases(customerInfo: RevenueCatCustomerInfo): Purchase[] {
  try {
    if (!customerInfo.activeSubscriptions || customerInfo.activeSubscriptions.length === 0) {
      return [];
    }
    
    return customerInfo.activeSubscriptions.map(productId => {
      return {
        productId,
        transactionId: `revenuecat-${Date.now()}`,
        timestamp: Date.now(),
        platform: 'ios' // This would be determined in a real implementation
      };
    });
  } catch (err) {
    console.error('Error converting customer info to purchases:', err);
    return [];
  }
}
