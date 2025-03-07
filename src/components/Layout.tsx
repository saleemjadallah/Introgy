
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Moon, Sun, Battery, Users, Brain, LineChart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Layout = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const location = useLocation();

  // Initialize with dark theme (introverts often prefer dark mode)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link to={to} className="w-full">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start gap-2", 
            isActive ? "bg-accent" : "hover:bg-accent/50"
          )}
        >
          <Icon size={18} />
          <span>{label}</span>
        </Button>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">InnerCircle</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-64 border-r p-3 hidden md:block">
          <div className="space-y-1">
            <NavItem to="/" icon={Home} label="Home" />
            <NavItem to="/social-battery" icon={Battery} label="Social Battery" />
            <NavItem to="/social-navigation" icon={Users} label="Social Navigation" />
            <NavItem to="/connection-builder" icon={Brain} label="Connection Builder" />
            <NavItem to="/wellbeing" icon={LineChart} label="Wellbeing" />
          </div>
        </nav>

        {/* Mobile navigation */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-card md:hidden z-10">
          <div className="flex justify-around py-2">
            <Link to="/" className={cn("p-2 rounded-full", location.pathname === "/" && "bg-accent")}>
              <Home size={24} />
            </Link>
            <Link to="/social-battery" className={cn("p-2 rounded-full", location.pathname === "/social-battery" && "bg-accent")}>
              <Battery size={24} />
            </Link>
            <Link to="/social-navigation" className={cn("p-2 rounded-full", location.pathname === "/social-navigation" && "bg-accent")}>
              <Users size={24} />
            </Link>
            <Link to="/connection-builder" className={cn("p-2 rounded-full", location.pathname === "/connection-builder" && "bg-accent")}>
              <Brain size={24} />
            </Link>
            <Link to="/wellbeing" className={cn("p-2 rounded-full", location.pathname === "/wellbeing" && "bg-accent")}>
              <LineChart size={24} />
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 pb-16 md:pb-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
