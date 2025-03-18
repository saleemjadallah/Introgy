
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Index";  // Changed from @/pages/Home to @/pages/Index
import SocialBattery from "@/pages/SocialBattery";
import SocialNavigation from "@/pages/SocialNavigation";
import ConnectionBuilder from "@/pages/ConnectionBuilder";
import Wellbeing from "@/pages/Wellbeing";
import Profile from "@/pages/Profile";
import Auth from "@/pages/Auth";
import FAQ from "@/pages/FAQ";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth";
import { PremiumProvider } from "@/contexts/premium";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PremiumProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
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
          </Router>
        </PremiumProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
