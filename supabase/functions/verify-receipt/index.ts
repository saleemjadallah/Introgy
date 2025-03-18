
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const revenueCatApiKey = Deno.env.get('REVENUECAT_API_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type VerificationRequest = {
  userId: string;
  appUserId: string;
  platform: 'ios' | 'android';
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, appUserId, platform } = await req.json() as VerificationRequest;
    
    if (!userId || !appUserId || !platform) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Verifying subscription for user ${userId}, RevenueCat appUserId: ${appUserId}`);

    // Verify with RevenueCat API
    const revenueCatHeaders = {
      'Authorization': `Bearer ${revenueCatApiKey}`,
      'Content-Type': 'application/json',
      'X-Platform': platform
    };
    
    const response = await fetch(`https://api.revenuecat.com/v1/subscribers/${appUserId}`, {
      method: 'GET',
      headers: revenueCatHeaders
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RevenueCat API error: ${response.status} ${errorText}`);
    }
    
    const customerInfo = await response.json();
    
    // Check for premium entitlement
    const premiumEntitlement = customerInfo?.subscriber?.entitlements?.premium;
    if (!premiumEntitlement || !premiumEntitlement.active) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No active premium entitlement' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Determine plan type based on product identifier
    const productIdentifier = premiumEntitlement.product_identifier;
    const planType = productIdentifier.includes('yearly') ? 'yearly' : 'monthly';
    
    // Get expiration date
    const expiresAt = premiumEntitlement.expires_date || 
      new Date(Date.now() + 31536000000).toISOString(); // Default to 1 year if no expiration
    
    // Update the premium subscription in the database
    const { data, error } = await supabase
      .from('premium_subscriptions')
      .upsert({
        user_id: userId,
        plan_type: planType,
        is_active: true,
        expires_at: expiresAt,
        payment_id: `revenuecat-${appUserId}`,
        started_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error storing subscription in database:', error);
      throw error;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        planType,
        expiresAt,
        entitlements: customerInfo.subscriber.entitlements
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing verification:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
