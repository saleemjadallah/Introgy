
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { PhoneAuthForm } from "@/components/auth/PhoneAuthForm";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signin" ? "signin" : "signup";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const { signIn, signUp, signInWithGoogle, isLoading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    passwordConfirm: "",
  });
  
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    displayName: "",
    passwordConfirm: "",
  });
  
  useEffect(() => {
    const newMode = searchParams.get("mode") === "signin" ? "signin" : "signup";
    setMode(newMode);
  }, [searchParams]);
  
  useEffect(() => {
    // Redirect authenticated users
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    } else {
      newErrors.email = "";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else {
      newErrors.password = "";
    }
    
    if (mode === "signup") {
      if (!formData.displayName) {
        newErrors.displayName = "Display name is required";
        isValid = false;
      } else {
        newErrors.displayName = "";
      }
      
      if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = "Passwords do not match";
        isValid = false;
      } else {
        newErrors.passwordConfirm = "";
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (mode === "signin") {
      await signIn({ email: formData.email, password: formData.password });
    } else {
      await signUp({ 
        email: formData.email, 
        password: formData.password,
        displayName: formData.displayName
      });
    }
  };
  
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(5, strength);
  };
  
  const renderPasswordStrength = () => {
    if (!formData.password) return null;
    
    const strength = calculatePasswordStrength(formData.password);
    let label = "";
    let colorClass = "";
    
    switch (strength) {
      case 0:
      case 1:
        label = "Very weak";
        colorClass = "bg-red-500";
        break;
      case 2:
        label = "Weak";
        colorClass = "bg-orange-500";
        break;
      case 3:
        label = "Moderate";
        colorClass = "bg-yellow-500";
        break;
      case 4:
        label = "Strong";
        colorClass = "bg-green-400";
        break;
      case 5:
        label = "Very strong";
        colorClass = "bg-green-600";
        break;
    }
    
    return (
      <div className="space-y-1 mt-1">
        <div className="flex items-center justify-between text-xs">
          <span>Password strength:</span>
          <span>{label}</span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div className={`h-full ${colorClass}`} style={{ width: `${(strength / 5) * 100}%` }}></div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-6"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Home
      </Button>
      
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {mode === "signin" ? "Sign In" : "Create an Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === "signin" 
              ? "Enter your credentials to access your account"
              : "Sign up for InnerCircle to track your social battery and get personalized insights"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(value) => setMode(value as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <div className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="email" 
                  onClick={() => setAuthMethod("email")}
                  className={authMethod === "email" ? "bg-accent" : ""}
                >
                  Email
                </TabsTrigger>
                <TabsTrigger 
                  value="phone" 
                  onClick={() => setAuthMethod("phone")}
                  className={authMethod === "phone" ? "bg-accent" : ""}
                >
                  Phone
                </TabsTrigger>
              </TabsList>
            </div>
            
            {authMethod === "email" ? (
              <form onSubmit={handleSubmit}>
                <TabsContent value="signin" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password">Password</Label>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground"
                        onClick={() => navigate("/auth/reset-password")}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={16} className="text-muted-foreground" />
                        ) : (
                          <Eye size={16} className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-destructive text-sm">{errors.password}</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={signInWithGoogle}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                      <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                      <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                      <path d="M24.48 9.49932C28.0949 9.44641 31.5951 10.7339 34.3291 13.0973L41.1311 6.24523C36.7339 2.0453 30.6549 -0.279182 24.48 0.0159671C15.4055 0.0159671 7.10718 5.13073 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
                    </svg>
                    Google
                  </Button>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Display Name</Label>
                    <Input
                      id="signup-name"
                      name="displayName"
                      type="text"
                      placeholder="How you want to be known"
                      value={formData.displayName}
                      onChange={handleInputChange}
                    />
                    {errors.displayName && (
                      <p className="text-destructive text-sm">{errors.displayName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={16} className="text-muted-foreground" />
                        ) : (
                          <Eye size={16} className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    {renderPasswordStrength()}
                    {errors.password && (
                      <p className="text-destructive text-sm">{errors.password}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      name="passwordConfirm"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.passwordConfirm}
                      onChange={handleInputChange}
                    />
                    {errors.passwordConfirm && (
                      <p className="text-destructive text-sm">{errors.passwordConfirm}</p>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <button type="button" className="text-primary underline">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" className="text-primary underline">
                      Privacy Policy
                    </button>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={signInWithGoogle}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                      <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                      <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                      <path d="M24.48 9.49932C28.0949 9.44641 31.5951 10.7339 34.3291 13.0973L41.1311 6.24523C36.7339 2.0453 30.6549 -0.279182 24.48 0.0159671C15.4055 0.0159671 7.10718 5.13073 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
                    </svg>
                    Google
                  </Button>
                </TabsContent>
              </form>
            ) : (
              <PhoneAuthForm mode={mode} />
            )}
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => setMode("signin")}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
