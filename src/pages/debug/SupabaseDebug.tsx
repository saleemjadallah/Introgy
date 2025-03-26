import { SupabaseConfig } from '@/components/debug/SupabaseConfig';

export const SupabaseDebugPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Supabase Debug Information</h1>
      <SupabaseConfig />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Site URL Check</h2>
        <p>
          The Site URL in Supabase should match your production domain. For Google OAuth to work properly,
          the Supabase callback URL must be registered in your Google OAuth console.
        </p>
        <div className="mt-4 p-4 bg-yellow-100 rounded">
          <strong>Current Supabase URL:</strong> https://gnvlzzqtmxrfvkdydxet.supabase.co
        </div>
        <div className="mt-2 p-4 bg-yellow-100 rounded">
          <strong>OAuth Callback URL:</strong> https://gnvlzzqtmxrfvkdydxet.supabase.co/auth/v1/callback
        </div>
      </div>
    </div>
  );
};

export default SupabaseDebugPage;
