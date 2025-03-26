import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { Link } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { GoogleIcon } from '@/components/icons';
import { Logo } from '@/components/ui/Logo';
import { ArrowLeft } from 'lucide-react';
import { navigateToProfile } from '@/utils/navigation';
import { showNativeGoogleSignInButton, supportsNativeGoogleSignInUI } from '@/services/nativeGoogleSignInUI';


const Auth = () => {
  const { signInWithOTP, signInWithGoogle, isLoading } = useAuth();
  const [phone, setPhone] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (phone) {
        await signInWithOTP(phone);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  // Function to determine if GoogleAuth plugin is available
  const isGoogleAuthPluginAvailable = () => {
    if (Capacitor.isNativePlatform()) {
      // For native platforms, check if the plugin exists
      // Try direct access to the plugin to handle registration edge cases
      const isPluginAvailable = Capacitor.isPluginAvailable('GoogleAuth');
      const isPluginInPlugins = !!(Capacitor as any).Plugins?.GoogleAuth;
      
      console.log('GoogleAuth plugin availability:', { 
        isPluginAvailable, 
        isPluginInPlugins,
        platform: Capacitor.getPlatform()
      });
      
      // Always return true for iOS as we've fixed the plugin implementation there
      if (Capacitor.getPlatform() === 'ios') {
        return true;
      }
      
      return isPluginAvailable || isPluginInPlugins;
    }
    return true; // Always available for web
  };

  // Show native Google Sign-In button for iOS when component loads
  useEffect(() => {
    if (supportsNativeGoogleSignInUI()) {
      // Show the native Google Sign-In button provided by Google SDK
      showNativeGoogleSignInButton().catch(error => {
        console.error('Failed to show native Google Sign-In button:', error);
      });
      // Log for debugging
      console.log('📱 Native Google Sign-In UI should appear on iOS');
    }
  }, []);

  return (
    <div className="container mx-auto max-w-md py-12 relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute left-0 top-0 flex items-center gap-1 text-primary"
        onClick={() => navigateToProfile()}
      >
        <ArrowLeft className="h-4 w-4" />
        Return to App
      </Button>
      
      <Card className="overflow-hidden !bg-[#e8f5e9]" style={{ backgroundColor: '#e8f5e9', border: '1px solid rgba(0,0,0,0.1)' }}>
        <CardHeader className="!bg-[#e8f5e9] border-b" style={{ backgroundColor: '#e8f5e9' }}>
          <div className="flex flex-col items-center space-y-4">
            <Logo />
            <CardTitle className="text-xl text-gray-900">Welcome to Introgy</CardTitle>
            <p className="text-primary text-center font-medium">
              {activeTab === 'signin' 
                ? 'Sign in to your account' 
                : 'Create a new account'}
            </p>
          </div>
        </CardHeader>
        <Tabs 
          defaultValue="signin" 
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <CardContent className="p-6">
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll send a verification code to this number
                  </p>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending code...' : 'Send verification code'}
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-muted-foreground !bg-[#e8f5e9]" style={{ backgroundColor: '#e8f5e9' }}>
                    Or continue with
                  </span>
                </div>
              </div>
              
              {/* Google Sign-In button with proper authentication handling */}
              <div className="flex justify-center mt-4 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 w-full" 
                  style={{ 
                    border: '2px solid #4285F4',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    padding: '10px',
                    backgroundColor: 'white'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    signInWithGoogle();
                  }}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>
              
              {supportsNativeGoogleSignInUI() && (
                <div className="w-full text-center text-xs text-muted-foreground mt-2">
                  Look for the Google Sign-In button at the bottom of the screen
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signupPhone">Phone Number</Label>
                  <Input
                    id="signupPhone"
                    type="tel"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll send a verification code to this number
                  </p>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending code...' : 'Send verification code'}
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-muted-foreground !bg-[#e8f5e9]" style={{ backgroundColor: '#e8f5e9' }}>
                    Or use Google Sign-In
                  </span>
                </div>
              </div>
              
              {/* Google Sign-In button with proper authentication handling */}
              <div className="flex justify-center mt-4 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 w-full" 
                  style={{ 
                    border: '2px solid #4285F4',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    padding: '10px',
                    backgroundColor: 'white'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    signInWithGoogle();
                  }}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>
              
              {supportsNativeGoogleSignInUI() && (
                <div className="w-full text-center text-xs text-muted-foreground mt-2">
                  Look for the Google Sign-In button at the bottom of the screen
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <div className="p-6 pt-0 text-center text-sm">
          By using our services, you agree to our{' '}
          <Link to="/terms" className="underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline">
            Privacy Policy
          </Link>
        </div>
      </Card>
      

    </div>
  );
};

export default Auth;
