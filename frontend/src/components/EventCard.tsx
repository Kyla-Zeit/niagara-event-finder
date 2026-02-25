import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import type { NiagaraEvent } from "@/data/events";
import { getUser } from "@/lib/auth";
import { useFavoritesApi } from "@/hooks/useFavoritesApi";
import { toast } from "@/components/ui/sonner";

interface Props {
  event: NiagaraEvent;
  onClick: (event: NiagaraEvent) => void;
  index: number;
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

function setTempFavorite(id: string, value: boolean) {
  const favs = readTempFavorites();
  if (value) favs.add(id);
  else favs.delete(id);
  writeTempFavorites(favs);
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

export default function EventCard({ event, onClick, index }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<number | null>(null);

  const user = getUser();
  const { favoritesSet, toggleFavorite, toggling } = useFavoritesApi(user ? user.id : null);

  const id = String(event.id);
  const [saved, setSaved] = useState(false);
  const [pendingNav, setPendingNav] = useState(false);

  useEffect(() => {
    if (user) return; // authed users use backend favorites
    const favs = readTempFavorites();
    setSaved(favs.has(id));
  }, [id, user]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleHeart = () => {
    // Signed in: save immediately to backend (no redirect)
    if (user) {
      toggleFavorite(id);
      toast.message(favoritesSet.has(id) ? "Removed" : "Saved");
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

    // 3) Navigate after a tiny delay so the user sees the change
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
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="relative rounded-2xl overflow-hidden glass-card cursor-pointer"
      onClick={() => onClick(event)}
    >
      <img
        src={event.image}
        alt={event.title}
        className="h-40 w-full object-cover"
      />

      {/* Heart: lights up immediately, then routes to Profile */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleHeart();
        }}
        disabled={pendingNav || toggling}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/40 backdrop-blur-md flex items-center justify-center border border-foreground/10 active:scale-95 transition-transform disabled:opacity-70"
        aria-label={(user ? favoritesSet.has(id) : saved) ? "Saved" : "Save"}
        aria-pressed={user ? favoritesSet.has(id) : saved}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            (user ? favoritesSet.has(id) : saved)
              ? "text-primary fill-primary"
              : "text-foreground"
          }`}
        />
      </button>

      <div className="p-3">
        <div className="text-xs text-muted-foreground mb-1">{event.date}</div>
        <div className="font-semibold text-sm">{event.title}</div>
      </div>
    </motion.div>
  );
}
