
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Battery, BatteryFull, 
  Users, UserRound,
  Brain, Sparkles, 
  LineChart, BarChart3, 
  Home, HomeIcon, 
  User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { Logo } from "@/components/ui/Logo";
import { Footer } from "@/components/ui/Footer";
import { AnimatedTabBar } from "@/components/animations/AnimatedTabBar";
import { AnimatedTransition } from "@/components/animations/AnimatedTransition";
import { motion } from "framer-motion";
import { triggerHapticFeedback } from "@/lib/animationUtils";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const NavItem = ({
    to,
    icon: Icon,
    label
  }: {
    to: string;
    icon: React.ElementType;
    label: string;
  }) => {
    const isActive = location.pathname === to;
    return <Link to={to} className="w-full">
        <Button variant="ghost" className={cn("w-full justify-start gap-2", isActive ? "bg-accent" : "hover:bg-accent/50")}>
          <Icon size={18} />
          <span>{label}</span>
        </Button>
      </Link>;
  };

  return <div className="min-h-screen app-background-gradient flex flex-col">
      <motion.header 
        className="flex items-center justify-between px-[12px] py-[14px] backdrop-blur-md bg-transparent z-20 sticky top-0"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex-1"></div>
        <motion.div 
          className="flex justify-center flex-1"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Logo />
        </motion.div>
        <div className="flex items-center justify-end flex-1">
          <motion.div whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.05 }}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative rounded-full" 
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                triggerHapticFeedback();
              }}
            >
              <UserAvatar />
            </Button>
          </motion.div>
          {isProfileOpen && <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />}
        </div>
      </motion.header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-64 border-r p-3 hidden md:block">
          <div className="space-y-1">
            <NavItem to="/" icon={Home} label="Home" />
            <NavItem to="/social-battery" icon={Battery} label="Social Battery" />
            <NavItem to="/social-navigation" icon={Users} label="Social Navigation" />
            <NavItem to="/connection-builder" icon={Brain} label="Connection Builder" />
            <NavItem to="/wellbeing" icon={LineChart} label="Wellbeing" />
            <NavItem to="/profile" icon={User} label="My Profile" />
          </div>
        </nav>

        {/* Mobile Tab Bar with Animation */}
        <AnimatedTabBar 
          className="md:hidden z-10 bg-white/70 dark:bg-gray-900/70" 
          value={location.pathname}
          onChange={(path) => {
            triggerHapticFeedback();
            navigate(path);
          }}
          items={[
            {
              icon: <Home size={26} />,
              activeIcon: <HomeIcon size={26} />,
              label: "Home",
              value: "/"
            },
            {
              icon: <Battery size={26} />,
              activeIcon: <BatteryFull size={26} />,
              label: "Battery",
              value: "/social-battery"
            },
            {
              icon: <Users size={26} />,
              activeIcon: <UserRound size={26} />,
              label: "Social",
              value: "/social-navigation"
            },
            {
              icon: <Brain size={26} />,
              activeIcon: <Sparkles size={26} />,
              label: "Connect",
              value: "/connection-builder"
            },
            {
              icon: <LineChart size={26} />,
              activeIcon: <BarChart3 size={26} />,
              label: "Wellbeing",
              value: "/wellbeing"
            }
          ]}
        />

        <AnimatedTransition type="slide" transitionKey={location.pathname}>
          <main className="flex-1 overflow-x-hidden overflow-y-auto px-1 py-4 pb-28 md:px-4 md:pb-4 flex flex-col">
            <div className="w-full max-w-screen-lg mx-auto">
              <Outlet />
              <Footer />
            </div>
          </main>
        </AnimatedTransition>
      </div>
    </div>;
};

export default Layout;
