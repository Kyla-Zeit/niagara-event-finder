import { Menu, Bell, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const Map = () => (
  <div className="min-h-screen bg-background max-w-lg mx-auto relative">
    <div className="px-5 pt-12 pb-4">
      <div className="flex items-center justify-between mb-5">
        <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-display font-bold text-gradient">
          Map
        </motion.h1>
        <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center relative">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 gradient-primary rounded-full" />
        </button>
      </div>
    </div>

    <div className="px-5 pb-28">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-display font-bold">Events map</div>
            <div className="text-xs text-muted-foreground">Pin events by location.</div>
          </div>
        </div>

        <div className="h-64 w-full rounded-2xl bg-muted/40 border border-border flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-medium">Map placeholder</div>
            <div className="text-xs text-muted-foreground mt-1">Map integration goes here later.</div>
          </div>
        </div>
      </motion.div>
    </div>

    <BottomNav />
  </div>
);

export default Map;
