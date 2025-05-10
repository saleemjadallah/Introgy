
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RootLayout from "./RootLayout";
import SocialBatteryShowcase from "./pages/SocialBatteryShowcase";
import SocialNavigationShowcase from "./pages/SocialNavigationShowcase";
import ConnectionBuilderShowcase from "./pages/ConnectionBuilderShowcase";
import WellbeingShowcase from "./pages/WellbeingShowcase";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="social-battery" element={<SocialBatteryShowcase />} />
          <Route path="social-navigation" element={<SocialNavigationShowcase />} />
          <Route path="connection-builder" element={<ConnectionBuilderShowcase />} />
          <Route path="wellbeing" element={<WellbeingShowcase />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
