
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Outlet } from "react-router-dom";
import SocialBatteryShowcase from "./pages/SocialBatteryShowcase";
import SocialNavigation from "./pages/SocialNavigation";
import Home from "./pages/Home";
import WellbeingShowcase from "./pages/WellbeingShowcase";

// Simple RootLayout component
const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="social-battery" element={<SocialBatteryShowcase />} />
          <Route path="social-navigation" element={<SocialNavigation />} />
          <Route path="connection-builder" element={<ConnectionBuilderShowcase />} />
          <Route path="wellbeing" element={<WellbeingShowcase />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
