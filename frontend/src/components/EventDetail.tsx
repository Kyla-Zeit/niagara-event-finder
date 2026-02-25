import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import type { NiagaraEvent } from "@/data/events";
import { getUser } from "@/lib/auth";
import { useFavoritesApi } from "@/hooks/useFavoritesApi";
import { toast } from "@/components/ui/sonner";

interface EventDetailProps {
  event: NiagaraEvent;
  onBack: () => void;
}

const TEMP_FAV_KEY = "niagara:tempFavorites";
const PENDING_KEY = "niagara:pendingFavorite"; // JSON: { eventId, prevSaved, ts }
const NAV_DELAY_MS = 300;

function readTempFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(TEMP_FAV_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr.map(String));
  } catch {
    return new Set();
  }
}

function writeTempFavorites(set: Set<string>) {
  localStorage.setItem(TEMP_FAV_KEY, JSON.stringify(Array.from(set)));
}

function toggleTempFavorite(id: string): boolean {
  const favs = readTempFavorites();
  if (favs.has(id)) {
    favs.delete(id);
    writeTempFavorites(favs);
    return false;
  }
  favs.add(id);
  writeTempFavorites(favs);
  return true;
}

const EventDetail = ({ event, onBack }: EventDetailProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<number | null>(null);

  const user = getUser();
  const { favoritesSet, toggleFavorite, toggling } = useFavoritesApi(user ? user.id : null);

  const id = String(event.id);
  const [saved, setSaved] = useState(false);
  const [pendingNav, setPendingNav] = useState(false);

  useEffect(() => {
    if (user) return;
    const favs = readTempFavorites();
    setSaved(favs.has(id));
  }, [id, user]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleFavorite = () => {
    // Signed in: save to backend (no redirect)
    if (user) {
      const wasSaved = favoritesSet.has(id);
      toggleFavorite(id);
      toast.message(wasSaved ? "Removed" : "Saved");
      return;
    }

    if (pendingNav) return;

    const prevSaved = saved;

    // 1) Toggle + show immediately
    const nextSaved = toggleTempFavorite(id);
    setSaved(nextSaved);

    // 2) Store what to revert to if they back out of Profile
    localStorage.setItem(
      PENDING_KEY,
      JSON.stringify({ eventId: id, prevSaved, ts: Date.now() })
    );

    // 3) Navigate after a tiny delay so user sees it
    setPendingNav(true);
    const from = encodeURIComponent(location.pathname + location.search);
    timerRef.current = window.setTimeout(() => {
      navigate(
        `/profile?intent=favorite&eventId=${encodeURIComponent(id)}&from=${from}`
      );
      setPendingNav(false);
    }, NAV_DELAY_MS);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-background overflow-y-auto"
    >
      {/* Hero Image */}
      <div className="relative h-72">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-12 left-4 w-10 h-10 rounded-full bg-background/40 backdrop-blur-md flex items-center justify-center border border-foreground/10"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        {/* Favorite */}
        <button
          onClick={handleFavorite}
          disabled={pendingNav || toggling}
          className="absolute top-12 right-4 w-10 h-10 rounded-full bg-background/40 backdrop-blur-md flex items-center justify-center border border-foreground/10 active:scale-95 transition-transform disabled:opacity-70"
          aria-label={(user ? favoritesSet.has(id) : saved) ? "Saved" : "Save"}
          aria-pressed={user ? favoritesSet.has(id) : saved}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              (user ? favoritesSet.has(id) : saved)
                ? "text-primary fill-primary"
                : "text-foreground"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="px-5 -mt-8 relative pb-32">
        <h1 className="text-2xl font-display font-bold text-foreground mb-3">
          {event.title}
        </h1>

        <div className="flex flex-wrap gap-4 mb-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            {event.date}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            {event.time}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <MapPin className="w-4 h-4 text-primary" />
          {event.location}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-base font-display font-semibold text-foreground mb-2">
            Description
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Map placeholder */}
        <div className="mb-6">
          <h2 className="text-base font-display font-semibold text-foreground mb-2">
            Location
          </h2>
          <div className="glass-card h-40 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-secondary/50" />
            <div className="relative flex flex-col items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="text-xs text-muted-foreground bg-primary/20 px-3 py-1 rounded-full">
                {event.location}
              </span>
            </div>
          </div>
        </div>

        {/* Interested */}
        <div className="mb-6">
          <h2 className="text-base font-display font-semibold text-foreground mb-3">
            Interested
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] text-muted-foreground font-medium"
                  style={{
                    background: `hsl(${265 + i * 20} 60% ${30 + i * 10}%)`,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
              {event.interested}+
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/90 backdrop-blur-xl border-t border-border safe-bottom">
        <button className="w-full py-4 gradient-primary rounded-2xl text-primary-foreground font-display font-semibold text-base shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform">
          {event.price === 0 ? "Register Free" : `Buy Ticket $${event.price}`}
        </button>
      </div>
    </motion.div>
  );
};

export default EventDetail;
