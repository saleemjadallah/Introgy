
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Index";  // Changed from @/pages/Home to @/pages/Index
import SocialBattery from "@/pages/SocialBattery";
import SocialNavigation from "@/pages/SocialNavigation";
import ConnectionBuilder from "@/pages/ConnectionBuilder";
import Wellbeing from "@/pages/Wellbeing";
import Profile from "@/pages/Profile";
import Auth from "@/pages/Auth";
import AuthTest from "@/pages/AuthTest";
import AuthDebug from "@/pages/AuthDebug";
import FAQ from "@/pages/FAQ";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import { AuthCallback } from "@/components/auth/callback/AuthCallback";
import { DebugCallback } from "@/components/auth/callback/DebugCallback";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth";
import { PremiumProvider } from "@/contexts/premium";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DeepLinkHandler from "@/components/DeepLinkHandler";
import useGoogleAuth from "@/hooks/useGoogleAuth";

// Create a client
const queryClient = new QueryClient();

// Custom GoogleAuthProvider to prevent circular dependency
const GoogleAuthProvider = ({ children }: { children: React.ReactNode }) => {
  // This hook will set up deep link listeners and handle auth callbacks
  useGoogleAuth();
  return <>{children}</>;
};

function App() {
  return (
    // Place Router as the outermost wrapper so that useNavigate and other router hooks work in the providers
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GoogleAuthProvider>
            <PremiumProvider>
              <DeepLinkHandler />
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/test" element={<AuthTest />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/google/callback" element={<AuthCallback />} />
                <Route path="/web-callback-test.html" element={<AuthCallback />} />
                <Route path="/callback" element={<AuthCallback />} />
                <Route path="/api/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/v1/callback" element={<AuthCallback />} />
                {/* Routes for handling redirects from introgy.ai domain */}
                <Route path="/introgy.ai/auth/callback" element={<AuthCallback />} />
                <Route path="/introgy.ai/auth/google/callback" element={<AuthCallback />} />
                <Route path="/introgy.ai" element={<AuthCallback />} />
                <Route path="/introgy.ai/*" element={<AuthCallback />} />
                <Route path="/auth/debug" element={<AuthDebug />} />
                <Route path="/auth/debug-callback" element={<DebugCallback />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="social-battery" element={<SocialBattery />} />
                  <Route path="social-navigation" element={<SocialNavigation />} />
                  <Route path="connection-builder" element={<ConnectionBuilder />} />
                  <Route path="wellbeing" element={<Wellbeing />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="faq" element={<FAQ />} />
                </Route>
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
              </Routes>
              <Toaster position="top-center" />
            </PremiumProvider>
          </GoogleAuthProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
