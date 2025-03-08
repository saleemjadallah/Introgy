
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signin" ? "signin" : "signup";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
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
    // Update the mode when the search param changes
    const newMode = searchParams.get("mode") === "signin" ? "signin" : "signup";
    setMode(newMode);
  }, [searchParams]);
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    } else {
      newErrors.email = "";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else {
      newErrors.password = "";
    }
    
    // Additional validations for signup mode
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Simulate authentication
    if (mode === "signin") {
      // Sign in logic would go here in a real app
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
        duration: 3000,
      });
    } else {
      // Sign up logic would go here in a real app
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
        duration: 3000,
      });
    }
    
    // Redirect to profile page after successful authentication
    navigate("/profile");
  };
  
  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
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
                
                <Button type="submit" className="w-full">
                  Sign In
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
                
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </TabsContent>
            </form>
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
