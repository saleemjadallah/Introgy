import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';
import { Link } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { GoogleIcon } from '@/components/icons';

const Auth = () => {
  const { signIn, signUp, signInWithGoogle, signInWithOTP, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authType, setAuthType] = useState<'email' | 'phone'>('email');
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authType === 'email') {
        await signIn({ email, password });
      } else {
        if (phone && !password) {
          await signInWithOTP(phone);
        } else {
          await signIn({ phone, password });
        }
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const credentials = authType === 'email' 
        ? { email, password, displayName }
        : { phone, password, displayName };
      await signUp(credentials);
    } catch (error) {
      console.error('Error signing up:', error);
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
    <div className="container mx-auto max-w-md py-12">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary text-white">
          <CardTitle className="text-xl">Welcome to Introgy</CardTitle>
          <CardDescription className="text-primary-foreground">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <CardContent className="p-6">
            <TabsContent value="signin" className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={authType === 'email' ? 'default' : 'outline'}
                  onClick={() => setAuthType('email')}
                  className="flex-1"
                >
                  Email
                </Button>
                <Button
                  type="button"
                  variant={authType === 'phone' ? 'default' : 'outline'}
                  onClick={() => setAuthType('phone')}
                  className="flex-1"
                >
                  Phone
                </Button>
              </div>
              
              <form onSubmit={handleSignIn} className="space-y-4">
                {authType === 'email' ? (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                ) : (
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
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {authType === 'phone' && (
                      <Button
                        type="button"
                        variant="link"
                        className="px-0 font-normal text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          if (phone) {
                            signInWithOTP(phone);
                          }
                        }}
                      >
                        Sign in with OTP instead
                      </Button>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={authType === 'email'}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
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
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={authType === 'email' ? 'default' : 'outline'}
                  onClick={() => setAuthType('email')}
                  className="flex-1"
                >
                  Email
                </Button>
                <Button
                  type="button"
                  variant={authType === 'phone' ? 'default' : 'outline'}
                  onClick={() => setAuthType('phone')}
                  className="flex-1"
                >
                  Phone
                </Button>
              </div>
              
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Name</Label>
                  <Input
                    id="displayName"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                
                {authType === 'email' ? (
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                ) : (
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
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="signupPassword">Password</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
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
