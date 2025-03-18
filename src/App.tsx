
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AuthProvider } from "@/contexts/auth";
import { PremiumProvider } from "@/contexts/premium";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import SocialBattery from "./pages/SocialBattery";
import SocialNavigation from "./pages/SocialNavigation";
import ConnectionBuilder from "./pages/ConnectionBuilder";
import Wellbeing from "./pages/Wellbeing";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import { AuthCallback } from "@/components/auth";
import PaymentSuccess from "./pages/PaymentSuccess";
import CapacitorInit from "./components/capacitor/CapacitorInit";
import { initDeepLinkMessageHandler } from "@/utils/deepLinkHandler";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

function App() {
  // Initialize deep link message handler
  useEffect(() => {
    console.log('App component mounted - initializing deep link handler');
    try {
      initDeepLinkMessageHandler();
      console.log('Deep link message handler initialized successfully');
    } catch (error) {
      console.error('Failed to initialize deep link handler:', error);
    }
  }, []);
  
  // Authentication recovery mechanism
  // This helps recover from cases where the deep link doesn't work properly
  useEffect(() => {
    const checkAuthInProgress = async () => {
      const authInProgress = localStorage.getItem('auth_in_progress');
      const authStartedAt = localStorage.getItem('auth_started_at');
      
      if (authInProgress === 'true' && authStartedAt) {
        const startTime = parseInt(authStartedAt, 10);
        const currentTime = Date.now();
        const minutesPassed = (currentTime - startTime) / (1000 * 60);
        
        // If auth was started in the last 5 minutes, check for a session
        if (minutesPassed < 5) {
          console.log('Detected auth in progress, checking for session');
          try {
            const { data } = await supabase.auth.getSession();
            if (data?.session) {
              console.log('Found active session after auth redirect');
              // Clear the auth in progress flag
              localStorage.removeItem('auth_in_progress');
              localStorage.removeItem('auth_started_at');
              
              // Navigate to the appropriate page
              const userId = data.session.user.id;
              const { data: userResponse } = await supabase
                .from('profiles')
                .select('created_at')
                .eq('id', userId)
                .maybeSingle();
              
              // Calculate time difference in minutes
              const createdTime = new Date(userResponse?.created_at || 0);
              const minutesDiff = (currentTime - createdTime.getTime()) / (1000 * 60);
              
              // If account was created less than 5 minutes ago, consider it new
              if (userResponse && minutesDiff < 5) {
                sessionStorage.setItem("newSignup", "true");
                window.location.href = '/onboarding';
              } else {
                window.location.href = '/profile';
              }
            }
          } catch (error) {
            console.error('Error checking session during recovery:', error);
          }
        } else {
          // Clear old auth in progress flags
          localStorage.removeItem('auth_in_progress');
          localStorage.removeItem('auth_started_at');
        }
      }
    };
    
    // Run the check
    checkAuthInProgress();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <PremiumProvider>
              <CapacitorInit />
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/social-battery" element={<SocialBattery />} />
                  <Route path="/social-navigation" element={<SocialNavigation />} />
                  <Route path="/connection-builder" element={<ConnectionBuilder />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/wellbeing" element={<Wellbeing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PremiumProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
