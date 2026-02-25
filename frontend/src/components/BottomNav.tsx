import { Home, Ticket, MapPin, User, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

interface BottomNavProps {
  // Optional: if you still pass these somewhere, it won't break.
  active?: string;
  onNavigate?: (tab: string) => void;
}

const tabs = [
  { id: "home", icon: Home, label: "Home", path: "/" },
  { id: "tickets", icon: Ticket, label: "Tickets", path: "/tickets" },
  { id: "map", icon: MapPin, label: "Map", path: "/map" },
  { id: "favorites", icon: Heart, label: "Saved", path: "/favorites" },
  { id: "profile", icon: User, label: "Profile", path: "/profile" },
] as const;

const pathToTab = (pathname: string) => {
  if (pathname.startsWith("/tickets")) return "tickets";
  if (pathname.startsWith("/map")) return "map";
  if (pathname.startsWith("/favorites")) return "favorites";
  if (pathname.startsWith("/profile")) return "profile";
  return "home";
};

const BottomNav = ({ active, onNavigate }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = active ?? pathToTab(location.pathname);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-nav-bg/95 backdrop-blur-xl border-t border-border safe-bottom z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onNavigate?.(tab.id);
                navigate(tab.path);
              }}
              className="relative flex flex-col items-center gap-1 py-2 px-4 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-6 h-0.5 gradient-primary rounded-full"
                />
              )}

              <tab.icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
