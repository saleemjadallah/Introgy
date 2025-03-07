
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import SocialBattery from "./pages/SocialBattery";
import SocialNavigation from "./pages/SocialNavigation";
import ConnectionBuilder from "./pages/ConnectionBuilder";
import Wellbeing from "./pages/Wellbeing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/social-battery" element={<SocialBattery />} />
            <Route path="/social-navigation" element={<SocialNavigation />} />
            <Route path="/connection-builder" element={<ConnectionBuilder />} />
            <Route path="/wellbeing" element={<Wellbeing />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
