import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Device } from "@capacitor/device";
import { App } from "@capacitor/app";

export default function AuthDebug() {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  const [deviceInfo, setDeviceInfo] = useState<Record<string, any>>({});
  
  useEffect(() => {
    const collectDebugInfo = async () => {
      try {
        // Gather device and app info
        const deviceInfo = await Device.getInfo();
        const deviceId = await Device.getId();
        const appInfo = await App.getInfo();
        
        // Collect all auth-related data from localStorage
        const localStorageData: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.includes('auth') || 
            key.includes('supabase') || 
            key.includes('google') || 
            key.includes('url') ||
            key.includes('redirect')
          )) {
            try {
              // Try to parse as JSON if possible
              const value = localStorage.getItem(key);
              if (value) {
                try {
                  localStorageData[key] = JSON.parse(value);
                } catch {
                  localStorageData[key] = value;
                }
              }
            } catch (e) {
              localStorageData[key] = `[Error reading: ${e}]`;
            }
          }
        }
        
        // Gather current URL info
        const urlInfo = {
          url: window.location.href,
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          origin: window.location.origin,
          host: window.location.host,
          queryParams: Object.fromEntries(new URLSearchParams(window.location.search).entries()),
          hashParams: Object.fromEntries(new URLSearchParams(window.location.hash.substring(1)).entries()),
        };
        
        // Check if we're in a native app
        const isNative = deviceInfo.platform !== 'web';
        
        // Get current Supabase session if any
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        
        // Organize data for display
        setDebugInfo({
          timestamp: new Date().toISOString(),
          ...urlInfo,
          stateObject: localStorageData.state || {},
          storedAuthInfo: localStorageData,
          isNative,
          platform: deviceInfo.platform,
          userAgent: navigator.userAgent,
          sessionExists: !!session,
          sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
        });
        
        setDeviceInfo({
          ...deviceInfo,
          id: deviceId.identifier, // Use identifier instead of uuid
          ...appInfo
        });
      } catch (error) {
        console.error("Error collecting debug info:", error);
        setDebugInfo({
          error: String(error)
        });
      }
    };
    
    collectDebugInfo();
  }, []);
  
  const handleCopyDebugInfo = () => {
    const debugText = JSON.stringify(debugInfo, null, 2);
    navigator.clipboard.writeText(debugText)
      .then(() => alert("Debug info copied to clipboard!"))
      .catch(err => console.error("Could not copy text: ", err));
  };
  
  const handleRetryAuth = () => {
    // Clear any auth in progress flags
    localStorage.removeItem('auth_in_progress');
    // Navigate back to auth page
    navigate('/auth');
  };
  
  const handleResetAuthState = () => {
    // Clear all auth-related localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('auth') || 
        key.includes('supabase') || 
        key.includes('google')
      )) {
        localStorage.removeItem(key);
      }
    }
    // Reload the page to reflect changes
    window.location.reload();
  };
  
  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug Information</CardTitle>
          <CardDescription>
            This page shows technical details about your authentication process to help troubleshoot issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Device Information</h3>
              <div className="rounded-md bg-secondary p-4 mt-2">
                <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-24">
                  {JSON.stringify(deviceInfo, null, 2)}
                </pre>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium">Authentication State</h3>
              <div className="rounded-md bg-secondary p-4 mt-2">
                <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-64">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium">Troubleshooting Steps</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Check that your device is connected to the internet</li>
                <li>Verify that Google Sign-In is configured correctly</li>
                <li>Make sure the app has correct URL schemes registered</li>
                <li>Restart the app completely and try again</li>
                <li>Check for any error messages in the debug information</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button variant="outline" onClick={handleCopyDebugInfo}>
            Copy Debug Info
          </Button>
          <Button variant="default" onClick={handleRetryAuth}>
            Retry Authentication
          </Button>
          <Button variant="destructive" onClick={handleResetAuthState}>
            Reset Auth State
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
