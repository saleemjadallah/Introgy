
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type VerificationRequest = {
  userId: string;
  receipt: string;
  productId: string;
  platform: 'ios' | 'android';
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, receipt, productId, platform } = await req.json() as VerificationRequest;
    
    if (!userId || !receipt || !productId || !platform) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Verifying purchase for user ${userId}, product: ${productId}, platform: ${platform}`);

    // In a production environment, you would verify the receipt with Apple/Google 
    // For iOS: Apple App Store API
    // For Android: Google Play Developer API
    
    // For this implementation, we'll simulate verification
    // In a real app, you would make API calls to the respective app store services
    
    // Determine plan type from product ID
    const planType = productId.includes('yearly') ? 'yearly' : 'monthly';
    
    // Calculate expiration date
    const expiresAt = new Date();
    if (planType === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }
    
    // Store the verified purchase in the database
    const { data, error } = await supabase
      .from('premium_subscriptions')
      .upsert({
        user_id: userId,
        plan_type: planType,
        is_active: true,
        expires_at: expiresAt.toISOString(),
        payment_id: receipt,
        started_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error storing purchase:', error);
      throw error;
    }
    
    console.log(`Purchase verified and stored for user ${userId}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        planType,
        expiresAt: expiresAt.toISOString() 
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
