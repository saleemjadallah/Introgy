import { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

export const DebugCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  
  useEffect(() => {
    // Parse URL parameters
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    // Try to parse any state parameter from the URL
    let stateObject = {};
    try {
      const stateFromQuery = urlParams.get('state') || hashParams.get('state');
      if (stateFromQuery) {
        stateObject = JSON.parse(decodeURIComponent(stateFromQuery));
      }
    } catch (e) {
      console.error('Failed to parse state parameter:', e);
    }
    
    // Get stored auth debug info
    const storedInfo = {
      auth_platform: localStorage.getItem('auth_platform'),
      auth_redirect_url: localStorage.getItem('auth_redirect_url'),
      auth_start_time: localStorage.getItem('auth_start_time'),
      auth_in_progress: localStorage.getItem('auth_in_progress')
    };
    
    // Compile all debug information
    const info = {
      timestamp: new Date().toISOString(),
      url: currentUrl,
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      queryParams: Object.fromEntries(urlParams.entries()),
      hashParams: Object.fromEntries(hashParams.entries()),
      stateObject,
      storedAuthInfo: storedInfo,
      isNative: Capacitor.isNativePlatform(),
      platform: Capacitor.getPlatform(),
      userAgent: navigator.userAgent
    };
    
    console.log('Debug callback info:', info);
    setDebugInfo(info);
    
    // Show toast with basic debug info
    toast.info(`Callback received at ${info.pathname}`);
  }, [location]);
  
  const copyDebugInfo = () => {
    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
      .then(() => toast.success('Debug info copied to clipboard'))
      .catch(err => toast.error(`Failed to copy: ${err.message}`));
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Auth Debug Info</h1>
        <p className="text-muted-foreground">Detailed information about the callback request</p>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">URL Information</h2>
        <p className="text-sm break-all">{debugInfo.url}</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <h3 className="text-sm font-medium">Pathname</h3>
            <p className="text-xs">{debugInfo.pathname}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Platform</h3>
            <p className="text-xs">{debugInfo.isNative ? `Native (${debugInfo.platform})` : 'Web'}</p>
          </div>
        </div>
      </div>
      
      {(debugInfo.queryParams && Object.keys(debugInfo.queryParams).length > 0) && (
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Query Parameters</h2>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(debugInfo.queryParams, null, 2)}
          </pre>
        </div>
      )}
      
      {(debugInfo.hashParams && Object.keys(debugInfo.hashParams).length > 0) && (
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Hash Parameters</h2>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(debugInfo.hashParams, null, 2)}
          </pre>
        </div>
      )}
      
      {(debugInfo.stateObject && Object.keys(debugInfo.stateObject).length > 0) && (
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">State Object</h2>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(debugInfo.stateObject, null, 2)}
          </pre>
        </div>
      )}
      
      {(debugInfo.storedAuthInfo && Object.values(debugInfo.storedAuthInfo).some(Boolean)) && (
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Stored Auth Info</h2>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(debugInfo.storedAuthInfo, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="flex space-x-4">
        <Button onClick={copyDebugInfo}>
          Copy Debug Info
        </Button>
        <Button variant="outline" onClick={() => navigate('/auth')}>
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default DebugCallback;
