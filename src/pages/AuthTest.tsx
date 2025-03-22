import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

const AuthTest = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, isAuthenticated, isLoading } = useAuth();
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [deviceInfo, setDeviceInfo] = useState({
    platform: Capacitor.getPlatform(),
    isNative: Capacitor.isNativePlatform(),
    userAgent: navigator.userAgent,
    hostname: window.location.hostname
  });
  
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    setDebugLogs(prev => [logEntry, ...prev]);
  };
  
  useEffect(() => {
    addLog(`Page loaded. Platform: ${deviceInfo.platform}, isNative: ${deviceInfo.isNative}`);
    
    // Check local storage for previous auth attempts
    const storedRedirectUrl = localStorage.getItem('auth_redirect_url');
    const storedStartTime = localStorage.getItem('auth_start_time');
    const storedPlatform = localStorage.getItem('auth_platform');
    
    if (storedRedirectUrl || storedStartTime || storedPlatform) {
      addLog(`Found previous auth attempt data: 
        - Redirect URL: ${storedRedirectUrl || 'not set'}
        - Start Time: ${storedStartTime || 'not set'}
        - Platform: ${storedPlatform || 'not set'}`);
    }
    
    if (isAuthenticated) {
      addLog('User is already authenticated');
    }
  }, [deviceInfo.isNative, deviceInfo.platform]);
  
  const handleSignIn = async () => {
    try {
      addLog('Starting Google Sign-In process...');
      
      // Clear any previous auth data
      localStorage.removeItem('auth_error');
      localStorage.setItem('auth_test_started', 'true');
      localStorage.setItem('auth_test_time', new Date().toISOString());
      
      toast.info('Starting Google Sign-In...');
      await signInWithGoogle();
      
      addLog('signInWithGoogle function completed without errors');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`Error during sign-in: ${errorMessage}`);
      localStorage.setItem('auth_error', errorMessage);
      toast.error(`Sign-in error: ${errorMessage}`);
    }
  };
  
  const handleClearStorage = () => {
    // Clear auth-related items from localStorage
    const authKeys = [
      'auth_redirect_url', 
      'auth_start_time', 
      'auth_platform', 
      'auth_error', 
      'auth_in_progress',
      'auth_test_started',
      'auth_test_time'
    ];
    
    authKeys.forEach(key => localStorage.removeItem(key));
    addLog('Cleared all auth-related data from localStorage');
    toast.success('Local storage cleared');
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Google Auth Test Page</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
            <CardDescription>Technical details about your environment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2">
                <span className="font-medium">Platform:</span>
                <span>{deviceInfo.platform}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium">Native App:</span>
                <span>{deviceInfo.isNative ? 'Yes' : 'No'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium">Hostname:</span>
                <span>{deviceInfo.hostname}</span>
              </div>
              <div>
                <span className="font-medium">User Agent:</span>
                <p className="text-xs mt-1 break-words">{deviceInfo.userAgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Authentication Tests</CardTitle>
            <CardDescription>Test Google Sign-In functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle>Test Instructions</AlertTitle>
              <AlertDescription>
                Click the button below to start the Google Sign-In process. This will
                redirect you to Google's authentication page. After you complete the
                process, you should be redirected back to this app.
              </AlertDescription>
            </Alert>
            
            {isAuthenticated && (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle>Already Signed In</AlertTitle>
                <AlertDescription>
                  You are currently authenticated. You can still test the sign-in flow
                  again if needed.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="w-full flex space-x-2">
              <Button 
                className="flex-1" 
                onClick={handleSignIn} 
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Test Google Sign-In'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth/debug')}
              >
                Debug Page
              </Button>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleClearStorage}
            >
              Clear Auth Storage
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Debug Logs</CardTitle>
          <CardDescription>Recent authentication activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md h-[300px] overflow-y-auto">
            {debugLogs.length > 0 ? (
              <div className="space-y-2 text-sm font-mono">
                {debugLogs.map((log, i) => (
                  <div key={i} className="text-xs">{log}</div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No log entries yet. Try testing the sign-in flow.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTest;
