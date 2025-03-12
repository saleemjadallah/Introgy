
import { supabase } from "@/integrations/supabase/client";
import { Purchase, VerificationResult } from './types';

export async function verifyPurchase(
  purchase: Purchase, 
  userId: string,
  platform: 'ios' | 'android' | 'web'
): Promise<VerificationResult> {
  try {
    console.log('Simulating purchase verification for', purchase.productId);
    
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
