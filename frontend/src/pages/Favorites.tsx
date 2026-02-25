import { useMemo, useState } from "react";
import { Heart, LogIn, Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import BottomNav from "@/components/BottomNav";
import EventCard from "@/components/EventCard";
import EventDetail from "@/components/EventDetail";
import { Button } from "@/components/ui/button";
import { events, type NiagaraEvent } from "@/data/events";
import { getUser } from "@/lib/auth";
import { useFavoritesApi } from "@/hooks/useFavoritesApi";

export default function Favorites() {
  const navigate = useNavigate();
  const user = getUser();
  const [selectedEvent, setSelectedEvent] = useState<NiagaraEvent | null>(null);

  const { favoritesSet, isLoading } = useFavoritesApi(user ? user.id : null);

  const favoriteEvents = useMemo(() => {
    if (!user) return [];
    return events.filter((e) => favoritesSet.has(String(e.id)));
  }, [favoritesSet, user]);

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-5">
          <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center" onClick={() => navigate("/")}
            aria-label="Back to home">
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-display font-bold text-gradient"
          >
            Saved
          </motion.h1>

          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="px-5 pb-28">
        {!user ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <LogIn className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-display font-bold">Sign in to view favorites</div>
                <div className="text-xs text-muted-foreground">Your saved events will appear here after you sign in.</div>
              </div>
            </div>

            <Button className="w-full mt-4 gradient-primary" onClick={() => navigate("/profile")}>Sign in / Sign up</Button>
          </motion.div>
        ) : isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-muted-foreground text-sm">Loading your favorites…</p>
          </motion.div>
        ) : favoriteEvents.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <div className="font-display font-bold mb-1">No saved events yet</div>
            <div className="text-sm text-muted-foreground">Tap the heart on any event to save it.</div>
            <Button variant="secondary" className="w-full mt-4" onClick={() => navigate("/")}>Browse events</Button>
          </motion.div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-foreground">Your favorites</h2>
              <div className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">{favoriteEvents.length}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {favoriteEvents.map((event, index) => (
                <EventCard key={event.id} event={event} onClick={setSelectedEvent} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />

      <AnimatePresence>
        {selectedEvent && (
          <EventDetail event={selectedEvent} onBack={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
