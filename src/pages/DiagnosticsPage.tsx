import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/integrations/supabase/client";

export default function DiagnosticsPage() {
  const navigate = useNavigate();
  const [localStorageItems, setLocalStorageItems] = useState<Record<string, string>>({});
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [navHistory, setNavHistory] = useState<string[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<Record<string, string>>({});
  const [errorHistory, setErrorHistory] = useState<any[]>([]);

  // Collect all diagnostic information
  useEffect(() => {
    // Get localStorage items
    const items: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          items[key] = value;
        }
      }
    }
    setLocalStorageItems(items);

    // Get error history
    try {
      const errHistory = JSON.parse(localStorage.getItem('error_history') || '[]');
      setErrorHistory(errHistory);
    } catch (e) {
      setErrorHistory([{ error: 'Failed to parse error history' }]);
    }

    // Check Supabase session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        setSessionInfo({
          hasSession: !!data.session,
          user: data.session?.user ? {
            id: data.session.user.id,
            email: data.session.user.email,
            provider: data.session.user.app_metadata?.provider,
          } : null,
          error: error ? error.message : null
        });
      } catch (err: any) {
        setSessionInfo({
          error: err.message || 'Unknown error checking session'
        });
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkSession();

    // Get device info
    setDeviceInfo({
      platform: Capacitor.getPlatform(),
      isNative: String(Capacitor.isNativePlatform()),
      webViewVersion: (window as any).navigator?.userAgent || 'Unknown',
      screen: `${window.innerWidth}x${window.innerHeight}`,
      devicePixelRatio: String(window.devicePixelRatio),
      language: navigator.language,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      now: new Date().toISOString()
    });

    // Track navigation history
    const trackNavigation = () => {
      setNavHistory(prev => {
        const newHistory = [...prev];
        newHistory.push(window.location.pathname + window.location.search + window.location.hash);
        return newHistory.slice(-10); // Keep last 10 entries
      });
    };
    
    window.addEventListener('popstate', trackNavigation);
    trackNavigation(); // Initial state
    
    return () => {
      window.removeEventListener('popstate', trackNavigation);
    };
  }, []);

  // Function to clear localStorage
  const handleClearStorage = () => {
    localStorage.clear();
    setLocalStorageItems({});
    setErrorHistory([]);
    alert('LocalStorage cleared');
  };

  // Function to retry profile setup
  const handleRetryProfileSetup = () => {
    localStorage.setItem('account_needs_profile_setup', 'true');
    localStorage.setItem('show_profile_onboarding', 'true');
    localStorage.setItem('needs_profile_creation', 'true');
    localStorage.removeItem('profile_setup_complete');
    navigate('/profile');
  };

  // Function to simulate new account setup
  const handleSimulateNewAccount = () => {
    localStorage.setItem('is_new_account', 'true');
    localStorage.setItem('is_new_signup', 'true');
    localStorage.setItem('account_needs_profile_setup', 'true');
    localStorage.setItem('show_profile_onboarding', 'true');
    localStorage.setItem('needs_profile_creation', 'true');
    localStorage.removeItem('profile_setup_complete');
    navigate('/auth/setup');
  };

  // Function to fix profile navigation
  const handleFixNavigation = () => {
    // This will clear any problematic navigation state
    localStorage.removeItem('force_profile_check');
    localStorage.removeItem('account_needs_profile_setup');
    localStorage.setItem('profile_setup_complete', 'true');
    navigate('/', { replace: true });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Diagnostics Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Device Info</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(deviceInfo, null, 2)}
            </pre>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Session Info</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            {isCheckingSession ? (
              <p>Checking session...</p>
            ) : (
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(sessionInfo, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Actions</h2>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md flex flex-wrap gap-2">
          <Button onClick={handleClearStorage} variant="destructive" size="sm">
            Clear LocalStorage
          </Button>
          <Button onClick={handleRetryProfileSetup} variant="outline" size="sm">
            Retry Profile Setup
          </Button>
          <Button onClick={handleSimulateNewAccount} variant="outline" size="sm">
            Simulate New Account
          </Button>
          <Button onClick={handleFixNavigation} variant="outline" size="sm">
            Fix Navigation
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" size="sm">
            Go to Home
          </Button>
          <Button onClick={() => navigate('/profile')} variant="outline" size="sm">
            Go to Profile
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Navigation History</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <ol className="list-decimal pl-5">
            {navHistory.map((path, index) => (
              <li key={index} className="text-sm">
                {path}
              </li>
            ))}
          </ol>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Error History</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          {errorHistory.length === 0 ? (
            <p className="text-gray-500">No errors recorded</p>
          ) : (
            <div className="space-y-4">
              {errorHistory.map((err, idx) => (
                <div key={idx} className="border-l-4 border-red-500 pl-2">
                  <p className="text-xs text-gray-500">{err.timestamp}</p>
                  <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-40">
                    {err.error}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">LocalStorage</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="text-left px-2 py-1">Key</th>
                  <th className="text-left px-2 py-1">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(localStorageItems).map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-300 dark:border-gray-700">
                    <td className="px-2 py-1 font-medium">{key}</td>
                    <td className="px-2 py-1 font-mono overflow-auto">
                      <div className="max-h-20 overflow-y-auto">
                        {value}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}