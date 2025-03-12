
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhoneAuthForm } from "@/components/auth/PhoneAuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithGoogle, isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    // Check if there's an error in URL params (from OAuth redirect)
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      console.error("Auth error:", error, errorDescription);
      toast.error(errorDescription || "Failed to authenticate. Please try again.");
    }
    
    // Set mode based on URL query parameter
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup') {
      setMode('signup');
    }
  }, [searchParams]);
  
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/profile');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const handleGoogleSignIn = async () => {
    try {
      console.log("Initiating Google sign in from Auth page");
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-md mx-auto py-10 px-4 flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

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
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === "signin" 
              ? "Sign in with your phone number to continue" 
              : "Sign up with your phone number to get started"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <PhoneAuthForm mode={mode} />
          
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
            onClick={handleGoogleSignIn}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
              <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
              <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
              <path d="M24.48 9.49932C28.0949 9.44641 31.5951 10.7339 34.3291 13.0973L41.1311 6.24523C36.7339 2.0453 30.6549 -0.279182 24.48 0.0159671C15.4055 0.0159671 7.10718 5.13073 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
          
          <div className="text-center text-sm mt-4">
            {mode === "signin" ? (
              <p>
                Don't have an account?{" "}
                <button 
                  onClick={() => setMode("signup")}
                  className="underline text-primary font-medium"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button 
                  onClick={() => setMode("signin")}
                  className="underline text-primary font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
