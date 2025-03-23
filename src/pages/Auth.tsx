
import { useState } from 'react';
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
      return Capacitor.isPluginAvailable('GoogleAuth');
    }
    return true; // Always available for web
  };

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
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-white border-b">
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
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              {isGoogleAuthPluginAvailable() && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={signInWithGoogle}
                  disabled={isLoading}
                >
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Google
                </Button>
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
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              {isGoogleAuthPluginAvailable() && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={signInWithGoogle}
                  disabled={isLoading}
                >
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Google
                </Button>
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
