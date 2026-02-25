import { Menu, Bell, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const Tickets = () => (
  <div className="min-h-screen bg-background max-w-lg mx-auto relative">
    <div className="px-5 pt-12 pb-4">
      <div className="flex items-center justify-between mb-5">
        <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-display font-bold text-gradient">
          Tickets
        </motion.h1>
        <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center relative">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 gradient-primary rounded-full" />
        </button>
      </div>
    </div>

    <div className="px-5 pb-28">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Ticket className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-display font-bold">Your tickets</div>
            <div className="text-xs text-muted-foreground">Saved + purchased events will show up here.</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Nothing here yet. This page is ready for your “save/buy” flow.
        </div>
      </motion.div>
    </div>

    <BottomNav />
  </div>
);

export default Tickets;
