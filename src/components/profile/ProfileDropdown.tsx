
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserAvatar } from "./UserAvatar";
import { 
  User, 
  Settings, 
  LogOut, 
  HelpCircle, 
  Award,
  Shield,
  Bell,
  BellOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getRecentlyEarnedBadges } from "@/data/badgesData";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown = ({ isOpen, onClose }: ProfileDropdownProps) => {
  const { user, signOut, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const recentBadges = getRecentlyEarnedBadges(7); // badges earned in the last 7 days
  const hasNewBadges = recentBadges.length > 0;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const toggleNotifications = () => {
    setNotifications(!notifications);
    toast(notifications ? "Notifications disabled" : "Notifications enabled", {
      duration: 2000,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-16 right-4 w-72 bg-card rounded-lg border shadow-lg z-50 overflow-hidden"
    >
      {!isAuthenticated ? (
        <div className="divide-y divide-border">
          <div className="p-4 text-center">
            <h3 className="font-medium text-lg mb-2">Welcome to Introgy</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sign in to track your social battery and access personalized features
            </p>
            <div className="space-y-2">
              <Link to="/auth?mode=signin" className="block w-full">
                <Button variant="default" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?mode=signup" className="block w-full">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            <Link to="/faq" className="flex items-center gap-2 text-sm p-2 hover:bg-accent rounded-md">
              <HelpCircle size={18} />
              <span>FAQ & Help</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <UserAvatar size="lg" showStatus status="online" />
              <div>
                <h3 className="font-medium">{user?.user_metadata?.display_name || 'User'}</h3>
                <p className="text-sm text-muted-foreground">{user?.email || user?.phone || ''}</p>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            <Link to="/profile" className="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md">
              <User size={18} />
              <span>My Profile</span>
            </Link>
            
            <Link to="/profile?tab=badges" className="flex items-center justify-between p-2 text-sm hover:bg-accent rounded-md">
              <div className="flex items-center gap-2">
                <Award size={18} />
                <span>Badges & Achievements</span>
              </div>
              {hasNewBadges && (
                <Badge variant="default" className="text-xs">
                  {recentBadges.length} new
                </Badge>
              )}
            </Link>
            
            <Link to="/profile?tab=settings" className="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md">
              <Settings size={18} />
              <span>Settings</span>
            </Link>
            
            <Link to="/profile?tab=privacy" className="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md">
              <Shield size={18} />
              <span>Privacy & Data</span>
            </Link>
          </div>
          
          <div className="p-2 space-y-1">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2 text-sm">
                {notifications ? <Bell size={18} /> : <BellOff size={18} />}
                <span>Notifications</span>
              </div>
              <Switch checked={notifications} onCheckedChange={toggleNotifications} />
            </div>
          </div>
          
          <div className="p-2">
            <Link to="/faq" className="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md">
              <HelpCircle size={18} />
              <span>FAQ & Help</span>
            </Link>
            
            <button 
              className="flex items-center gap-2 p-2 text-sm hover:bg-accent rounded-md w-full text-left text-destructive"
              onClick={handleSignOut}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
